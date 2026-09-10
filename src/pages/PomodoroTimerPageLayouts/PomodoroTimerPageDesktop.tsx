import { useEffect, useState, useRef, useContext } from "react";
import "../../App.css";

// Components
import TaskListToday from "../../features/tasks/components/TaskListToday";
import PomodoroTimer from "../../features/pomodoro-timer/components/PomodoroTimer";
import DashboardCard from "../../components/simple/DashboardCard";
import DashboardCardHeader from "../../components/simple/DashboardCardHeader";
import TaskSyncIndicator from "../../components/simple/TaskSyncIndicator";
import DailyPomodoros from "@/features/pomodoro-analytics/components/charts/DailyPomodorosLineChart";
// Hooks
import { useTimer, PomodoroPhase } from "../../contexts/TimerContext";
import { useTasks } from "../../contexts/TasksContext";


import {SettingsContext} from "../../App.js"
import type { TaskListProps } from "../../features/tasks/utils/todoist";

type PomodoroTimerPageDesktop = {
	taskListProps: TaskListProps
}

function PomodoroTimerPageDesktop() {
  const {timeRemaining, pomodoroPhase
  } = useTimer()
  console.log(timeRemaining)

  const [bgFromState, setBgFromState] = useState('')

  const {fetchTasks, isTaskDataLoading} = useTasks()

  // theme
  useEffect(() => {
    if (pomodoroPhase == PomodoroPhase.Work) {
      setBgFromState("bg-pomogreen-bg dark:bg-neutral-950")
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setBgFromState("bg-pomored-bg")
    } else {
      setBgFromState("bg-pomorange-bg")
    }
  }, [pomodoroPhase])
  return (
    <main className={`flex flex-col z-0`}>
      <div className="flex flex-row mx-auto my-auto gap-5 h-200">
        <DashboardCard className="bg-surface my-auto h-full gap-10 p-6">
          <div className="flex justify-between">
            <DashboardCardHeader>Tasks for Today</DashboardCardHeader>
            {/* <TaskSyncIndicator onClick={fetchTasks}/>  */}
            {/* <button className="text-zinc-400 text-xs font-semibold hover:cursor-pointer hover:underline" onClick={fetchTasks}>Refresh</button> */}
          </div>
          <TaskListToday/>

        </DashboardCard>
        <div className="my-auto h-full">
          <PomodoroTimer/>
        </div>
      </div>
    </main>
  );
}

export default PomodoroTimerPageDesktop;