import "@/App.css";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";



// Assets

// import { Store } from "tauri-plugin-store-api";


import ClipLoader from "react-spinners/ClipLoader";

// Components
import SecondaryButton from "@/components/simple/SecondaryButton.js";
import PhaseButtonGroup from "./PhaseButtonGroup";
import RingProgressbar from "./RingProgressbar.js";
import TimerHorizontalBar from "./TimerHorizontalBar";
import TimerPlayButton from "./TimerPlayButton";

// Hooks
import { usePomodoroLogs } from "../../../contexts/PomodoroLogsContext";
import { PomodoroPhase, useTimer } from "../../../contexts/TimerContext";
// icons
import ResetIcon from "../../../components/icons/ResetIcon.js";
import SkipIcon from "../../../components/icons/SkipIcon.js";

// Utils
import { countPomodorosTodayInLocalDb } from "../../../utils/databaseManagement";
// import { setPixelaPixelValue } from "../../../utils/dateFormatting.js";

// Database
import { SettingsContext } from "../../../App.js";
import { getPixelaTokenKey } from "../../../utils/databaseManagement.js";

function PomodoroTimer() {
  const {logsData, setLogsData, addLog, numWorkLogsToday, logsSyncState} = usePomodoroLogs()

  const location = useLocation();
  const {timeRemaining, isTimerRunning, setIsTimerRunning, toggleTimer, setTimeRemaining, 
    setToWork, setToBreak, setToLongBreak, pomodoroPhase, timerProgress, onTimerZero
  } = useTimer()
  console.log(timeRemaining)

  // Supabase
  // const audio = new Audio(timerEndSound);

  // const themeContext = useContext(ThemeContext)
  const settingsContext = useContext(SettingsContext)

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [bgFromState, setBgFromState] = useState('')

  function handleStartClick() {
    toggleTimer()
  }

  function handleNextClick() {
    onTimerZero();
    if (pomodoroPhase != PomodoroPhase.Work) {
      setIsTimerRunning(true);
    }
  }

  function handleResetClick() {
    setIsTimerRunning(false)
    onWorkPhase()
    countPomodorosTodayInLocalDb();
  }

  function onLongBreakPhase() {
    setToLongBreak()
  }

  function onShortBreakPhase() {
    setToBreak()
  }

  function onWorkPhase() {
    setToWork()
  }

  // ON START
  // load settings from settings.json, set work_time on start
  useEffect(() => {
    // document.body.className = "bg-pomogreen-nav dark:bg-zinc-900";
    // count pomodoro sessions today from database then set its value to workCounter
    countPomodorosTodayInLocalDb().then((value) => {
      // setPixelaPixelValue(value)
    })
    // syncDatabases();
    // syncTwoWay();

    const pixelag = async () => {
      return getPixelaTokenKey()
    }
    pixelag().then((value) => console.log(value));
  }, [])

  // theme
  useEffect(() => {
    if (pomodoroPhase == PomodoroPhase.Work) {
      setBgFromState("bg-pomogreen-bg")
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setBgFromState("bg-pomored-bg")
    } else {
      setBgFromState("bg-pomorange-bg")
    }
  }, [pomodoroPhase])
  return (
	  	<div className={`h-full p-6 mx-auto my-auto w-auto ${bgFromState} shadow-xs border-[1px] border-zinc-100 dark:border-0 md:rounded-lg`}>
      <div className="w-full flex justify-end pr-6 mb-3">
        {/* <p className="text-neutral-400 text-xs text-left">
          { logsSyncState ? "Synced" : "Syncing..." }
        </p> */}
      </div>
      <div className="w-full top-22 right-0 px-4 grid-cols-1 bg-neutral-400/0">
        <PhaseButtonGroup workOnClick={onWorkPhase} shortbreakOnClick={onShortBreakPhase} longbreakOnClick={onLongBreakPhase} pomodoroPhase={pomodoroPhase}/>
      </div>

      <div className="">
        <RingProgressbar timer={timeRemaining} progress={timerProgress} currentPhase={pomodoroPhase} size={50}/>

        <div className="flex w-full mb-6">
          <div className="flex flex-col flex-1 w-full mb-1">
            <div className="w-[90vw] md:w-full mx-auto">
              <div className="w-fit mx-auto">
                <TimerHorizontalBar numerator={numWorkLogsToday} denominator={settingsContext.trackerSettings.target_work_sessions} currentPhase={pomodoroPhase}/>
              </div>
            </div>
            <p className="text-center work-counter mx-auto text-md md:text-xl text-neutral-900/75 dark:text-white"> {numWorkLogsToday} / {settingsContext.trackerSettings.target_work_sessions}</p>				
          </div>
        </div> 	
      </div>

      <div className="visible">
        <div className="mx-auto w-[90%] grid grid-cols-3 gap-2">
          <SecondaryButton onClick={handleResetClick}><ResetIcon className="w-10 mx-auto fill-black dark:fill-white"/></SecondaryButton>
          <TimerPlayButton isTimerRunning={isTimerRunning} pomodoroPhase={pomodoroPhase} handleStartClick={handleStartClick}/>
          <SecondaryButton onClick={handleNextClick}><SkipIcon className="relative top-[-1px] w-10 mx-auto fill-black dark:fill-white"/></SecondaryButton>
        </div>
      </div>

      <div className="flex flex-1">
        {isDataLoading && <ClipLoader size={18} color={"#000000"} className="absolute m-auto left-0 right-0 opacity-50"/>}
      </div>

    </div>
  );
}

export default PomodoroTimer;