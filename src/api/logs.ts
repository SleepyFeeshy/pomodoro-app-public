import { invoke } from "@tauri-apps/api/core";

export type NewLog = {
  id: string,
  finished_at: string,
  duration: number,
  session_type_id: string,
  session_type: string
}

type LogData = {
  id: string,
  finished_at: string,
  duration: number,
  session_type: string
}

export async function createLog(uuid: string, time:string, duration: number, session_type_id: string): Promise<NewLog> {
  return await invoke("create_log", {id: uuid, timestamp: time, duration: duration, sessionTypeId: session_type_id})
}

export async function uploadLogToRemote(new_log: NewLog): Promise<NewLog> {
  return await invoke("upload_log_to_remote", {newLog: new_log})
}

export async function getDataForLogs(): Promise<LogData[]> {
  return await invoke("get_data_for_logs");
}

export async function deleteLog(uuid: string) {
  return await invoke("delete_log", {id: uuid})
}
