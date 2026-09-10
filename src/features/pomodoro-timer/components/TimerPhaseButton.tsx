import {useContext, useState, useEffect} from "react"
import {ThemeContext} from "../../../App.js"

export default function TimerPhaseButton({onClick, label}) {
  // const themeContext = useContext(ThemeContext)
  // const [inactiveLinkColor, setInactiveLinkColor] = useState("")
  // const [phaseClass, setPhaseClass] = useState("")

  // useEffect(() => {
  //     setColorByPhase()
  //     console.log(themeContext.themeState)
  // }, [themeContext])

  // function setColorByPhase() {
  //     if (themeContext.themeState == "work") {
  //         setPhaseClass("bg-pomogreen-nav")
  //         setInactiveLinkColor("text-pomogreen-inactive fill-pomogreen-inactive dark:text-zinc-500 dark:fill-zinc-500")
  //     } else if (themeContext.themeState == "shortbreak") {
  //         setPhaseClass("bg-pomored-nav")
  //         setInactiveLinkColor("text-pomored-bg fill-pomored-bg dark:text-zinc-500 dark:fill-zinc-500")
  //     } else {
  //         setPhaseClass("bg-pomorange-nav")
  //         setInactiveLinkColor("text-pomorange-bg dark:text-zinc-300 fill-pomorange-bg dark:text-zinc-500 dark:fill-zinc-500")
  //     }
  // }

  return (
    <button className="bg-white dark:bg-zinc-700 md:hover:bg-zinc-100 dark:md:text-black hover:cursor-pointer p-2 mx-1 md:my-1 rounded-lg text-center text-neutral-900 dark:text-white font-semibold dark:font-normal text-xs" onClick={onClick}>
      {label}
    </button>
  )
}