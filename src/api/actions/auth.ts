import {LoginRequest, Session} from "../models/auth";
import {tepidDelete, tepidPostJson} from "../base";

export function login(request: LoginRequest): Promise<Session> {
    return tepidPostJson('sessions', request);
}

export function logout(id: string): Promise<void> {
    return tepidDelete(`sessions/${id}`);
}