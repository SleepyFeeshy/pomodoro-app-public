export default function PrimaryButton(props) {
  return (
    <button onClick={props.onClick} type="button" className={`${props.customBg ? props.customBg : "dark:bg-zinc-700 "} mx-auto rounded-full hover:cursor-pointer size-20 md:size-24 transition-colors duration-(--phase)`}>
      <div className="mx-auto">
        {props.children}
      </div>
    </button>
  )
}