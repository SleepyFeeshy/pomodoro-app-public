import { useAuth } from "../../contexts/AuthContext"

export default function GoogleSignInButton() {
  const {authenticateUser, session, logOut, userProfile} = useAuth()

  if (userProfile === null) {
    return (
      <button className="bg-component flex-1 p-2 mx-auto rounded-md font-semibold hover:cursor-pointer hover:bg-neutral-400 m-auto" onClick={authenticateUser}>
                Sign In With Google 
      </button>
    )
  }
  return (
    <button className="bg-component flex-1 p-2 mx-auto rounded-md font-semibold hover:cursor-pointer hover:bg-neutral-400 m-auto" onClick={logOut}>
            Sign Out
    </button>
  )
}