import {Session, LoginRequest} from "../models/auth";

export function login(request: LoginRequest): Promise<Session> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: "asdf",
                token: "asdff",
                expiration: 1000
            })
        }, 500)
    })
}

export function logout(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
}