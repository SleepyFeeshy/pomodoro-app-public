import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../App.css";
import { load } from '@tauri-apps/plugin-store';
import {useInterval} from "../lib.js"

import { sendNotification } from '@tauri-apps/plugin-notification';

import Database from '@tauri-apps/plugin-sql';

// import timerEndSound  from "../../public/break.wav"
import timerEndSound  from "/break.wav"

// import { Store } from "tauri-plugin-store-api";
import { Store } from "@tauri-apps/plugin-store";

function PomodoroTimer(props) {
//   document.body.style.backgroundColor = "#ff5733"
  const audio = new Audio(timerEndSound);
  const PomodoroPhase = Object.freeze({
    WORK: 0,
    SHORTBREAK: 1,
    LONGBREAK: 2.
  })

  const [isTimerRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(props.appTimerSettings.work_time * 60);
  const [workCounter, setWorkCounter] = useState(0);
  const [currentPhase, setPomodoroPhase] = useState(0);
  const [appTheme, setAppTheme] = useState("work")
  const [localTimerSettings, setlocalTimerSettings] = useState(props.appTimerSettings)

  function handleStartClick() {
    setIsRunning(!isTimerRunning);
  }

  function handleNextClick() {
    onTimerZero();
  }

  function handleResetClick() {
    invoke("update_stats");
    console.log(localTimerSettings);
    setIsRunning(false)
    onWorkPhase()
  }

  function onTimerZero() {
    audio.play();

    setIsRunning(false)
    console.log(currentPhase);
    if (currentPhase == PomodoroPhase.WORK){
      addWorkSessionToDb() // add work session to the database
      sendNotification({
        title: "🔔 Time's Up! Take a Break",
        body: "Your focus session has ended. Please take a moment to rest and recharge before continuing.",
        channelId: 'messages',
      })
      setWorkCounter(workCounter + 1)
      console.log("workCounter:" + workCounter)
      if ((workCounter + 1) % props.appTimerSettings.long_break_interval == 0 && workCounter > 0) {
        onLongBreakPhase()
      }
      else {
        sendNotification({
          title: "⏰ Break Over! Back to Work",
          body: "Your short break has ended. Time to refocus and continue your progress",
          channelId: 'messages',
        })
        onShortBreakPhase()
      }
    }
    if (currentPhase > PomodoroPhase.WORK){
      onWorkPhase()
    }
  }

  function onLongBreakPhase() {
    setPomodoroPhase(PomodoroPhase.LONGBREAK)
    // setTimer(props.appTimerSettings.long_break_time * 60)
    setTimer(localTimerSettings.long_break_time * 60)
    props.setAppTheme("longbreak")
  }

  function onShortBreakPhase() {
    setPomodoroPhase(PomodoroPhase.LONGBREAK)
    setTimer(localTimerSettings.short_break_time * 60)
    props.setAppTheme("shortbreak")
  }

  function onWorkPhase() {
    setPomodoroPhase(PomodoroPhase.WORK)
    setTimer(localTimerSettings.work_time * 60)
    props.setAppTheme("work")
  }

  async function addWorkSessionToDb() {
    const db = await Database.load('sqlite:pomodorodatabase_public.db');
    await db.execute(
      "INSERT into sessions (startTime, endTime, fulfilled) VALUES ($1, $2, $3)",
      [0, 0, 1]
    );
  }

  // countdown timer
  useInterval(() => {
    if (timer <= 0) {
      onTimerZero()
    } else
    {
      setTimer((timer) => timer - 1)
    }
  }, (isTimerRunning) ? 1000 : null)
 
  useEffect(() => {
    const getSettings = async () => {
      const store = await load('settings.json', { autoSave: false });
      await store.get("settings").then(
        (value) => {
          setTimer(value.work_time * 60);// set to initial work time
        }
      );
    }
    getSettings();

    const loadDb = async() => {
      const db = await Database.load('sqlite:pomodorodatabase_public.db');
    }
    loadDb();
  }, [])

  useEffect(() => {
    setlocalTimerSettings(props.appTimerSettings)
  })

  useEffect(() => {
    if (isTimerRunning) {
      console.log("Timer continue")
    } else {
      console.log("Timer paused")
    }
  },[isTimerRunning])

  return (
    <main className={`container-fluid w-100 h-screen overflow-y-hidden`}>
      <div className="container mx-auto pt-5">
        {/* <h1 className="text-center">Pomodoro</h1> */}

        <div className="row justify-content-center">
          <h2 className="text-center mb-4 timer">
            {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer%60).padStart(2, '0')}
          </h2>
        </div>
        <div className="d-flex justify-content-center">
          <div> <button type="button" className="btn btn-light btn-lg mx-2" onClick={handleResetClick}>Reset</button> </div>
          <div> <button type="button" className="btn btn-light btn-lg mx-2" onClick={handleStartClick}>{isTimerRunning ? "Pause" : "Start"}</button> </div>
          <div> <button type="button" className="btn btn-light btn-lg mx-2" onClick={handleNextClick}>Next</button> </div>
        </div>
        <div className="row">
          <p className="text-center my-3">{workCounter}</p>
        </div>
      </div>
      
    </main>
  );
}

export default PomodoroTimer;