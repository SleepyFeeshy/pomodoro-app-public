import {Link, NavLink, useLocation} from  "react-router-dom"
import NavTab from "../simple/NavTab.js"
import GearIcon from "../icons/GearIcon.js"
import TimerIcon from "./icons/TimerIcon.js"
import GraphIcon from "../icons/GraphIcon.jsx"
import ProfileIcon from "../icons/ProfileIcon.jsx"

import {useContext, useState, useEffect} from "react"
import {ThemeContext} from "../../App.js"
import { useTimer, PomodoroPhase } from "../../contexts/TimerContext.js"

export default function MobileNav() {
  const defaultLinkStyling = "flex-1 text-center font-normal no-underline text-md z-10 transition-colors duration-(--phase)"
  const linkStyling ="flex-1 text-center no-underline text-md z-1 transition-none"
  const linkStylingActive ="font-normal text-white fill-white dark:text-white dark:fill-wite transition-none"
  const location = useLocation()

  const themeContext = useContext(ThemeContext)
  const [inactiveLinkColor, setInactiveLinkColor] = useState("")
  const [phaseClass, setPhaseClass] = useState("")
  const {pomodoroPhase} = useTimer()

  useEffect(() => {
    setColorByPhase()
    // console.log(themeContext.themeState)
  }, [pomodoroPhase])

  function setColorByPhase() {
    if (pomodoroPhase == PomodoroPhase.Work) {
      setPhaseClass("bg-pomogreen-nav")
      setInactiveLinkColor("text-pomogreen-inactive fill-pomogreen-inactive dark:text-zinc-500 dark:fill-zinc-500")
    } else if (pomodoroPhase == PomodoroPhase.ShortBreak) {
      setPhaseClass("bg-pomored-nav")
      setInactiveLinkColor("text-pomored-bg fill-pomored-bg dark:text-zinc-500 dark:fill-zinc-500")
    } else {
      setPhaseClass("bg-pomorange-nav")
      setInactiveLinkColor("text-pomorange-bg dark:text-zinc-300 fill-pomorange-bg dark:text-zinc-500 dark:fill-zinc-500")
    }
  }

  const settingsStyling = ""
  return (
    <>
      <div className={`pb-[env(safe-area-inset-bottom)] flex flex-col w-screen no-underline dark:bg-navbar dark:text-neutral-50 transition-colors duration-(--phase) ${phaseClass} dark:drop-shadow-none`}>
        <div className="min-w-80 w-full h-[64px] mx-auto grid grid-cols-[1fr_1fr_1fr]">
          <NavLink className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${defaultLinkStyling} ${inactiveLinkColor}`
          } to="/">
            <div className="p-2 flex-row">
              <TimerIcon className="h-[32px] mx-auto"/>
              <h1 className="text-sm">Timer</h1>
            </div>
          </NavLink>
          <NavLink className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${defaultLinkStyling} ${inactiveLinkColor}`
          } to="/stats">
            <div className="p-2 flex-row">
              <GraphIcon className="h-[32px] mx-auto"/>
              <h1 className="text-sm">Stats</h1>
            </div>
          </NavLink>   
          <NavLink className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${defaultLinkStyling} ${inactiveLinkColor}`
          } to="/settings">
            <div className="p-2 flex-row">
              <ProfileIcon className="h-[32px] mx-auto"/>
              <h1 className="text-sm">Profile</h1>
            </div>
          </NavLink>       
        </div>
      </div>
    </>
  )
}