import { Outlet } from "react-router-dom";
import AppNav from "../components/nav/AppNav.js";
import Sidebar from "@/components/nav/Sidebar.js";
import { SidebarItem } from "@/components/nav/Sidebar.js";
import { useLocation } from "react-router-dom";
import TimerIcon from "@/components/nav/icons/TimerIcon.js";
import PlaceholderIcon from "@/components/nav/icons/PlaceholderIcon.js";


export default function DesktopLayout() {
  const settingsStyling = ""
  const pathname = useLocation().pathname;

  return (
    <div className="flex">
      <div className="z-50 w-60">
        <Sidebar>
          <SidebarItem icon={(className) =>{return <TimerIcon className={className}/>}} text="Home" pathname="/"/>
          <SidebarItem icon={(className) =>{return <PlaceholderIcon className={className}/>}} text="Stats" pathname="/stats"/>
          <SidebarItem icon={(className) =>{return <PlaceholderIcon className={className}/>}} text="Logs" pathname="/logs"/>
          <SidebarItem icon={(className) =>{return <PlaceholderIcon className={className}/>}} text="Settings" pathname="/settings"/>
        </Sidebar>
      </div>

      <div className="grow flex flex-col">
        <div className="flex justify-center h-screen">
          <Outlet/>            
        </div>
      </div>
    </div>
  )
}