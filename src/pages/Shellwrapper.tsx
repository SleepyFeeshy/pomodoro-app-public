import {platform} from "@tauri-apps/plugin-os"
import AppLayout from "../layouts/AppLayout"
import MobileLayout from "../layouts/MobileLayout"
import DesktopLayout from "../layouts/DesktopLayout"

export const p = platform()
// export const p = "android"

export default function Shellwrapper() {
    

  // if (p == "windows") { return <DesktopLayout/> }

  // return (
  //     <MobileLayout/>
  // )

  if (window.innerWidth > 430) {
    return <DesktopLayout/>
  } else {
    return <MobileLayout/>
  }
}

export function useShell() {
  return {p}
}