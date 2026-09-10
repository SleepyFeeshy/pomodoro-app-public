import { load } from "@tauri-apps/plugin-store";

import { useEffect, useMemo, useState } from "react";

import type { DailyVisit } from "@/contexts/TasksContext";
import { useInterval } from "../../../utils/lib";
import { fullSyncTasksToLocal, getTasksTodayLocal, partialSyncTasksToLocal } from "../api/tasks";
import type { LocalTask, RenderedTask } from "../utils/todoist";
import { isTaskActiveNow } from "../utils/todoist";

export function useTodoistTasks() {
  const [tasksData, setTasks] = useState<LocalTask[]>([])
  const [isTaskDataLoading, setIsTaskDataLoading] = useState(true)
  const [activeCheckTicks, setTicks] = useState(0)

  const fetchTasks = async () => {
    // catch no internet
    try {
      await partialSyncTasksToLocal()
    } catch(e) {
      console.log(e)
    }

    const response = await getTasksTodayLocal()
    const result = await response
    setTasks(result)
    console.log(result)
  }

  const deleteLocalTask = async(taskId: string) => {
    setTasks(tasksData.filter(task => {
      return (taskId != task.id)
    }))
  }

  const syncTasks = async () => {
    await partialSyncTasksToLocal()
  }

  // task data
  useEffect(() => {
    const getDailyVisit = async () => {
      const store = await load('localStorage.json', { autoSave: false });
      await store.get<DailyVisit>("daily_visit").then(
        (value) => {
          const last_visit_date = new Date(value!.time).toDateString()
          const today = new Date().toDateString()

          console.log(last_visit_date)
          console.log(today)

          if (today != last_visit_date) {
            console.log(last_visit_date)
            console.log(today)
            // catch no internet
            try {
              fullSyncTasksToLocal()
            } catch(e) {
              console.log(e)
              return
            }
          }
        }
      );
      await store.set('daily_visit', {
        has_visited: true,
        time: new Date().toISOString()
      });
      await store.save()
      await store.close()
    }
    getDailyVisit();
    fetchTasks()
  }, [])
    
  const renderTasks: RenderedTask[] = useMemo(() => {
    return tasksData.map(task => {
      const activeNow = isTaskActiveNow(task)
      const dueDate = task.due !== undefined ? JSON.parse(task.due).date : ''; // convert string to Date
      const durationMinutes = (task.duration !== null ? JSON.parse(task.duration!).amount : 0);
      return {
        ...task,
        due: dueDate.split("T")[1] ?? null,
        duration: durationMinutes,
        activeNow: activeNow
      }
    })
  }, [tasksData, activeCheckTicks])

  useInterval(() => {
    setTicks(activeCheckTicks + 1)
  }, 1000 * 60)

  useInterval(() => {
    fetchTasks()
  }, 5 * 1000 * 60)

  return {
    renderTasks, isTaskDataLoading, tasksData, setTasks, fetchTasks
  }
}