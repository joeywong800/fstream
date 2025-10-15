/// <reference types="chromecast-caf-sender" />
// idk why but it seems useless
// btw i will review this again if i ever get bored enough again if aint working which is likely to happen! <3
import fscreen from "fscreen";

import { MWMediaType } from "@/backend/metadata/types/mw";
import {
  DisplayCaption,
  DisplayInterface,
  DisplayInterfaceEvents,
  DisplayMeta,
} from "@/components/player/display/displayInterface";
import { conf } from "@/setup/config";
import { LoadableSource } from "@/stores/player/utils/qualities";
import { processCdnLink } from "@/utils/cdn";
import { canFullscreen, canFullscreenAnyElement } from "@/utils/detectFeatures";
import { makeEmitter } from "@/utils/events";

export interface ChromeCastDisplayInterfaceOptions {
  controller: cast.framework.RemotePlayerController;
  player: cast.framework.RemotePlayer;
  instance: cast.framework.CastContext;
}

export function makeChromecastDisplayInterface(
  ops: ChromeCastDisplayInterfaceOptions,
): DisplayInterface {
  const { emit, on, off } = makeEmitter<DisplayInterfaceEvents>();

  let isPaused = false;
  let playbackRate = 1;
  let source: LoadableSource | null = null;
  let videoElement: HTMLVideoElement | null = null;
  let containerElement: HTMLElement | null = null;
  let isFullscreen = false;
  let isSeeking = false;
  let startAt = 0;
  let meta: DisplayMeta = {
    title: "",
    type: MWMediaType.MOVIE,
  };
  let caption: DisplayCaption | null = null;

  const handlePlayerChange = (e: cast.framework.RemotePlayerChangedEvent) => {
    switch (e.field) {
      case "volumeLevel":
        emit("volumechange", e.value);
        break;
      case "currentTime":
        if (!isSeeking) emit("time", e.value);
        break;
      case "duration":
      case "mediaInfo":
        emit("duration", e.value?.duration ?? e.value ?? 0);
        break;
      case "playerState": {
        const isLoading = e.value === "BUFFERING";
        const isPlaying = e.value === "PLAYING";
        const isNowPaused = e.value === "PAUSED";

        emit("loading", isLoading);
        if (isPlaying) emit("play", undefined);
        if (isNowPaused) emit("pause", undefined);

        isPaused = isNowPaused;
        break;
      }
      case "isMuted":
        emit("volumechange", e.value ? 0 : ops.player.volumeLevel);
        break;
      default:
        break;
    }
  };

  ops.controller?.addEventListener(
    cast.framework.RemotePlayerEventType.ANY_CHANGE,
    handlePlayerChange,
  );

  const stopListening = () => {
    ops.controller?.removeEventListener(
      cast.framework.RemotePlayerEventType.ANY_CHANGE,
      handlePlayerChange,
    );
  };

  const loadMedia = () => {
    if (!source) {
      ops.controller?.stop();
      return;
    }

    let mimeType = "video/mp4";
    if (source.type === "hls") mimeType = "application/x-mpegurl";

    const contentUrl = processCdnLink(source.url);
    let finalUrl = contentUrl;

    if (source.type === "hls") {
      try {
        const allProxies = conf().M3U8_PROXY_URLS;
        const enabledRaw = localStorage.getItem("m3u8-proxy-enabled");
        let enabledMap: Record<string, boolean> = {};
        if (enabledRaw) {
          try {
            enabledMap = JSON.parse(enabledRaw);
          } catch {
            /* ignore */
          }
        }
        const enabled = allProxies.filter(
          (_, idx) => enabledMap[idx.toString()] !== false,
        );
        const proxies = enabled.length > 0 ? enabled : allProxies;
        if (proxies.length > 0) {
          const base = proxies[Math.floor(Math.random() * proxies.length)];
          const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
          finalUrl = `${cleanBase}/?destination=${encodeURIComponent(contentUrl)}`;
        }
      } catch (err) {
        console.warn(
          "Chromecast: M3U8 proxy setup failed, using direct URL",
          err,
        );
      }
    }

    const mediaInfo = new chrome.cast.media.MediaInfo(finalUrl, mimeType);
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.customData = { playbackRate };

    const metaData = new chrome.cast.media.GenericMediaMetadata();
    metaData.title = meta.title || "P-Stream";

    try {
      const logoUrl = new URL("/favicon.ico?v=2", window.location.origin).href;
      metaData.images = [new chrome.cast.Image(logoUrl)];
    } catch (err) {
      console.warn("Chromecast: Could not attach logo to metadata", err);
    }

    mediaInfo.metadata = metaData;

    if (caption?.url) {
      try {
        const textTrack = new chrome.cast.media.Track(
          1,
          chrome.cast.media.TrackType.TEXT,
        );
        textTrack.trackContentType = "text/vtt";
        textTrack.trackContentId = caption.url;
        textTrack.language = caption.language || "en";
        textTrack.name = caption.language || "Subtitles";
        textTrack.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
        mediaInfo.tracks = [textTrack];
      } catch (err) {
        console.warn("Chromecast: Failed to create caption track", err);
      }
    }

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    request.currentTime = startAt;
    if (caption?.url) request.activeTrackIds = [1];

    const session = ops.instance.getCurrentSession();
    if (!session) {
      emit("error", {
        type: "global",
        errorName: "no_cast_session",
        message: "No active Cast session",
      });
      return;
    }

    session
      .loadMedia(request)
      .then(() => {
        emit("loading", false);
      })
      .catch((err: unknown) => {
        console.error("Chromecast loadMedia failed:", err);
        emit("loading", false);
        emit("error", {
          type: "global",
          errorName: "chromecast_load_failure",
          message: (err as Error)?.message || String(err),
        });
      });
  };

  const updateCaption = (newCaption: DisplayCaption | null) => {
    caption = newCaption;
    const session = ops.instance.getCurrentSession();
    const media = session?.getMediaSession();

    if (media && newCaption?.url) {
      try {
        const req = new chrome.cast.media.EditTracksInfoRequest([1]);
        (media as any).editTracksInfo(req);
        return;
      } catch (err) {
        console.warn("Chromecast: editTracksInfo failed, reloading media", err);
      }
    }
    if (source) loadMedia();
  };

  const handleFullscreenChange = () => {
    isFullscreen =
      !!document.fullscreenElement ||
      !!(document as any).webkitFullscreenElement;
    emit("fullscreen", isFullscreen);
    if (!isFullscreen) emit("needstrack", false);
  };

  fscreen.addEventListener("fullscreenchange", handleFullscreenChange);

  const api: DisplayInterface = {
    on,
    off,
    getType() {
      return "casting";
    },
    destroy() {
      stopListening();
      fscreen.removeEventListener("fullscreenchange", handleFullscreenChange);
      videoElement = null;
      containerElement = null;
    },
    load({ source: newSource, startAt: time }) {
      source = newSource;
      startAt = time ?? 0;
      emit("loading", true);
      loadMedia();
    },
    changeQuality() {
      // Not supported
    },
    setCaption: updateCaption,
    processVideoElement(video) {
      videoElement = video;
      if (source) loadMedia();
    },
    processContainerElement(container) {
      containerElement = container;
    },
    setMeta(newMeta) {
      meta = newMeta;
      if (source) loadMedia();
    },
    pause() {
      if (!ops.player.isPaused) {
        ops.controller.playOrPause();
      }
    },
    play() {
      if (ops.player.isPaused) {
        ops.controller.playOrPause();
      }
    },
    setSeeking(active) {
      if (active === isSeeking) return;
      isSeeking = active;
      if (active) {
        isPaused = ops.player.isPaused;
        this.pause();
      } else if (!isPaused) {
        this.play();
      }
    },
    setTime(time) {
      if (Number.isNaN(time)) return;
      const clamped = Math.max(
        0,
        Math.min(time, ops.player.duration || Infinity),
      );
      ops.player.currentTime = clamped;
      ops.controller.seek();
      emit("time", clamped);
    },
    async setVolume(volume) {
      const clamped = Math.min(1, Math.max(0, volume));
      ops.player.volumeLevel = clamped;
      ops.controller.setVolumeLevel();
      emit("volumechange", clamped);
    },
    toggleFullscreen() {
      if (isFullscreen) {
        isFullscreen = false;
        emit("fullscreen", false);
        emit("needstrack", false);
        if (fscreen.fullscreenElement) fscreen.exitFullscreen();
        return;
      }

      if (!canFullscreen() || fscreen.fullscreenElement) return;

      isFullscreen = true;
      emit("fullscreen", true);
      if (canFullscreenAnyElement() && containerElement) {
        fscreen.requestFullscreen(containerElement);
      }
    },
    togglePictureInPicture() {
      // Not supported during casting
    },
    startAirplay() {
      // Not supported
    },
    setPlaybackRate(rate) {
      playbackRate = rate;
      emit("playbackrate", rate);
    },
    getCaptionList() {
      return [];
    },
    getSubtitleTracks() {
      return [];
    },
    async setSubtitlePreference() {
      return Promise.resolve();
    },
    changeAudioTrack() {
      // Not supported
    },
  };

  return api;
}
