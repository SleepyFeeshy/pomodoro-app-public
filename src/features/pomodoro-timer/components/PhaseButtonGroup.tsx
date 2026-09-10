import { PomodoroPhase, useTimer } from "@/contexts/TimerContext"
import type { MouseEventHandler, ReactNode } from "react"

type PhaseButtonGroupProps = {
    workOnClick: MouseEventHandler<HTMLButtonElement>,
    shortbreakOnClick: MouseEventHandler<HTMLButtonElement>,
    longbreakOnClick: MouseEventHandler<HTMLButtonElement>
    pomodoroPhase: PomodoroPhase
}

type PhaseButtonProps = {
    activePhase: PomodoroPhase,
    activeColor: string,
    currentPhase: PomodoroPhase,
    onClick: MouseEventHandler,
    children: ReactNode,
    className?: string
    disabled: boolean

}

export default function PhaseButtonGroup({workOnClick, shortbreakOnClick, longbreakOnClick, pomodoroPhase}: PhaseButtonGroupProps) {
  const { isTimerRunning } = useTimer();
  return (
    <div className="grid grid-cols-3 mb-5 bg-component p-1 rounded-2xl">
      <PhaseButton activePhase={PomodoroPhase.Work} activeColor={"bg-pomogreen-ring text-white"} currentPhase={pomodoroPhase} className="rounded-l-xl" onClick={workOnClick} disabled={isTimerRunning}>Work</PhaseButton>
      <PhaseButton activePhase={PomodoroPhase.ShortBreak} activeColor={"bg-pomored-ring text-white"} currentPhase={pomodoroPhase} onClick={shortbreakOnClick} disabled={isTimerRunning}>Break</PhaseButton>
      <PhaseButton activePhase={PomodoroPhase.LongBreak} activeColor={"bg-pomorange-ring text-white"} currentPhase={pomodoroPhase} className="rounded-r-xl" onClick={longbreakOnClick} disabled={isTimerRunning}>Long Break</PhaseButton>
    </div>
  )
}

function PhaseButton({activePhase, currentPhase, activeColor, onClick, children, className, disabled}: PhaseButtonProps) {
  const isActive = activePhase == currentPhase

  if (!disabled) {
    return (
      <button className={`${className} hover:cursor-pointer font-semibold text-xs md:text-sm w-full md:w-40 px-2 md:px-4 py-3 md:py-2 ${isActive ? activeColor : 'bg-component hover:bg-component-hover text-zinc-400'}`} onClick={onClick} disabled={disabled}>{children}</button>
    )
  }
  return <button className={`${className} font-semibold text-xs md:text-sm w-full md:w-40 px-2 md:px-4 py-3 md:py-2 ${isActive ? activeColor : 'bg-component-disabled text-zinc-200'}`} disabled={disabled}>{children}</button>
}