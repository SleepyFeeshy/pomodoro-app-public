import "../App.css";
import { useLocation } from "react-router-dom";
// Assets
import timerEndSound from "/break.wav"

// Hooks
import { useShell } from "./Shellwrapper";

import type { TaskListProps } from "../features/tasks/utils/todoist";

import { platform } from "@tauri-apps/plugin-os";
import PomodoroTimerPageDesktop from "./PomodoroTimerPageLayouts/PomodoroTimerPageDesktop";
import PomodoroTimerPageMobile from "./PomodoroTimerPageLayouts/PomodoroTimerPageMobile";

type PomodoroTimerPage = {
	taskListProps: TaskListProps
}

function PomodoroTimerPage() {
  const location = useLocation();

  // Supabase
  const audio = new Audio(timerEndSound);

  if (window.innerWidth > 430) {
    return <PomodoroTimerPageDesktop/>
  } else {
    return <PomodoroTimerPageMobile/>
  }
}

export default PomodoroTimerPage;