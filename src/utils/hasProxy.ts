import { isExtensionActive } from "@/backend/extension/messaging";
import { useAuthStore } from "@/stores/auth";

const hasExtension = await isExtensionActive();
const hasProxy = Boolean(useAuthStore.getState().proxySet);

export function hasProxyCheck(): boolean {
  return hasExtension || hasProxy;
}
