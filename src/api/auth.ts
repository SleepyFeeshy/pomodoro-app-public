import type { UserProfile } from "@/contexts/AuthContext";
import { invoke } from "@tauri-apps/api/core";

export async function decode_jwt_token(token: string): Promise<UserProfile> {
  return await invoke("decode_jwt_token", {idToken: token})
}

export async function sign_in_or_create_user(token: string): Promise<UserProfile> {
  return await invoke("sign_in_or_create_user", {idToken: token})
}
