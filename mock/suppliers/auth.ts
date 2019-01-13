import {Session} from "../../src/api/models/auth";
import faker from 'faker';

export function createSession(shortUser: string): Session {
    const id = faker.random.number(1000000).toString();
    return {
        id: id,
        token: Buffer.from(`${shortUser}:${id}`).toString('base64'),
        expiration: -1
    }
}