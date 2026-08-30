import { useCallback, useEffect, useState } from "react";
import { TagService } from "@/service/client/tag.service";
import { Tag } from "@/types/tag";

export function useTags(enabled = true) {
  const [tags, setTags] = useState<Tag[]>([]);

  const load = useCallback(async () => {
    try {
      const result = await TagService.getTags();
      return result.data ?? [];
    } catch (error) {
      console.error("Failed to load tags:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    load().then((result) => {
      if (mounted && result) setTags(result);
    });

    return () => {
      mounted = false;
    };
  }, [enabled, load]);

  const refetch = useCallback(async () => {
    const result = await load();
    if (result) setTags(result);
  }, [load]);

  return { tags, refetch };
}
