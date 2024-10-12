import { CardManagerR2 } from "./card-manager-r2";
import { CardManagerKV } from "./card-manager-kv";

const implementation: "R2" | "KV" = "R2";

export const CardManager =
  implementation === "R2" ? CardManagerR2 : CardManagerKV;
