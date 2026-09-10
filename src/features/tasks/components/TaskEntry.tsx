import type { RenderedTask } from "../utils/todoist"
import { completeTaskInLocalDatabase, completeTaskInTodoist } from "../api/tasks"
import type { MouseEventHandler } from "react"
import TaskModal from "./TaskModal"

type TaskEntryProps = {
    index: number,
    task: RenderedTask,
    setTasks: () => void
}

type ButtonProps = {
    onClick: MouseEventHandler
}

export default function TaskEntry({task, setTasks, index}: TaskEntryProps) {
  return (
    <div className={`w-full py-2 pl-2 flex gap-3 text-sm border-taskborder ${task.activeNow ? "bg-activetask": "bg-surface hover:bg-surface-hover"}`}>
      <div className="flex justify-center">
        <div className="py-0.5 text-gray-500"><CompleteTaskButton onClick={() => {
          completeTaskInLocalDatabase(task.id)
          completeTaskInTodoist(task.id)
          setTasks()
        }}/></div>
      </div>
            
      <TaskModal taskData={task} setTasks={setTasks}>
        <div className="w-full flex flex-col justify-start gap-0.5">
          <p className="text-left text-neutral-800 dark:text-white">{task.content}</p>
          <p className="text-left text-neutral-400 text-xs">{task.due ? renderTime(task.due, task.duration) : ""}</p>
        </div>
      </TaskModal>
    </div>
  )
}

export function CompleteTaskButton({onClick}: ButtonProps) {
  return (
    <button className="hover:bg-gray-300 hover:cursor-pointer w-5 h-5 rounded-full border-[2px] border-gray-300" onClick={onClick} />
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