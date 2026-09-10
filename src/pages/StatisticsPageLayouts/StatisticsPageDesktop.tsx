import { invoke } from "@tauri-apps/api/core";
import "@/App.css";
import Chart from 'chart.js/auto'
import { Line } from 'react-chartjs-2';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';
import { useEffect, useState, useRef } from "react";
import Database from '@tauri-apps/plugin-sql';

import { useContext } from "react";
import { SettingsContext} from "@/App.js"
import type { SessionByHour, SessionCountByDay } from "@/utils/databaseManagement";
import { getData, getDataToday } from '@/utils/databaseManagement';

// 
import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext";

// Components
import DailyPomodoros from '@/features/pomodoro-analytics/components/charts/DailyPomodorosLineChart.js';
import ProductivityStatistics from '@/features/pomodoro-analytics/components/ProductivityStatistics.js';
import MonthlyHeatmap from '@/features/pomodoro-analytics/components/charts/MonthlyHeatmap.js';
import StatisticsCard from '@/components/simple/StatisticsCard.js';
import CardHeader from '@/components/CardHeader.js';
import SessionsToday from "@/features/pomodoro-analytics/components/charts/SessionsToday";
import SessionsPastThreeDays from "@/features/pomodoro-analytics/components/charts/SessionsPastThreeDays";
import WeeklyHeatmap from "@/features/pomodoro-analytics/components/charts/WeeklyHeatmap";

export default function StatisticsPageDesktop() {
  const [heatmapData, setHeatmapData] = useState<SessionCountByDay[]>([]);
  const date = new Date().toISOString();
  const [dataToday, setDataToday] = useState<SessionByHour[]>([]);
  const [isLoading, setLoading] = useState(true);
    
  const { numWorkLogsToday } = usePomodoroLogs()

  const settingsContext = useContext(SettingsContext)
  const config = {
    type: 'line',
    data: heatmapData,
  };

  useEffect(() => {
    console.log("statsheatmap data update")
    getData().then((value) => {
      // console.log(value);
      // console.log(JSON.stringify(value));
      setHeatmapData(value);
    });

    getDataToday().then((value) => {
      console.log(value);
      // console.log(JSON.stringify(value));
      setDataToday(value);
      setLoading(false);
    });
  }, [numWorkLogsToday]);

  return (
    <main className="flex flex-col overflow-y-auto">
      <div className="grid grid-cols-1 x-2 mx-auto my-auto gap-1">

        <div className="flex flex-col md:flex-row gap-1">
          <StatisticsCard>
            <CardHeader text={"Focus Time - Today"}/>
            <SessionsToday sessions={numWorkLogsToday} target={settingsContext.trackerSettings.target_work_sessions}></SessionsToday>
          </StatisticsCard>

          <StatisticsCard>
            <CardHeader text={"Focus Time - Average last three days"}/>
            <SessionsPastThreeDays sessions={numWorkLogsToday} target={settingsContext.trackerSettings.target_work_sessions}></SessionsPastThreeDays>
          </StatisticsCard>
        </div>

        <div className="flex flex-col md:flex-row gap-1">
          <StatisticsCard>
            <CardHeader text={"Cumulative Work Sessions by Hour"}/>
            {!isLoading ? 
              <DailyPomodoros data={dataToday}/>
              : <p></p>}
          </StatisticsCard>

          <StatisticsCard>
            <CardHeader text={"Work Sessions Per Day"}/>
            <MonthlyHeatmap/>
          </StatisticsCard>
        </div>
        {/* 
          <div className="flex flex-col md:flex-row gap-1">
            <StatisticsCard>
              <CardHeader text={"Weekly Work Sessions by Hour"}/>
              <WeeklyHeatmap/>
            </StatisticsCard>
          </div> */}

        <div className="statistics-panel">
           
          {/* <StatisticsCard>
            <CardHeader text={"Productivity Statistics"}/>
            <ProductivityStatistics/>
          </StatisticsCard> */}
        </div>
        
      </div>
    </main>
  );
}
