import PauseIcon from "../../../components/icons/PauseIcon"
import PlayIcon from "../../../components/icons/PlayIcon"
import PrimaryButton from "../../../components/simple/PrimaryButton"

import { useEffect, useState } from "react"
import { PomodoroPhase } from "../../../contexts/TimerContext"

type TimerPlayButtonProps = {
    isTimerRunning: boolean,
    pomodoroPhase: PomodoroPhase,
    handleStartClick: Function
}

export default function TimerPlayButton({isTimerRunning, pomodoroPhase, handleStartClick}: TimerPlayButtonProps) {
  const [buttonFillColor, setButtonFillColor] = useState("bg-white")

  useEffect(() => {
    setColorByPhase()
  }, [pomodoroPhase])
    
  function setColorByPhase() {
    if (pomodoroPhase == PomodoroPhase.Work) {
      setButtonFillColor("bg-pomogreen-button dark:bg-pomogreen-ring")
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setButtonFillColor("bg-pomored-button dark:bg-pomored-ring")
    } else {
      setButtonFillColor("bg-pomorange-button dark:bg-pomorange-ring")
    }
  }

  return (
    <PrimaryButton customBg={isTimerRunning ? "dark:bg-zinc-700 bg-white hover:bg-zinc-200" : buttonFillColor} onClick={handleStartClick}>{isTimerRunning ? <PauseIcon className="w-12 h-12 mx-auto fill-black dark:fill-none dark:stroke-15 dark:stroke-white" src="/pause.svg"/> 
      : <PlayIcon className="w-10 mx-auto fill-white dark:fill-none dark:stroke-25 dark:stroke-white"/>}</PrimaryButton>
  )
}