import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import TimerIcon from "./icons/TimerIcon"
import PlaceholderIcon from "./icons/PlaceholderIcon"
import type { JsxElement } from "typescript"

type SidebarProps = {
    children?: ReactNode
}

type SidebarItemProps = {
    icon?: (className?: string) => React.ReactNode,
    text: string,
    pathname: string
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <>
      <aside className="h-screen bg-surface pt-16 px-2">
        {/* <nav className="h-full flex flex-col bg-white border-0 shadow-sm">
                </nav> */}
            

        <ul className="w-full flex flex-col justify-center gap-[2px]">
          {children}
        </ul>
      </aside>
    </>
  )
}

export function SidebarItem({text, pathname, icon}: SidebarItemProps) {
  const linkStyling ="grow text-left py-2 px-2 rounded-full hover:bg-surface-container no-underline text-md"
  const linkStylingInactive=`${linkStyling} text-on-surface-variant fill-on-surface-variant stroke-1`
  const linkStylingActive=`${linkStyling} bg-red-50 text-on-surface dark:text-zinc-200 fill-on-surface`

  return (
    <li className="flex h-10">
      <NavLink className={({ isActive, isPending }) =>
        isActive ? `${linkStylingActive}` : 
          isPending ? "" : 
            `${linkStylingInactive}`
      } to={pathname}>
        <div className="flex h-full gap-2 my-auto">
          {icon && icon("w-4")}
          <p className="text-xs my-auto"> {text} </p>
        </div>
      </NavLink>
    </li>
  )
}