import { useState, useEffect } from "react"

import { getAveragePastThreeDays } from "@/utils/statistics";

type SessionsTodayProps = {
    sessions: number,
    target: number
}

export default function SessionsPastThreeDays({sessions, target}: SessionsTodayProps) {
  const [averagePastThreeDays, setAveragePastThreeDays] = useState<number>(0)

  useEffect(() => {    
    getAveragePastThreeDays().then((value) => {
      // console.log("average past three days: " + value);
      setAveragePastThreeDays(value)
    });
  }, [sessions]);
    
  return (
    <div className="flex gap-8 mx-auto">
      {/* <h1 className="font-semibold">Focus time</h1> */}
      <p className="text-3xl font-semibold">{averagePastThreeDays.toPrecision(2)} <span className="text-base font-semibold dark:font-medium text-gray-400"> / {target} Pomodoros </span> </p>
      <h1 className="text-3xl font-semibold">{(averagePastThreeDays * (1/3)).toPrecision(2)} <span className="text-base font-semibold dark:font-medium text-gray-400"> / {(target * 20 / 60).toPrecision(3)} hours </span> </h1>
      {/* <h1 className='text-sm'>{sessions} / {target} work sessions today</h1> */}
    </div>
  )
}