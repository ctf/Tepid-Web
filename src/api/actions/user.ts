import {User} from "../models/user";
import {tepidGetJson} from "../base";

export function getUser(sam: string): Promise<User> {
    return tepidGetJson(`users/${sam}`);
}