import { useEffect, useState } from 'react'

import type { Session, SessionUnauthorized } from '../modules/session'
import { getSession } from '../modules/session'

export const useSessionAuthorization = () => {
  const [session, setSession] = useState<Session | SessionUnauthorized>()
  const sessionPromise = getSession()

  useEffect(() => {
    if (!sessionPromise) {
      return
    }

    sessionPromise.then(sessionResponse => {
      setSession(sessionResponse.response)
    })
  }, [sessionPromise])

  if (!session) {
    return null
  }

  return !(
    (session as SessionUnauthorized)?.type.toLowerCase() === 'unauthorized'
  )
}
