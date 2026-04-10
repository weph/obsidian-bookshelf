import { createContext } from 'react'

interface App {
    displayTooltip(elem: HTMLElement, content: string | DocumentFragment): void
}

export const AppContext = createContext<App>({
    displayTooltip: () => {},
})
