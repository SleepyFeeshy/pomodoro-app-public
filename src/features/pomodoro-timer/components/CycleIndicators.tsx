import {ThemeContext, SettingsContext} from "@/App.js"
import { useEffect, useState, useRef, useContext } from "react";
import { useTimer, PomodoroPhase } from "@/contexts/TimerContext.js";

// hooks 
import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext.js";

type CycleIndicatorsProps = {
    pomodoroPhase: PomodoroPhase
}
function CycleIndicators({pomodoroPhase}: CycleIndicatorsProps) {
  const {numWorkLogsToday} = usePomodoroLogs()
  const settingsContext = useContext(SettingsContext)

  const themeContext = useContext(ThemeContext)
  const [phaseClass, setPhaseClass] = useState("")
  // const {pomodoroPhase} = useTimer()

  useEffect(() => {
    setColorByPhase()
  }, [pomodoroPhase])

  function setColorByPhase() {
    // if (themeContext.themeState == "work") {
    //     setPhaseClass("bg-pomogreen-ring dark:bg-pomogreen-darkRing")
    // } else if (themeContext.themeState == "shortbreak") {
    //     setPhaseClass("bg-pomored-ring dark:bg-pomored-darkRing")
    // } else {
    //     setPhaseClass("bg-pomorange-ring bg-pomorange-darkRing")
    // }
    if (pomodoroPhase == PomodoroPhase.Work) {
      setPhaseClass("bg-pomogreen-ring dark:bg-pomogreen-darkRing")
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setPhaseClass("bg-pomored-ring dark:bg-pomored-darkRing")
    } else {
      setPhaseClass("bg-pomorange-ring bg-pomorange-darkRing")
    }
  }
  return (
    <div className="relative flex justify-center top-0 md:top-2">
      {[...Array(settingsContext.timerSettings.long_break_interval).keys()].map((item, index) => (
        (item < ((numWorkLogsToday) % settingsContext.timerSettings.long_break_interval)) ? 
          <div key={index} className={`w-[10px] h-[10px] md:w-3 md:h-3 rounded-full mx-[1px] md:mx-[2px] ${phaseClass} transition-colors duration-(--phase)`}/> 
          : <div key={index} className="w-[10px] h-[10px] md:w-3 md:h-3 rounded-full mx-[1px] md:mx-[2px] bg-zinc-900/10 dark:bg-zinc-900"/>
      ))}
    </div>
  )}

export default CycleIndicators