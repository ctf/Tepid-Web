export type User = Readonly<{
    shortUser: string
    email?: string
}>

export type Session = Readonly<{
    id: string
    expiration: number
    token: string
}>

export type LoginRequest = Readonly<{
    user: string
    password: string
}>