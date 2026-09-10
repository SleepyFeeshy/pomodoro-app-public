import { Bar } from "react-chartjs-2";
import {useState, useContext, useEffect} from "react";
import { SettingsContext, ThemeContext } from "@/App.js"
import type { ChartOptions } from "chart.js";

import { PomodoroPhase } from "@/contexts/TimerContext.js";

// context
import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext.js";

type DailyPomodoroBarProps = {
    pomodoroPhase: PomodoroPhase
}

export default function DailyPomodoroBar({pomodoroPhase}: DailyPomodoroBarProps) {
  const settingsContext = useContext(SettingsContext);
  const [targetWorkSessions, setTargetWorkSessions] = useState(settingsContext.trackerSettings.target_work_sessions);

  const {numWorkLogsToday} = usePomodoroLogs()
  // const themeContext = useContext(ThemeContext)
  const [barColor, setBarColor] = useState<string>()
  const [barBorderColor, setBarBorderColor] = useState<string>()

  useEffect(() => {
    setColorByPhase()
  }, [pomodoroPhase])

  function setColorByPhase() {
    if (pomodoroPhase == PomodoroPhase.Work) {
      setBarColor("hsl(123, 35.00%, 50.00%)")
      setBarBorderColor("border-pomogreen-ring")
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setBarColor("hsl(0, 35.00%, 50.00%)")
      setBarBorderColor("border-pomored-ring")
    } else {
      setBarBorderColor("border-pomorange-ring")
      setBarColor("hsl(34, 45.00%, 55%)")
    }
  }

  const data = {
    labels: [''],
    datasets: [
      {
        id: 1,
        label: 'Work Sessions Finished',
        data: [numWorkLogsToday],
        barPercentage: 1,
        backgroundColor: [barColor]
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false, position: 'top' },
      tooltip: {enabled: false},
    },
    scales: {
      x: {
        max: targetWorkSessions,
        beginAtZero: true,
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          display: true,
        }
      },
      y: {
        // categoryPercentage: 1,
        display: false,
        grid: {
          display: false,
        }
      }
    },
    elements: {
      bar: {
        borderWidth:1,
      }
    }, 
    animations: {
      colors: {
        duration: 300,
        // easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  }
  return (
    <div className={`flex h-[13px] w-[80px] md:h-[15px] md:w-[150px] ${barBorderColor} bg-neutral-500/[10%] border-l-3 border-r-3 mx-auto transition-colors duration-(--phase)`}>
      <Bar className="mx-auto w-full" data={data} options={options}></Bar>
    </div>
  )
}
