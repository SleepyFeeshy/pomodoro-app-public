export default function SecondaryButton(props) {
  return (
    <button onClick={props.onClick} type="button" className={`m-auto rounded-full md:rounded-full hover:cursor-pointer size-12 md:h-15 transition-colors duration-(--phase)`}>
      <div className="mx-auto">
        {props.children}
      </div>
    </button>
  )
}