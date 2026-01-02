export type TokenStore = {
    get: () => string | null
    set: (token: string) => void
    clear: () => void
}