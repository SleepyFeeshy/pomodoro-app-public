import { load } from "@tauri-apps/plugin-store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useInterval } from "../utils/lib";

import { fullSyncTasksToLocal, getTasksTodayLocal, partialSyncTasksToLocal } from "../features/tasks/api/tasks";
import type { LocalTask, RenderedTask } from "../features/tasks/utils/todoist";
import { isTaskActiveNow } from "../features/tasks/utils/todoist";

import type { Dispatch, ReactNode, SetStateAction } from "react";

type TasksState = {
    renderTasks: RenderedTask[],
    isTaskDataLoading: boolean,
    tasksData: LocalTask[],
    activeTasks: RenderedTask[],
    setTasks: Dispatch<SetStateAction<LocalTask[]>>,
    fetchTasks: () => void
}

type TaskProviderProps = {
  children?: ReactNode
}

export type DailyVisit = {
  has_visited: boolean,
  time: string
}

export const TasksContext = createContext<TasksState>({
  renderTasks: [],
  isTaskDataLoading: true,
  tasksData: [],
  activeTasks: [],
  setTasks: () => {},
  fetchTasks: async () => {}
})

export default function TasksProvider({children}: TaskProviderProps) {
  const [tasksData, setTasks] = useState<LocalTask[]>([])
  const [isTaskDataLoading, setIsTaskDataLoading] = useState(false)
  const [activeCheckTicks, setTicks] = useState(0)

  const fetchProjects = async () => {
        
  }

  // Fetch taskData
  const fetchTasks = async () => {
    setIsTaskDataLoading(true)
    const response_presync = await getTasksTodayLocal()
    const result_presync = await response_presync
    setTasks(result_presync)

    // Catch no internet
    try {
      await partialSyncTasksToLocal()
      setIsTaskDataLoading(false)
    } catch(e) {
      console.log(e)
      console.error("Full Error Object:", JSON.stringify(e, null, 2));
    }

    const response = await getTasksTodayLocal()
    const result = await response
    setTasks(result)
    console.log(result)
  }

  const syncTasks = async () => {
    await partialSyncTasksToLocal()
    setIsTaskDataLoading(true)
  }

  // Sync tasks
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
              console.log("daily visit")
              // syncProjectsToLocal()
              // syncSectionsToLocal()
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
    // fetchTasks()
  }, [])
    
  // Add due date, duration, and activeNow properties to taskData to make renderTasks
  const renderTasks: RenderedTask[] = useMemo(() => {
    return tasksData.map(task => {
      // Check if task is active now
      const activeNow = isTaskActiveNow(task)
      
      // Calculate start and end time
      const dueDate = task.due !== undefined ? JSON.parse(task.due).date : ''; // convert string to Date
      const durationMinutes = (task.duration !== null ? JSON.parse(task.duration!).amount : 0);

      // getEndDate(dueDate, durationMinutes)
      const timeOfDayCategory = categorizeTimeSegment(dueDate, durationMinutes)
      console.log(timeOfDayCategory)

      // Calculate time of day segment
      const renderedTask = {
        ...task,
        due: dueDate.split("T")[1] ?? null,
        duration: durationMinutes,
        activeNow: activeNow,
        timeOfDayCategory: timeOfDayCategory
      }

      return renderedTask
    })
  }, [tasksData, activeCheckTicks])

  const activeTasks: RenderedTask[] = renderTasks.filter((task) => task.activeNow)

  useInterval(() => {
    setTicks(activeCheckTicks + 1)
  }, 1000 * 60)

  useInterval(() => {
    fetchTasks()
  }, 5 * 1000 * 60)

  const data = {
    renderTasks, isTaskDataLoading, tasksData, setTasks, fetchTasks, activeTasks
  }
  return <TasksContext.Provider value={data}>{children} </TasksContext.Provider>
    
}

export const useTasks = () => {
  const tasks = useContext(TasksContext)
  return tasks
}

function getEndDate(dueDate: string, duration: string): Date {
  // Parse due date
  const date = new Date(dueDate)
  const durationFloatMinutes = parseFloat(duration)
  
  // Add duration to due date
  const endDate = new Date(date.getTime() + durationFloatMinutes * 60000)
  // console.log(`Start Date: ${date}`)
  // console.log(`End date: ${new Date(date.getTime() + durationFloatMinutes * 60000)}`)
  return endDate
}

export const daySegments: {name: string, time: Date}[] = [
  {name: "Morning", time: new Date(new Date().setHours(3, 0, 0))}, 
  {name: "Afternoon", time:  new Date(new Date().setHours(12,0,0))},
  {name: "Night", time:  new Date(new Date().setHours(18,0,0))}
]

function categorizeTimeSegment(dueDate: string, duration: string): string {
  if (!dueDate.includes(":")) return "Today"
  const date = getEndDate(dueDate, duration)
  // console.log(daySegments[0]?.time.getTime())
  // daySegments.map((daySegmentDate) => console.log(daySegmentDate))
  const sortedDaySegments = daySegments.sort((a, b) => {return (a.time.getTime() - b.time.getTime())})
  console.log(`${date}`)

  // TODO: GENERALIZE ALGORITHM
  for(let i = 1; i < sortedDaySegments.length; i++) {
    if (date < sortedDaySegments[i]!.time) {
      return sortedDaySegments[i-1]!.name
    }
  }
  return sortedDaySegments.slice(-1)[0]!.name

  // if (date < sortedDaySegments[0]!.time) {
  //   return sortedDaySegments.slice(-1)[0]!.name
  // } else if (date < sortedDaySegments[1]!.time) {
  //   return sortedDaySegments[0]!.name
  // } else if (date < sortedDaySegments[2]!.time){
  //   return sortedDaySegments[1]!.name
  // } else {
  //   return sortedDaySegments[2]!.name
  // }
}