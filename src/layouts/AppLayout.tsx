import { Outlet } from "react-router-dom";
import AppNav from "../components/nav/AppNav.js";
import MobileHeaderNav from "../components/nav/MobileHeaderNav.js";
import MobileNav from "../components/nav/MobileNav.js";

import { useLocation } from "react-router-dom";

export default function AppLayout() {
  const settingsStyling = ""
  const pathname = useLocation().pathname;

  return (
    <>
      <div className="block md:hidden z-2">
        <MobileHeaderNav/>
      </div>
      <div className="hidden md:block z-50">
        <AppNav />
      </div>
            
      {/* <div className="h-[80%] md:h-[90%] overflow-y-scroll"> */}
      <Outlet/>
      {/* </div> */}

      {pathname === "/" ? <div className="fixed bottom-0 visible md:invisible">
        <MobileNav />
      </div>: <div className="fixed bottom-0 visible md:invisible">
        <MobileNav />
      </div>}
            
    </>
  )
}