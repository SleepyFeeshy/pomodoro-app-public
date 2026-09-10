type SessionTypeTagProps = {
  session_type?: string
}

export default function SessionTypeChip({session_type}: SessionTypeTagProps) {
  const styling = () => {
    console.log(session_type)
    if (session_type?.toLowerCase() == "short break") return "text-pomored-text bg-pomored-bg"
    if (session_type?.toLowerCase() == "long break") return "text-pomorange-text bg-pomorange-bg"
    if (session_type?.toLowerCase() == "work") return "text-pomogreen-text bg-pomogreen-bg"
  }

  return (
    <div className={`${styling()} border-1 w-fit py-[2px] rounded-full px-2 text-xs`}>
      {session_type}
    </div>
  )
}