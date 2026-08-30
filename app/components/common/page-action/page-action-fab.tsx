"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePageActionStore from "@/store/page-action-store";

// Mobile surface for the action a page declares via usePageAction. On desktop
// the same action is rendered as a labeled button in the app bar instead.
export default function PageActionFab() {
  const action = usePageActionStore((state) => state.action);

  if (!action) return null;

  return (
    <Button
      onClick={action.onClick}
      aria-label={action.label}
      className="fixed bottom-20 right-4 z-40 size-14 rounded-full shadow-lg cursor-pointer md:hidden"
    >
      <Plus className="size-6" />
    </Button>
  );
}
