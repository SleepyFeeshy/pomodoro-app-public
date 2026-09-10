export default function TimerButton(props) {
  return (
    <button onClick={props.onClick} type="button" className={`${props.customBg ? props.customBg : "dark:bg-zinc-700 "} bg-zinc-50/50 md:hover:bg-zinc-100 rounded-2xl md:rounded-full hover:cursor-pointer h-15 md:h-15 transition-colors duration-(--phase)`}>
      <div className="mx-auto">
        {props.children}
      </div>
    </button>
  )
}