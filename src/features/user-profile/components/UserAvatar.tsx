import { useAuth } from "@/contexts/AuthContext"
export default function UserAvatar() {
  const {session, userProfile} = useAuth()

  if (userProfile == null) {
    return
  }

  if (userProfile.picture !== null) {
    return (
      <img src={userProfile.picture} alt="userImage" referrerPolicy="no-referrer" className="rounded-full"/>
    )
  }
  
}