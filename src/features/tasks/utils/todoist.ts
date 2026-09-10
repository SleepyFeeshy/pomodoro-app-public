
type Due = {
    date: string
}

type Duration = {
    amount: number,
    unit: string
}

export type TodoistTask = {
  id: string,
  content: string,
  duration?: Duration,
  due?: Due
}

export type LocalTask = {
  id: string,
  content: string,
  duration?: string,
  due?: string,
  is_deleted: boolean
}


export type TaskTableData = {
  id: string,
  content: string,
  duration?: Duration,
  due: string,
  activeNow: boolean
}

export type RenderedTask = {
  id: string,
  content: string,
  duration?: string,
  due?: string,
  activeNow: boolean,
  timeOfDayCategory: string
}

export type TaskListProps = {
    renderTasks: RenderedTask[],
    isTaskDataLoading: boolean,
    fetchTasks?: () => void,
    tasksData?: LocalTask[],
}

type TaskResponse = {
    results: TodoistTask[]
}

export function isTaskActiveNow(task: LocalTask): boolean {
  if (!task.due) return false;

  const dueDate = new Date(JSON.parse(task.due).date); // convert string to Date
  const durationMinutes = (task.duration !== null ? JSON.parse(task.duration!).amount : 0);
  console.log((task.duration))

  const taskStart = dueDate;
  const taskEnd = new Date(dueDate.getTime() + durationMinutes * 60000);

  const now = new Date();

  return now >= taskStart && now <= taskEnd;
}

