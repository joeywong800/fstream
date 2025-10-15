import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { conf } from "@/setup/config";
import { TurnstileProvider, getTurnstileToken } from "@/stores/turnstile";

export interface TurnstilePartProps {
  onVerified: () => void;
}

export function TurnstilePart(props: TurnstilePartProps) {
  const { t } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Skip if no turnstile key configured
    if (!conf().TURNSTILE_KEY) {
      props.onVerified();
      return;
    }

    setIsVerifying(true);
    setError(false);
    getTurnstileToken()
      .then(() => {
        setIsVerifying(false);
        props.onVerified();
      })
      .catch(() => {
        setIsVerifying(false);
        setError(true);
      });
  }, [props]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-[43em] max-h-full p-5 md:p-10 rounded-lg bg-dropdown-altBackground select-none z-50">
        <div className="w-full h-full flex flex-col gap-6 md:gap-8">
          <h2 className="text-type-emphasis font-bold text-lg md:text-xl">
            {t("player.turnstile.title")}
          </h2>
          <p className="text-type-emphasis mb-4">
            {t("player.turnstile.description")}
          </p>
        </div>
        <div className="flex justify-center">
          {isVerifying && <TurnstileProvider />}
        </div>
        {error && (
          <p className="text-type-danger text-center">
            {t("player.turnstile.error")}
          </p>
        )}
      </div>
    </div>
  );
}
