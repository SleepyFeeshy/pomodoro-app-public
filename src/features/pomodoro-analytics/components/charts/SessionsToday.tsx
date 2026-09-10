
import type { ReactNode } from "react"
type SessionsTodayProps = {
    sessions: number,
    target: number
}

export default function SessionsToday({sessions, target}: SessionsTodayProps) {
  return (
    <div className="flex flex-col gap-2 mx-auto">
      {/* <h1 className="font-semibold">Focus time</h1> */}
      {/* <div>
        <HorizontalBar numerator={sessions} denominator={target} widthClass="w-full" className="h-8 bg-pomogreen-button" barBg="bg-zinc-100"/>
      </div> */}
      <div className="flex gap-8">
        <p className="text-3xl font-semibold">{sessions} <SessionsTodayLine> / {target} Pomodoros </SessionsTodayLine> </p>
        <h1 className="text-3xl font-semibold">{(sessions * 20 / 60).toPrecision(2)} <SessionsTodayLine> / {(target * 20 / 60).toPrecision(3)} hours </SessionsTodayLine> </h1>
      </div>
      {/* <h1 className='text-sm'>{sessions} / {target} work sessions today</h1> */}
    </div>
  )
}

type SessionsTodayLine = {
    children: ReactNode
}
function SessionsTodayLine({children}: SessionsTodayLine) {
  return <>
    <span className="text-base font-semibold dark:font-medium text-gray-400"> {children} </span>
  </>
}