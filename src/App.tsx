import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { load } from '@tauri-apps/plugin-store';
import "./App.css";


// import { Store } from "tauri-plugin-store-api";
import TasksProvider from "./contexts/TasksContext";
import { TimerProvider } from "./contexts/TimerContext";
import LogsPage from "./pages/LogsPage.js";
import PomodoroTimerPage from "./pages/PomodoroTimerPage.js";
import StatisticsPage from "./pages/StatisticsPage";
import SettingsPage from "./pages/SettingsPage";
import Shellwrapper from "./pages/Shellwrapper";
// import { SessionsProvider } from "./contexts/SessionsContext";
// import { usePomodoroLogs } from "./hooks/usePomodoroLogs";
// import { useTodoistTasks } from "./hooks/useTodoistTasks";
import { PomodoroLogsProvider } from "./contexts/PomodoroLogsContext";

// Types
import type { Dispatch, SetStateAction } from "react";

// util
// interface SettingsJson {
//       timer_settings: {
//         long_break_interval: number;
//         long_break_time: number;
//         short_break_time: number;
//         work_time: number;
//     },
//     tracker_settings: {
//       end_hour: number,
//       start_hour: number,
//       target_work_sessions: number
//     }
// }

export type Settings = {
  timerSettings: TimerSettings,
  setTimerSettings: Dispatch<SetStateAction<TimerSettings>>,
  trackerSettings: TrackerSettings,
  setTrackerSettings: Dispatch<SetStateAction<TrackerSettings>>
};

export type SettingsJson = {
  timer_settings: TimerSettings,
  tracker_settings: TrackerSettings,
}

type TimerSettings = {
  long_break_interval: number,
  long_break_time: number,
  short_break_time: number,
  work_time: number
}

type TrackerSettings = {
  end_hour: number,
  start_hour: number,
  target_work_sessions: number
}

type ThemeContext = {
  themeState: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>
}

export const ThemeContext = createContext<ThemeContext>({themeState: "work", setTheme: () => {}})
export const SettingsContext = createContext<Settings>({
  timerSettings: {
    work_time: 2,
    short_break_time: 1,
    long_break_time: 3,
    long_break_interval: 4,
  },
  trackerSettings: {
    start_hour: 6,
    end_hour: 21,
    target_work_sessions: 10
  },
  setTimerSettings: () => {},
  setTrackerSettings: () => {}
})

function App() {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
  // Whenever the user explicitly chooses light mode
  localStorage.theme = "light";
  // Whenever the user explicitly chooses dark mode
  localStorage.theme = "dark";
  // Whenever the user explicitly chooses to respect the OS preference
  localStorage.removeItem("theme");
  
  const [currentTheme, setTheme] = useState("work");
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    work_time: 2,
    short_break_time: 1,
    long_break_time: 3,
    long_break_interval: 4,
  })

  const [trackerSettings, setTrackerSettings] = useState({
    start_hour: 6,
    end_hour: 21,
    target_work_sessions: 10
  })

  const [phaseClass, setPhaseClass] = useState("")

  // get settings
  useEffect(() => {
    const getSettings = async () => {
      const store = await load('settings.json', { autoSave: false });
      await store.get<SettingsJson>("settings").then(
        (value) => {
          setTimerSettings(value!.timer_settings);// set to initial work time
          setTrackerSettings(value!.tracker_settings); // set to initial work time
        }
      );
      await store.close()
    }
    getSettings();

    // sync two way
    // const twoWaySync = async () => {await syncTwoWay()}
    // twoWaySync()
  }, [])

  useEffect(() => {
    setColorByPhase()
  }, [currentTheme])

  // change theme of outer div based on state
  function setColorByPhase() {
    if (currentTheme == "work") {
      setPhaseClass("bg-pomogreen-bg")
    } else if (currentTheme == "shortbreak") {
      setPhaseClass("bg-pomored-bg")
    } else {
      setPhaseClass("bg-pomorange-bg")
    }
  }

  return (
    <div className={`h-screen overflow-y-hidden transition-colors duration-(--phase) bg-surface-container-low dark:bg-zinc-950`}>
      <SettingsContext.Provider value={{timerSettings, setTimerSettings, trackerSettings, setTrackerSettings}}>
        {/* <AuthProvider> */}
        <PomodoroLogsProvider>
          <TasksProvider>
            <TimerProvider>
              <ThemeContext.Provider value={{themeState: currentTheme, setTheme: setTheme}}>
                <Routes>
                  <Route path="/" element={<Shellwrapper/>}>
                    <Route index element={<PomodoroTimerPage/>}/>
                    <Route path="stats" element={<StatisticsPage/>}/>
                    <Route path="settings" element={<SettingsPage/>}/>
                    <Route path="logs" element={<LogsPage/>}/>
                  </Route>
                </Routes>
              </ThemeContext.Provider>
        
            </TimerProvider>
          </TasksProvider>
        </PomodoroLogsProvider>
        {/* </AuthProvider> */}
      </SettingsContext.Provider>
      
    </div>
  );
}

export default App;