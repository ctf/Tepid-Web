export type Session = Readonly<{
    id: string
    expiration: number
    token: string
}>

export type LoginRequest = Readonly<{
    user: string
    password: string
    persistent: boolean
    permanent: boolean
}>