import { load } from '@tauri-apps/plugin-store';
import { createContext, useContext, useEffect, useState } from "react";
import { useInterval } from "../utils/lib";

import { SettingsContext } from "../App";
import { usePomodoroLogs } from "./PomodoroLogsContext";

// api
import { createLog, uploadLogToRemote } from "../api/logs";
import { syncDatabasesLocalToRemote } from "../utils/databaseManagement";
// util
import { sendNotification } from "@tauri-apps/plugin-notification";
import { v4 as uuidv4 } from 'uuid';
import { toRFC3339WithOffset } from "../utils/dateFormatting";
import timerEndSound from "/break.wav";

// types
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { SettingsJson } from '../App';

export enum PomodoroPhase {
    Work = "work",
    ShortBreak = "short_break",
    LongBreak = "long_break"
}

type TimerState = {
    timeRemaining: number,
    timerProgress: number,
    isTimerRunning: boolean,
    toggleTimer: () => void,
    setIsTimerRunning: Dispatch<SetStateAction<boolean>>,
    setTimeRemaining: Dispatch<SetStateAction<number>>,
    resetTimer: () => void,
    pomodoroPhase: PomodoroPhase,
    setToWork: () => void,
    setToBreak: () => void,
    setToLongBreak: () => void,
    onTimerZero: () => void
}

type TimerSettings = {
    work_time: number,
    short_break_time: number,
    long_break_time: number,
    long_break_interval: number
}

export const TimerContext = createContext<TimerState>({
  timeRemaining : 60,
  timerProgress: 1,
  isTimerRunning: false,
  toggleTimer: () => {},
  setIsTimerRunning: () => {},
  setTimeRemaining: () => {},
  resetTimer: () => {},
  pomodoroPhase: PomodoroPhase.Work,
  setToWork: () => {},
  setToBreak: () => {},
  setToLongBreak: () => {},
  onTimerZero: () => {}
});

type TimerProvider = {
  children?: ReactNode
}
export const TimerProvider = ({children}: TimerProvider) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [timerProgress, setTimerProgress] = useState(1)
  const [timerProgressDenominator, setTimerProgressDenominator] = useState(0)
  const [pomodoroPhase, setPomodoroPhase] = useState(PomodoroPhase.Work)
  const audio = new Audio(timerEndSound);

  const {timerSettings} = useContext(SettingsContext)
  const {addLog, numWorkLogsToday} = usePomodoroLogs()

  const getSettings = async () => {
    const store = await load('settings.json', { autoSave: false });
    await store.get<SettingsJson>("settings").then(
      (value) => {
        // setTimerSettings(value!.timer_settings);// set to initial work time
        setTimeRemaining(value!.timer_settings.work_time * 60)
        setTimerProgressDenominator(value!.timer_settings.work_time * 60)
        //   setTrackerSettings(value!.tracker_settings); // set to initial work time
      }
    );
  }
  useEffect(() => {
    getSettings();
    // setTimeRemaining(settings.work_time * 60)
  }, [])

  // useEffect(() => {
  //     console.log("pomodoro phase changed")
  // }, [pomodoroPhase])

  // countdown timer
  useInterval(() => {
    if (timeRemaining <= 0) {
      onTimerZero()
      console.log("Timer elapsed")
    } else {
      // setTimerProgress((timer-1)/currentPhaseDenominator)
      console.log(timeRemaining)
      setTimeRemaining((timeRemaining) => timeRemaining - 1)
      setTimerProgress((timeRemaining - 1) / timerProgressDenominator)
    }
  }, (isTimerRunning) ? 1000 : null)

  // load settings
  const toggleTimer = () => setIsTimerRunning(!isTimerRunning)
  const setToWork = () => {
    setIsTimerRunning(false)
    setTimeRemaining(timerSettings.work_time * 60)
    setTimerProgressDenominator(timerSettings.work_time * 60)
    setPomodoroPhase(PomodoroPhase.Work)
    setTimerProgress(1)
  }
  const setToBreak = () => {
    setIsTimerRunning(false)
    setTimeRemaining(timerSettings.short_break_time * 60)
    setTimerProgressDenominator(timerSettings.short_break_time * 60)
    setPomodoroPhase(PomodoroPhase.ShortBreak)
    setTimerProgress(1)
  }
  const setToLongBreak = () => {
    setIsTimerRunning(false)
    setTimeRemaining(timerSettings.long_break_time * 60)
    setTimerProgressDenominator(timerSettings.long_break_time * 60)
    setPomodoroPhase(PomodoroPhase.LongBreak)
    setTimerProgress(1)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setPomodoroPhase(PomodoroPhase.Work)
    setTimerProgress(1)
  }

  const onTimerZero = () => {
    audio.play();
    setIsTimerRunning(false)
    logSession()
    if (pomodoroPhase == PomodoroPhase.Work) {
      // addWorkSessionToLocalDb() // add work session to the database
      // setPixelaPixelValue(workCounterContext.workCounter + 1) // update Pixela

        	if ((numWorkLogsToday + 1) % timerSettings.long_break_interval == 0 && numWorkLogsToday > 0) {
			    setToLongBreak()
		    } else {
        setToBreak()
      }
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setToWork()
    } else if (pomodoroPhase == PomodoroPhase.LongBreak) {
      setToWork()
    }
  }

  const logSession = async () => {
    const time = toRFC3339WithOffset();
    const uuid = uuidv4();
    let new_log;
    if (pomodoroPhase == PomodoroPhase.Work) {
      new_log = await createLog(uuid, time, timerSettings.work_time, "550e8400-e29b-41d4-a716-446655440000")
      sendNotification({
        title: "🔔 Time's Up! Take a Break",
        body: "Your focus session has ended. Please take a moment to rest and recharge before continuing.",
        channelId: 'messages',
      })
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      new_log = await createLog(uuid, time, timerSettings.short_break_time, "6ba7b810-9dad-11d1-80b4-00c04fd430c8")
      sendNotification({
        title: "⏰ Break Over! Back to Work",
        body: "Your short break has ended. Time to refocus and continue your progress",
        channelId: 'messages',
      })
    } else if (pomodoroPhase == PomodoroPhase.LongBreak) {
      new_log = await createLog(uuid, time, timerSettings.short_break_time, "6ba7b811-9dad-11d1-80b4-00c04fd430c8") 
      sendNotification({
        title: "⏰ Break Over! Back to Work",
        body: "Your short break has ended. Time to refocus and continue your progress",
        channelId: 'messages',
      })
    }
    addLog(new_log!)
    uploadLogToRemote(new_log!)
    await syncDatabasesLocalToRemote()
  }

  const value = {
    timeRemaining,
    isTimerRunning,
    timerProgress,
    setIsTimerRunning,
    toggleTimer,
    setTimeRemaining,
    setToWork,
    setToBreak,
    setToLongBreak,
    onTimerZero,
    resetTimer,
    pomodoroPhase,
    timerSettings        
  }
    
  return <TimerContext.Provider value={value}>{children} </TimerContext.Provider>
}

export const useTimer = () => {
  const context = useContext(TimerContext)
  return context
}