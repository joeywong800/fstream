import { useTranslation } from "react-i18next";

import { usePlayerStore } from "@/stores/player/store";

const CASTING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cast"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.9 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line></svg>`;

export function CastingNotification() {
  const { t } = useTranslation();
  const isLoading = usePlayerStore((s) => s.mediaPlaying.isLoading);
  const display = usePlayerStore((s) => s.display);
  const isCasting = display?.getType() === "casting";
  const remotePlayer = usePlayerStore((s) => s.casting.player);

  if (isLoading || !isCasting) return null;

  let deviceName = remotePlayer?.displayName || t("player.casting.device");
  if (deviceName === "Default Media Receiver") {
    deviceName = t("player.casting.device"); // e.g., "your TV"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="rounded-full bg-opacity-10 bg-video-buttonBackground p-3 brightness-100 grayscale"
        dangerouslySetInnerHTML={{ __html: CASTING_SVG }}
      />
      <p className="text-center">
        {t("player.casting.to", { device: deviceName })}
      </p>
    </div>
  );
}
