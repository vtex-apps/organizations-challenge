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

export function getSession() {
  const renderWindow: any = window

  const sessionPromise = renderWindow?.__RENDER_8_SESSION__?.sessionPromise as
    | Promise<SessionPromise>
    | undefined

  return sessionPromise ?? null
}
