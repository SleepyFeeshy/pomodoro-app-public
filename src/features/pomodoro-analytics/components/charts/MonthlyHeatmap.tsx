import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import { invoke } from "@tauri-apps/api/core";
import Chart from 'chart.js/auto'
import { Line } from 'react-chartjs-2';

type DataRecord = Record<string, string | number>

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';
import { useEffect, useState, useRef } from "react";
import Database from '@tauri-apps/plugin-sql';

import { useContext } from "react";
import { SettingsContext} from "@/App.js"
import { usePomodoroLogs } from '@/contexts/PomodoroLogsContext.js';

import { getData, getDataToday } from '@/utils/databaseManagement';

export default function MonthlyHeatmap() {
  const [heatmapData, setHeatmapData] = useState<DataRecord[]>([]);
  const date = new Date().toISOString();
  // const [dataToday, setDataToday] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const {numWorkLogsToday} = usePomodoroLogs()

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

    // getDataToday().then((value) => {
    //     console.log(value);
    //   // console.log(JSON.stringify(value));
    //   setDataToday(value);
    //   setLoading(false);
    // });
  }, [numWorkLogsToday]);

  useEffect(() => {
    const container = document.getElementById("cal-heatmap");
    if (container) container.innerHTML = ""; // 🔥 Clear before repaint

    // @ts-ignore, module itself has issues with type
    const cal = new CalHeatmap();

    const today = new Date();
    today.setHours(today.getHours() + 8)
    const localMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    // console.log(t)
    const data = [{ "date": '2025-03-01', "value": 3 }, 
      { "date": '2025-03-02', "value": 1 }
    ]
    cal.paint({
      theme: 'light',
      itemSelector: "#cal-heatmap",
      range: 2,
      domain: {
        type: "month",
      },
      subDomain: {
        type: "day",
        width: 20,
        height: 20
      },
      date: {
        start: new Date().setMonth(new Date().getMonth() - 1),
        highlight: [today],
        timezone: 'Asia/Manila'
      },
      data: {
        source: heatmapData,
        type: "json",
        x: "date",
        y: "value",
        defaultValue: 0,
      },
      scale: {
        color: {
          // scheme: "Greens",
          range: ["#eeeeee", "#00b327"],
          type: 'linear',
          domain: [0, 20],
        },
      },
      animationDuration: 0,
    }, [[Tooltip, {
      enabled: true,
      // text: (date: string, value: number, dayjsDate) => `Date: ${new Date(date).toLocaleDateString()}<br>Value: ${value ?? 0}`
      text: (date: string, value: number) => `Date: ${new Date(date).toLocaleDateString()}<br>Value: ${value ?? 0}`
    }]]);
    return () => {
      cal.destroy().then(() => {
        // console.log("Destroy complete");
      });
    };
  }, [heatmapData]);

  return (
    <div className="mx-auto w-fit" id="cal-heatmap" />
  );
}