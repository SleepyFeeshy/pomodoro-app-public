import { invoke } from "@tauri-apps/api/core"

export type WeeklyHeatmapPoint = {
  day_of_week: number, // 0 (Sunday) to 6 (Saturday)
  hour: number,        // 0 to 23
  count: number, 
}

export async function getWeeklyHeatmap(): Promise<WeeklyHeatmapPoint[]> {
  return await invoke("get_weekly_heatmap")
}