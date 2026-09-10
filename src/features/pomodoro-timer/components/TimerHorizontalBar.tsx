import HorizontalBar from "@/components/charts/HorizontalBar";
import { PomodoroPhase } from "@/contexts/TimerContext";
import { useEffect, useState } from "react";

type TimerHorizontalBarProps = {
    numerator: number,
    denominator: number,
    currentPhase?: PomodoroPhase
}
export default function TimerHorizontalBar({numerator, denominator, currentPhase}: TimerHorizontalBarProps) {
  // const [barColor, setBarColor] = useState('rgba(114, 114, 114, 1)')
  const [barBg, setBarBg] = useState('bg-neutral-400')
  const styling = `h-[12px] ${barBg}`

  useEffect(() => {
    console.log(barBg)
  }, [numerator])

  function setColorByPhase(currentPhase: PomodoroPhase) {
    if (currentPhase == PomodoroPhase.Work) {
      setBarBg("bg-pomogreen-button dark:bg-pomogreen-ring")
    } else if (currentPhase == PomodoroPhase.ShortBreak) {
      setBarBg("bg-pomored-button dark:bg-pomored-ring")
    } else {
      setBarBg("bg-pomorange-button dark:bg-pomorange-ring")
    }
  }

  useEffect(() => {
    if (currentPhase == null) return;
    setColorByPhase(currentPhase)
  }, [currentPhase])

  if (numerator != null) {
    return (
      <HorizontalBar numerator={numerator} denominator={denominator} className={styling} widthClass="w-[150px]"/>
    )
  }
}

function handleBarText(maxInterval: number, daysSinceLast: number) {
  const numerator = () => {
    if (daysSinceLast === null) return 0
    else {
      const diff  = maxInterval - daysSinceLast
      if (diff < 0) return 0
      return diff
    }
  }
  // const numerator =  daysSinceLast === null ? 0 : (maxInterval - daysSinceLast)
  const denominator = maxInterval
  return `${Math.trunc(numerator())} / ${Math.trunc(denominator)}`
}