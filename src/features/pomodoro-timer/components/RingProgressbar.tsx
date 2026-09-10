import {useEffect, useState} from "react"
import CycleIndicators from "./CycleIndicators.js"
import { useTimer, PomodoroPhase } from "@/contexts/TimerContext.js";

import colors from "tailwindcss/colors"

function RingProgressbar(props: any) {
  const outerWidth = props.size;
  const ringWidth = 4;
  const innerWidth = props.size;
  const outerPadding = (outerWidth - innerWidth) / 2;
  const ringAdjustment = 148.4;
  const r = 48.2;
  const innerRingR = 48;
  const denum = 450 - ringAdjustment;
  const percent = props.progress;
  const negPercent = 1 - percent;

  const [phaseClass, setPhaseClass] = useState("")
   
  useEffect(() => {
    setColorByPhase()
  }, [props.currentPhase])

  function setColorByPhase() {
    if (props.currentPhase == PomodoroPhase.Work) {
      setPhaseClass("stroke-pomogreen-ring")
    } else if (props.currentPhase == PomodoroPhase.ShortBreak) {
      setPhaseClass("stroke-pomored-ring")
    } else {
      setPhaseClass("stroke-pomorange-ring")
    }
  }

  return (
    <div className={`relative mx-auto mb-3 md:mb-5 w-fit h-fit md:w-[45vh] md:h-[45vh] md:max-w-110 md:max-h-110`}
      style = {{
        padding: outerPadding + 'vw',
      }}>
      <svg className="absolute rotate-270 w-fit h-fit md:w-full md:h-full" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
        style = {{
        }}>
        <circle className="fill-none" style= {{
          strokeDasharray: 450,
          fill: "rgba(255, 255, 255, 0)",
          strokeWidth: 0 + 'px',
          stroke: "rgba(0, 0, 0, 0.10)",
        }}
        cx="50" cy="50" r={r + 4}/>
        <circle className="fill-none stroke-[3px]" style= {{
          strokeDasharray: 450,
          // strokeWidth: ringWidth + 'px',
          strokeDashoffset: -(ringAdjustment - 150 * denum),
          stroke: "rgba(0, 0, 0, 0.07)",
        }}
        cx="50" cy="50" r={innerRingR}/>
        <circle className={`fill-none transition-colors duration-(--phase) ${phaseClass} stroke-[3px]`} style= {{
          strokeDasharray: 450,
          // strokeWidth: ringWidth + 'px',
          strokeDashoffset: (ringAdjustment + negPercent * denum),
        }}
        cx="50" cy="50" r={innerRingR}/>
      </svg>
      <div className="flex flex-col justify-center w-[80vw] h-[80vw] md:w-full md:h-full">
        {/* <div className="flex items-center justify-center my-auto md:h-full md:w-full"> */}
        <h2 className="text-center font-timer text-[16cqw] md:text-[12cqh] font-medium md:font-medium text-black dark:text-white dark:font-light">
          {String(Math.floor(props.timer / 60)).padStart(2, '0')}:{String(props.timer  % 60).padStart(2, '0')}
        </h2>
        <CycleIndicators pomodoroPhase={props.currentPhase}/>
        {/* </div> */}
      </div>
    </div>
  )}

export default RingProgressbar;