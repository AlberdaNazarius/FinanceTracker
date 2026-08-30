import { useEffect, useRef } from "react";
import usePageActionStore, { PageActionConfig } from "@/store/page-action-store";

export function usePageAction({ label, onClick }: PageActionConfig) {
  const setAction = usePageActionStore((state) => state.setAction);
  const handler = useRef(onClick);

  useEffect(() => {
    handler.current = onClick;
  }, [onClick]);

  useEffect(() => {
    setAction({ label, onClick: () => handler.current() });
    return () => setAction(null);
  }, [label, setAction]);
}
