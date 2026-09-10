import { invoke } from "@tauri-apps/api/core"
import type { LocalTask } from "../utils/todoist"

export async function deleteTask(uuid: string) {
  await invoke("delete_task_in_remote", {taskId: uuid})
  await invoke("delete_task_in_local", {taskId: uuid})
}

export async function getAllTasks() {
  return await invoke("get_all_tasks");
}

export async function getTasksToday() {
  // return await invoke("get_tasks_today");
  return await invoke("get_tasks_today");
}

export async function getTasksTodayLocal(): Promise<LocalTask[]> {
  // return await invoke("get_tasks_today");
  return await invoke("get_tasks_today_from_local");
}

export async function getAllProjects() {
  return await invoke("get_all_projects");
}

export async function syncProjectsToLocal() {
  return await invoke("sync_projects_to_local");
}

export async function fullSyncTasksToLocal() {
  await invoke("sync_projects_to_local");
  await invoke("sync_sections_to_local");
  await invoke("full_sync_tasks_to_local");
}

export async function partialSyncTasksToLocal() {
  await invoke("sync_projects_to_local");
  await invoke("sync_sections_to_local");
  await invoke("partial_sync_tasks_to_local");
  // await invoke("full_sync_tasks_to_local");
}


export async function syncSectionsToLocal() {
  return await invoke("sync_sections_to_local");
}

export async function completeTaskInLocalDatabase(task_id: string) {
  return await invoke("complete_task_in_local", { taskId: task_id });
}

export async function completeTaskInTodoist(task_id: string) {
  return await invoke("complete_task_in_remote", { taskId: task_id });
}
