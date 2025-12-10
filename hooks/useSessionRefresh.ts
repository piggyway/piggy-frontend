import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSessionRefresh() {
  const { update } = useSession();

  const refreshSession = useCallback(async () => {
    // 使用next-auth的update方法重新获取session
    await update();
  }, [update]);

  return refreshSession;
}
