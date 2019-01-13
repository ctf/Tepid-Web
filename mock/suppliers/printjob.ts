import {PrintJob} from "../../src/api/models/printjob";
import faker from 'faker';

export function createPrintjob(shortUser: string, color: boolean = true): PrintJob {
    const colorPages = color ? faker.random.number(20) : 0;
    const pages = colorPages + faker.random.number(30);
    return {
        name: faker.name.title(),
        colorPages: colorPages,
        pages: pages,
        started: Date.now(),
        processed: -1,
        printed: -1,
        failed: -1,
        received: -1,
        isRefunded: false,
        eta: 0
    }
}