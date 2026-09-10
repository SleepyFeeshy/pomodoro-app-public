import UserAvatar from "@/features/user-profile/components/UserAvatar"
import { NavLink } from "react-router-dom"

export default function AppNav() {
  const linkStyling ="flex-1 text-center py-2 rounded-lg font-semibold hover:bg-component-hover no-underline text-lg"
  const linkStylingInactive="text-on-surface-variant"
  const linkStylingActive="bg-component text-black dark:text-zinc-200"
  const settingsStyling = "py-1 px-1 rounded-full hover:bg-zinc-500/25"

  return (
    <div className="flex h-16 w-full pt-2 no-underline bg-surface-container-low pb-2 z-50">
      <div className="min-w-80 w-1/2 max-w-150 mx-auto grid grid-cols-[3fr_3fr_3fr] gap-2">
        <NavLink className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${linkStyling} ${linkStylingInactive}`
        } to="/">
                    Timer
        </NavLink>
        <NavLink className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${linkStyling} ${linkStylingInactive}`
        } to="/stats">Stats
        </NavLink>  
        <NavLink className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${linkStyling} ${linkStylingInactive}`
        } to="/logs">Logs
        </NavLink> 
      </div>
      <div className="justify-self-end right-2 top-1 z-1 ">
        <NavLink className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? `${linkStyling} ${linkStylingActive}` : `${linkStyling}`
        } to="/settings"><img className={`w-12 ${settingsStyling}`} src="/gear.svg"/></NavLink>
      </div>      
      <UserAvatar/>
    </div>
  )
}