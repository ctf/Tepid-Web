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