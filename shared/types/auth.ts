export type LoginRequest = {
  username: string
  password: string
}

export type SessionResponse = {
  isAuthenticated: boolean
  username: string | null
}
