import type { LocalTask } from "../utils/todoist"
import { completeTaskInLocalDatabase, completeTaskInTodoist } from "../api/tasks"
import type { MouseEventHandler } from "react"
import type { RenderedTask } from "../utils/todoist"
import { useTasks } from "@/contexts/TasksContext"

type ActiveTasksPanelProps = {
  tasks: RenderedTask[],
}

type ButtonProps = {
    onClick: MouseEventHandler
}

export default function ActiveTasksPanel() {
  const { renderTasks, tasksData, setTasks, isTaskDataLoading, activeTasks } = useTasks();

  if (activeTasks.length > 0) {
    return(
      <div className="py-8 pl-2 flex flex-row">
        {activeTasks.map((task, index)=> {
          return <div className="flex flex-col justify-evenly w-full">
            <div className="flex flex-row">
              <div className="pr-4 text-gray-500 my-auto"><CompleteTaskButton onClick={() => {
                completeTaskInLocalDatabase(task.id)
                completeTaskInTodoist(task.id)
                setTasks(tasksData.filter((taskFromData) => taskFromData.id != task.id))
              }}/>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm">Current Task</p>
                <h1 className="text-3xl font-bold">{task.content}</h1>
                <p className="text-left text-neutral-400 text-xs">{task.due ? renderTime(task.due, task.duration) : ""}</p>
              </div>
            </div>
          </div>
        })}
      </div>
    )
  } else 
    return <div className="py-8 pl-2 flex flex-row">
      <div className="pr-4 text-gray-500 my-auto"><CompleteTaskButton onClick={() => {}}/>
      </div>
      <div>
        <p className="text-on-surface-variant text-sm">Current Task</p>
        <h1 className="text-3xl font-semibold text-on-surface-variant">None</h1>
        <p className="text-left text-neutral-400 text-xs"></p>
      </div>
    </div>
}

export function CompleteTaskButton({onClick}: ButtonProps) {
  return (
    <button className="hover:bg-gray-300 hover:cursor-pointer w-7 h-7 rounded-full border-[3px] border-gray-300" onClick={onClick} />
  )
}

export function renderTime(due: string, duration?: string): string {
  if (!due) return "";

  // 1. Parse start time
  const [hrs24, mins] = due.split(':').map(Number);
    
  const formatTime = (h24: number, m: number) => {
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    const mStr = m.toString().padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  const startTimeLabel = formatTime(hrs24!, mins!);

  // 2. Calculate and format end time if duration exists
  if (duration) {
    const durationMinutes = parseFloat(duration);
        
    // Total minutes from start of the day
    const totalStartMinutes = hrs24! * 60 + mins!;
    const totalEndMinutes = totalStartMinutes + durationMinutes;

    // Convert back to 24h format (using % 1440 to wrap around midnight)
    const endHrs24 = Math.floor((totalEndMinutes / 60) % 24);
    const endMins = Math.floor(totalEndMinutes % 60);

    return `${startTimeLabel} - ${formatTime(endHrs24, endMins)}`;
  }

  return startTimeLabel;
}