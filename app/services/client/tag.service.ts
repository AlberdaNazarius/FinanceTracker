import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {Tag} from "@/types/tag";

const getTags = async (): Promise<{data: Tag[]}> => {
  const response = await axios.get(ApiRoutes.TAG);
  return response.data;
}

/** Resolves names to tags, creating the ones that do not exist yet. */
const resolveTags = async (names: string[]): Promise<Tag[]> => {
  if (names.length === 0) return [];
  const response = await axios.post(ApiRoutes.TAG, {names});
  return response.data?.data ?? [];
}

export const TagService = {
  getTags,
  resolveTags
}
