/// <reference types="chromecast-caf-sender" />

import { useEffect, useRef } from "react";

import { VideoPlayerButton } from "@/components/player/internals/Button";
import { useChromecastAvailable } from "@/hooks/useChromecastAvailable";
import { usePlayerStore } from "@/stores/player/store";

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "google-cast-launcher": any;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export interface ChromecastProps {
  className?: string;
}

export function Chromecast({ className }: ChromecastProps) {
  const isCasting = usePlayerStore((s) => s.interface.isCasting);
  const available = useChromecastAvailable();
  const launcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (available !== true) return;
    if (!launcherRef.current || launcherRef.current.children.length > 0) return;
    const launcher = document.createElement("google-cast-launcher");
    launcherRef.current.appendChild(launcher);
  }, [available]);

  if (available !== true) {
    return null;
  }
  // i aint gonna knock on wood -- taylor swift reference
  return (
    <VideoPlayerButton
      className={[
        className ?? "",
        "google-cast-button",
        "cast-button-container",
        isCasting ? "casting" : "",
      ].join(" ")}
    >
      <div ref={launcherRef} />
    </VideoPlayerButton>
  );
}
