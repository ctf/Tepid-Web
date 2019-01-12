import {PrintJob} from "../features/rooms/models";

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

export type PrintJob = Readonly<{
    name: string
    queueName?: string
    originalHost?: string
    error?: string
    colorPages: number
    pages: number
    started: number
    processed: number
    printed: number
    failed: number
    received: number
    isRefunded: boolean
    eta: number
}>