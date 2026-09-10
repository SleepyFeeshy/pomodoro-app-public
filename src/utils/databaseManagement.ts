import Database from '@tauri-apps/plugin-sql';
import { invoke } from "@tauri-apps/api/core";

type LogData = {
  id: string,
  finished_at: string,
  duration: number,
  session_type: string
}

import type { Session } from 'react-router-dom';

export type SessionByHour = {
  date: string,
  time: string,
  hour: string,
}

export type SessionCountByDay = {
  date: string,
  value: number
}

export async function countPomodorosTodayInLocalDb() {
  const db = await Database.load('sqlite:pomodorodatabase_public.db');
  const result = await db.select(
    `
    SELECT DATE(datetime(finished_at)) AS date, COUNT(*) as count
    FROM sessions s
    JOIN session_types t ON s.session_type_id = t.id
    WHERE s.session_type_id = '550e8400-e29b-41d4-a716-446655440000'
    AND finished_at >= DATE('now', 'localtime')
    AND finished_at < DATE('now', 'localtime', '+1 day')
  `,
  );
  // console.log(result[0].count);
  return result[0].count;
}

export async function getData(): Promise<SessionCountByDay[]> {
  return await invoke("get_data");
}

export async function getDataToday(): Promise<SessionByHour[]> {
  return await invoke("get_data_today");
}

export async function getDataPastThreeDays() {
  return await invoke("get_data_past_three_days");
}

export async function getPixelaTokenKey() {
  return await invoke("get_pixela_token_key")
}

export async function syncDatabasesLocalToRemote() {
  return await invoke("sync_databases")
}

export async function syncDatabasesRemoteToLocal() {
  return await invoke("sync_db_remote_to_local")
}

export async function syncTwoWay() {
  try {
    await syncDatabasesLocalToRemote()
  } catch (e) {
    console.error("Error syncing local to remote: " + e)
  }
  
  try {
    await syncDatabasesRemoteToLocal()
  } catch (e) {
    console.error("Error syncing remote to local: " + e)
  }
  
}
