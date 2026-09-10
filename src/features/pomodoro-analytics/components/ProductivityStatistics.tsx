import { useEffect, useState, useRef, useContext } from "react";
import { SettingsContext } from "@/App.js";
import StatisticsEntry from "@/components/simple/StatisticsEntry.js";

import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext.js";

// functions
import { getAveragePastThreeDays } from "@/utils/statistics.js";

export default function ProductivityStatistics() {
  const settingsContext = useContext(SettingsContext)

  const {numWorkLogsToday} = usePomodoroLogs()

  const [averagePastThreeDays, setAveragePastThreeDays] = useState(0)

  useEffect(() => {    
    getAveragePastThreeDays().then((value) => {
      // console.log("average past three days: " + value);
      setAveragePastThreeDays(value)
    });
  }, [numWorkLogsToday]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className='grid grid-rows-auto gap-2'>
        <StatisticsEntry label={"Work session hours today: "} value={`${((numWorkLogsToday * settingsContext.timerSettings.work_time)/60).toPrecision(3)} hours`}></StatisticsEntry>
        <StatisticsEntry label={"Target work sessions hours per day: "} value={`${(settingsContext.trackerSettings.target_work_sessions * (1/3)).toPrecision(3)} hours`}></StatisticsEntry>
        <StatisticsEntry label={"Work sessions completed today: "} value={`${((numWorkLogsToday))} work sessions`}></StatisticsEntry>
        <StatisticsEntry label={"Target work sessions to complete per day: "} value={`${settingsContext.trackerSettings.target_work_sessions} work sessions`}></StatisticsEntry>
        <StatisticsEntry label={"Average work session hours in the last 3 days: "} value={`${(averagePastThreeDays * (1/3)).toPrecision(3)} hours per day`}></StatisticsEntry>
        <StatisticsEntry label={"Average work sessions completed in the last 3 days: "} value={`${averagePastThreeDays.toPrecision(3)} sessions per day`}></StatisticsEntry>               
        {/* <StatisticsEntry label={"Target total productivity time: "} value={`${workCounterContext.workCounter * settingsContext.timerSettings.work_time} minutes`}></StatisticsEntry> */}
      </div>
    </div>
  )
}