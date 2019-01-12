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

export function testPrintJob(id: number): PrintJob  {
    return {
        name: `name${id}`,
        queueName: 'test-queue',
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
}