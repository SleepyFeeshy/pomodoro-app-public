import {useState, useEffect, useContext} from "react"

import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns';
import type { ChartOptions } from "chart.js/auto";
import type { ChartData } from "chart.js/auto";

import { SettingsContext } from "@/App.js"
import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext.js";

type DailyPomodorosData = {
  date: string, 
  time: string, 
  hour: string
}

type DailyPomodorosProps = {
  data: DailyPomodorosData[]
}

type StartTime = {
  hours: number,
  minutes: number
}

export default function DailyPomodoros({data}: DailyPomodorosProps) {
  console.log(data)
  const hourlyCounts = Array(24).fill(0);
  const today = new Date();

  const settingsContext = useContext(SettingsContext);

  const [startHour, setStartHour] = useState(settingsContext.trackerSettings.start_hour);
  const [endHour, setEndHour] = useState(settingsContext.trackerSettings.end_hour);
  const [targetWorkSessions, setTargetWorkSessions] = useState(settingsContext.trackerSettings.target_work_sessions);
  const [startTime, setStartTime] = useState<StartTime>({hours: 0, minutes: 0})
  const { numWorkLogsToday} = usePomodoroLogs()

  data.forEach((log) => {
    // console.log(parseInt(log.hour))
    hourlyCounts[parseInt(log.hour)] += 1;
  })

  const cumulativeCounts = data.map((currentValue, index, array) => {
    // console.log(index + 1)
    return { time: currentValue.date.replace(' ', 'T'), count: index + 1 };
  }
  )
  // console.log(cumulativeCounts ?? new Date(cumulativeCounts[0].time).getHours())
  
  useEffect(() => {
    if (cumulativeCounts.length > 0) 
    {
      setStartTime({
        hours: new Date(cumulativeCounts[0]!.time).getHours(),
        minutes: new Date(cumulativeCounts[0]!.time).getMinutes(),
      })
      console.log(startTime);
    }
    
  }, [numWorkLogsToday])

  const lineData = {
    // data
    datasets: [
      // from Pomodoro Logs data
      {
        label: 'Cumulative Logs',
        data: [{time: today.setHours(startHour, 0, 0, 0), count: 0}, ...cumulativeCounts, {time: today.setHours(23, 59, 59, 59), count: cumulativeCounts.at(-1)?.count ?? 0}],
        fill: 'origin',
        backgroundColor: 'rgba(172, 255, 237, 0.76)',
        borderColor: 'rgba(0, 130, 170, 1)',
        borderWidth: 2,
        tension: 0.2,
        // segments
        segment: {
          borderDash: (ctx: any) => {
            const index = ctx.p0DataIndex;
            // end of cumulativeCounts data
            if (index === cumulativeCounts.length) {
              return [8, 5]; // Dashed line
            }
            return undefined; // solid
          },
          borderColor: (ctx: any) => {
            const index = ctx.p0DataIndex;
            if (index==cumulativeCounts.length) // end of cumulativeCounts data
            {
              return 'rgba(97, 183, 209, 1)';
            }
            return undefined;
          }
        },
        // point styling
        // cubicInterpolationMode: 'default',
        pointRadius: 1,
        parsing: {
          xAxisKey: 'time',
          yAxisKey: 'count',
        }
      },
      // Benchmark line
      {
        label: 'Benchmark',
        // data: cumulativeCounts.slice(startHour),
        // data: [{time: today.setHours(startHour, 0, 0, 0), count: 0}, {time: today.setHours(endHour, 0, 0, 0), count: targetWorkSessions}, {time: today.setHours(23, 59, 59, 59), count: targetWorkSessions}],
        data: [{time: (numWorkLogsToday > 0) ? today.setHours(startTime.hours, startTime.minutes, 0, 0) : today.setHours(startHour, 0, 0, 0), count: (numWorkLogsToday > 0) ? 1: 0}, {time: today.setHours(endHour, 0, 0, 0), count: targetWorkSessions}, {time: today.setHours(23, 59, 59, 59), count: targetWorkSessions}],
        fill: true,
        backgroundColor: 'rgba(255, 158, 151, 0.39)',
        borderColor: 'rgba(230, 80, 60, 1)',
        borderWidth: 2,
        // borderDash: [10, 6],
        tension: 0,
        // point styling
        pointRadius: 0.5,
        parsing: {
          xAxisKey: 'time',
          yAxisKey: 'count',
        }
      },
    ],

  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false, position: 'top' },
      title: { display: false, text: 'Cumulative Pomodoro Work Sessions per Hour' },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          // Luxon format string
          tooltipFormat: 'yyyy-MM-dd HH:mm'
        },
        min: today.setHours(startHour, 0, 0, 0),
        max: new Date().setHours(24, 0, 0 , 0),
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        max: 16,
        ticks: {
          stepSize: 1,
        },
      },
    },
    animation: false,
    // animations: {
    //     colors: {
    //         duration: 300,
    //         // easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    //     }
    // }
  };

  return <Line data={lineData} options={options} />;
}