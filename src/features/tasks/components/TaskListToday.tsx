import { getTasksToday, getAllTasks, completeTaskInLocalDatabase, completeTaskInTodoist } from "../api/tasks"
import type { TodoistTask, TaskListProps } from "../utils/todoist"
// import { useTasks } from "../../contexts/TasksContext"
import { useTasks } from "../../../contexts/TasksContext"
import TaskEntry from "./TaskEntry"
import type { MouseEventHandler, ReactNode } from "react"
import ActiveTasksPanel from "./ActiveTasksPanel"
import { daySegments } from "../../../contexts/TasksContext"

type Props = {
    taskListProps: TaskListProps
}

type ButtonProps = {
    onClick: MouseEventHandler
}

export default function TaskListToday() {
  const { renderTasks, tasksData, setTasks, isTaskDataLoading, activeTasks } = useTasks();

  // if (!isTaskDataLoading) {
  //     return
  // }

  return (
    <div className="h-fit bg-surface overflow-y-auto w-120">
      <ActiveTasksPanel/>

      <h1 className="text-on-surface font-bold pl-2">{new Date().toDateString()}</h1>

      <div className="flex flex-col gap-4 divide-y-1 divide-zinc-200 mt-2">
        {/* {renderTasks.map((task, index) => {
          return <TaskEntry index={index} key={task.id} task={task} setTasks={() => setTasks(tasksData.filter((taskFromData) => taskFromData.id != task.id))}></TaskEntry>
        })} */}
        {[{name: "Today"}].map((value) => {
          if (renderTasks.filter((task) => task.timeOfDayCategory == value.name).length == 0) {
            return
          }
          return (<div className="pt-2 border-b-1 border-zinc-200">
            <TimeLabel>{value.name}</TimeLabel>
            {renderTasks.filter((task) => task.timeOfDayCategory == value.name).map((task, index) => {
              return <TaskEntry index={index} key={task.id} task={task} setTasks={() => setTasks(tasksData.filter((taskFromData) => taskFromData.id != task.id))}></TaskEntry>
            })}
          </div>)
        })}

        {daySegments.map((value) => {
          if (renderTasks.filter((task) => task.timeOfDayCategory == value.name).length == 0) {
            return
          }
          return (<div className="pt-2 border-b-1 border-zinc-200">
            <TimeLabel>{value.name}</TimeLabel>
            {renderTasks.filter((task) => task.timeOfDayCategory == value.name).map((task, index) => {
              return <TaskEntry index={index} key={task.id} task={task} setTasks={() => setTasks(tasksData.filter((taskFromData) => taskFromData.id != task.id))}></TaskEntry>
            })}
          </div>)
        })}

      </div>
    </div>
  )
}

function CompleteTaskButton({onClick}: ButtonProps) {
  return (
    <button className="hover:bg-gray-300 hover:cursor-pointer w-3 h-3 rounded-full border-[2px] border-gray-300" onClick={onClick} />
  )
}

function TimeLabel({children}: {children: ReactNode}) {
  return (
    <h2 className="text-zinc-400 font-semibold border-b-1 border-zinc-200 text-xs pb-1">{children}</h2>
  )
}