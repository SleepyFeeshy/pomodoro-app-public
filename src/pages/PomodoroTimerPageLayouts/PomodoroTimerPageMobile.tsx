import { useEffect, useState, useRef, useContext } from "react";
import "../../App.css";
import { useLocation } from "react-router-dom";

// Hooks
import { useTimer, PomodoroPhase } from "../../contexts/TimerContext";

import {ThemeContext, SettingsContext} from "../../App.js"

import PomodoroTimer from "../../features/pomodoro-timer/components/PomodoroTimer";

function PomodoroTimerPageMobile() {
  const location = useLocation();
  const {timeRemaining, isTimerRunning, setIsTimerRunning, toggleTimer, setTimeRemaining, 
    setToWork, setToBreak, setToLongBreak, pomodoroPhase
  } = useTimer()
  console.log(timeRemaining)

  // Supabase
  const settingsContext = useContext(SettingsContext)

  const [bgFromState, setBgFromState] = useState('')

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
    <main className={`flex h-[calc(100vh-128px)] md:h-[calc(100vh-64px)] ${bgFromState} z-0`}>
	  	<div className="flex flex-col h-full w-full mx-auto my-auto md:w-auto">
        <div className="my-auto h-full">
          <PomodoroTimer/>
        </div>
      </div>

    </main>
  );
}

export default PomodoroTimerPageMobile;