import {PrintJob} from "../models/printjobs";

export function loadPrintJobs(room: string): Promise<PrintJob[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {
                    name: "Test",
                    colorPages: 0,
                    pages: 2,
                    started: 1,
                    processed: -1,
                    printed: -1,
                    failed: -1,
                    received: -1,
                    isRefunded: false,
                    eta: 1
                }
            ])
        }, 500)
    })
}