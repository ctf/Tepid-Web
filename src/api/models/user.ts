export type AuthUser = Readonly<{
    shortUser: string
    email?: string
}>

export type UserQuery = Readonly<{
    displayName: string
    shortUser: string
    emial: string
    colorPrinting: boolean
}>

export type User = Readonly<{
    displayName?: string | null
    givenName?: string | null
    middleName?: string | null
    lastName?: string | null
    shortUser: string
    longUser?: string | null
    email?: string | null
    faculty?: string | null
    nick?: string | null
    realName?: string | null
    salutation?: string | null
    authType?: string | null
    role: string
    preferredName: string[]
    activeSince: number
    studentId: number
    colorPrinting: boolean
}> & AuthUser