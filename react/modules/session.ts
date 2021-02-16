export interface KeyValue {
  value: string
}

export interface Session {
  id: string
  namespaces: {
    profile: {
      isAuthenticated: KeyValue
    }
  }
}

export interface SessionUnauthorized {
  type: 'Unauthorized'
  message: string
}

export interface RenderSession {
  sessionPromise: Promise<SessionPromise>
}
export interface SessionPromise {
  response: Session | SessionUnauthorized
}

export type SessionWindow = Window & {
  __RENDER_8_SESSION__?: { sessionPromise?: Promise<SessionPromise> }
}

export function getSession() {
  const renderWindow = window as SessionWindow

  return renderWindow?.__RENDER_8_SESSION__?.sessionPromise ?? null
}
