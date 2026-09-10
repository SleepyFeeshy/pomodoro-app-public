import { Outlet } from "react-router-dom";
import AppNav from "../components/nav/AppNav.js";
import MobileNav from "../components/nav/MobileNav.js";
import MobileHeaderNav from "../components/nav/MobileHeaderNav.js";
import GearIcon from "../components/icons/GearIcon.js";
import {Link, NavLink} from  "react-router-dom"

import { useLocation } from "react-router-dom";

export default function MobileLayout() {
  const settingsStyling = ""
  const pathname = useLocation().pathname;

  return (
    <>
      <div className="z-2">
        <MobileHeaderNav/>
      </div>
            
      <div className="pb-[calc(12px+env(safe-area-inset-bottom))]">
        <Outlet/>
      </div>
      <div className="fixed bottom-0">
        <MobileNav />
      </div>
            
    </>
  )
}