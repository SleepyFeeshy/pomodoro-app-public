import { PomodoroPhase } from "@/contexts/TimerContext";

type HorizontalBarProps = {
    numerator: number,
    denominator: number,
    barBg?: string
    className?: string,
    widthClass?: string,
    currentPhase?: PomodoroPhase
}
export default function HorizontalBar({numerator, denominator, className, widthClass, barBg}: HorizontalBarProps) {
  // const [barColor, setBarColor] = useState('rgba(114, 114, 114, 1)')
  if (numerator != null) {
    return (
      <div className={`flex ${widthClass} px-[0px] ${barBg ?? 'bg-white'} dark:bg-zinc-900 rounded-md shadow-xs dark:shadow-none`}>
        <div className={`${className} my-auto rounded-l-md transition-colors duration-(--phase)`} style={{width: `${(Math.max((numerator),0)/denominator)*100}%`}}>
          {/* <h1 className="my-auto h-fit w-[120px] text-white font-semibold text-[14px] text-center">{`${numerator} / ${denominator}`}</h1> */}
        </div>
      </div>
    )
  }
}

function handleBarText(maxInterval: number, daysSinceLast: number) {
  const numerator = () => {
    if (daysSinceLast === null) return 0
    else {
      const diff  = maxInterval - daysSinceLast
      if (diff < 0) return 0
      return diff
    }
  }
  // const numerator =  daysSinceLast === null ? 0 : (maxInterval - daysSinceLast)
  const denominator = maxInterval
  return `${Math.trunc(numerator())} / ${Math.trunc(denominator)}`
}