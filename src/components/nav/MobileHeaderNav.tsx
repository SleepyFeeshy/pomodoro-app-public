import {Link, NavLink, useLocation} from  "react-router-dom"
import NavTab from "../simple/NavTab.js"
import GearIcon from "../icons/GearIcon.js"
import { getMobileNavHeader } from "../../utils/lib.js"

export default function MobileHeaderNav() {
  const linkStyling ="flex-1 text-center font-semibold no-underline text-md z-1"
  const linkStylingActive ="text-sky-400"
  console.log(useLocation())
  console.log(getMobileNavHeader(useLocation()))

  return (
    <div className="pt-[env(safe-area-inset-top)] bg-navbar flex flex-col w-screen no-underline border-b-0 border-gray-400/20 dark:text-neutral-50">
      <div className="min-w-80 w-full h-[64px] mx-auto flex">
        <h1 className="text-xl my-auto px-5 text-neutral-800 dark:text-neutral-50 font-semibold dark:font-normal">{getMobileNavHeader(useLocation())}</h1>
      </div>
    </div>
  )
}