import { load } from '@tauri-apps/plugin-store';
import { useEffect, useState } from "react";
import "../../App.css";

import { useContext } from "react";
import { SettingsContext } from "../../App.jsx";
// Components
import GoogleSignInButton from "../../components/simple/GoogleSignInButton";
import SettingsInput from "../../components/simple/SettingsInput.jsx";
import SettingsLabel from "../../components/simple/SettingsLabel.jsx";

import { useTimer } from "../../contexts/TimerContext";

export default function SettingsPageMobile() {
  // const settingsContext = useContext(SettingsContext);
  const {timerSettings, trackerSettings, setTimerSettings, setTrackerSettings} = useContext(SettingsContext)
  const timerContext = useTimer()

  const [draftTimerSettings, setDraftTimerSettings] = useState(
    {
      work_time: "20",
      short_break_time: "5",
      long_break_time: "15",
      long_break_interval: "4",
    })

  const [draftTrackerSettings, setDraftTrackerSettings] = useState({
    start_hour: "6",
    end_hour: "21",
    target_work_sessions: "10"
  })

  // useEffect(() => {
  //     const getSettings = async () => {
  //       const store = await load('settings.json', { autoSave: false });
  //       await store.get<SettingsJson>("settings").then(
  //         (value) => {
  //             // console.log(settingsContext.timerSettings)
  //             // console.log(value)
  //             // console.log(value.timer_settings)
  //             // console.log(timerSettings)
  //             setTimerSettings(value!.timer_settings); // set to initial work time
  //             setTrackerSettings(value!.tracker_settings); // set to initial work time
  //         }
  //       );
  //     }
  //     getSettings();
  // }, [])

  const storeSettings = async() => {
    // console.log(draftTimerSettings)
    timerContext.setTimeRemaining(Number(draftTimerSettings.work_time) * 60)
    timerContext.setIsTimerRunning(false)
    timerContext.resetTimer()

    const convertedDraftTimerSettings = { 
      work_time: Number(draftTimerSettings.work_time),
      short_break_time:  Number(draftTimerSettings.short_break_time),
      long_break_time:  Number(draftTimerSettings.long_break_time),
      long_break_interval:  Number(draftTimerSettings.long_break_interval)
    }

    const convertedDraftTackerSettings = {
      end_hour: Number(draftTrackerSettings.end_hour),
      start_hour: Number(draftTrackerSettings.start_hour),
      target_work_sessions: Number(draftTrackerSettings.target_work_sessions) 
    }
        

    setTimerSettings(convertedDraftTimerSettings)
    setTrackerSettings(convertedDraftTackerSettings)
        
    const store = await load('settings.json', { autoSave: false });
    await store.set('settings', {
      timer_settings: { 
        ...convertedDraftTimerSettings
      },
      tracker_settings: { 
        ...convertedDraftTackerSettings}
    });
    await store.save()
    await store.close()
    console.log(timerSettings)
  }

  useEffect(() => {
    setDraftTimerSettings({
      work_time: String(timerSettings.work_time),
      short_break_time:  String(timerSettings.short_break_time),
      long_break_time:  String(timerSettings.long_break_time),
      long_break_interval:  String(timerSettings.long_break_interval)})
  }, [timerSettings])

  useEffect(() => {
    setDraftTrackerSettings({
      end_hour: String(trackerSettings.end_hour),
      start_hour: String(trackerSettings.start_hour),
      target_work_sessions: String(trackerSettings.target_work_sessions)
    })
  }, [trackerSettings])

  // useEffect(() => {
  //     console.log(settingsContext)
  // }, [settingsContext])

  if (!timerSettings) {
    return null; // or return a loading spinner
  }

  return (
    <div className="flex max-h-[91%] pt-2 md:pt-2 dark:text-white">
      <div className="w-full md:w-120 mx-2 md:mx-auto h-fit bg-surface p-5 rounded-lg"> 
        <h1>Timer Settings</h1>
        <div className="grid grid-rows-5">
          <div className="grid grid-cols-[4fr_1fr] py-1">
            <SettingsLabel className="text-left my-auto">Work duration</SettingsLabel>
            <SettingsInput name="work_time" value={draftTimerSettings.work_time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTimerSettings({
              ...draftTimerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>

          <div className="grid grid-cols-[4fr_1fr] border-t-1 border-taskborder">
            <SettingsLabel className="text-left my-auto">Short Break duration</SettingsLabel>
            <SettingsInput name="short_break_time" value={draftTimerSettings.short_break_time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTimerSettings({
              ...draftTimerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>

          <div className="grid grid-cols-[4fr_1fr] border-t-1 border-taskborder">
            <SettingsLabel className="text-left my-auto">Long Break duration</SettingsLabel>
            <SettingsInput name="long_break_time" value={draftTimerSettings.long_break_time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTimerSettings({
              ...draftTimerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>
                
          <div className="grid grid-cols-[4fr_1fr] border-t-1 border-taskborder">
            <SettingsLabel className="text-left my-auto">Interval</SettingsLabel>
            <SettingsInput name="long_break_interval" value={draftTimerSettings.long_break_interval} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTimerSettings({
              ...draftTimerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>
        </div>  

        <h1>Tracker Settings</h1>  
        <div className="grid grid-rows-auto">
          <div className="grid grid-cols-[4fr_1fr] py-1">
            <SettingsLabel className="text-left my-auto">Start Hour</SettingsLabel>
            <SettingsInput name="start_hour" value={draftTrackerSettings.start_hour} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTrackerSettings({
              ...draftTrackerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>

          <div className="grid grid-cols-[4fr_1fr] py-1">
            <SettingsLabel className="text-left my-auto">End Hour</SettingsLabel>
            <SettingsInput name="end_hour" value={draftTrackerSettings.end_hour} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTrackerSettings({
              ...draftTrackerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>

          <div className="grid grid-cols-[4fr_1fr] py-1">
            <SettingsLabel className="text-left my-auto">Target Work Sessions to Finish</SettingsLabel>
            <SettingsInput name="target_work_sessions" value={draftTrackerSettings.target_work_sessions} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftTrackerSettings({
              ...draftTrackerSettings,
              [e.target.name]: (e.target.value)
            })}/>
          </div>
        </div>  

        <div className="flex">
          <button onClick={storeSettings} className="bg-component flex-1 p-2 mx-auto rounded-md font-semibold hover:cursor-pointer hover:bg-neutral-400 m-auto">Save Settings</button>
        </div>

        <div className="flex">
          <GoogleSignInButton/>
        </div>
      </div>
    </div>
  )
}