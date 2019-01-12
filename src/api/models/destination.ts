import {User} from "./user";

export type Destination = {
    name: string
    protocol?: string | null
    path?: string | null
    domain?: string | null
    ticket?: DestinationTicket | null
    up: boolean
}

export type DestinationTicket = {
    up: boolean
    reason?: string | null
    user?: User | null
    reported: number
}