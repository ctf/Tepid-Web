export type State = Readonly<{
    user?: User
    session?: Session
}>

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

export const enum Page {
    LOGIN = "page_login"
}