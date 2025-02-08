export interface InputProps {
    type: string
    placeholder: string
    onUpdate: (value: string) => void
}

export class Input extends HTMLElement implements InputProps {
    private events = ['keyup', 'change', 'input', 'search']

    private root: ShadowRoot

    private readonly realInput: HTMLInputElement

    private lastValue: string

    private readonly onUpdateListener: () => void

    public onUpdate: (value: string) => void

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.realInput = document.createElement('input')
        this.root.appendChild(this.realInput)

        // Stryker disable all
        this.realInput.style.height = 'var(--bookshelf--ui--input--height)'
        this.realInput.style.borderStyle = 'solid'
        this.realInput.style.borderRadius = 'var(--bookshelf--ui--input--border-radius)'
        this.realInput.style.borderWidth = 'var(--bookshelf--ui--input--border-width)'
        this.realInput.style.borderColor = 'var(--bookshelf--ui--dropdown--border-color)'
        this.realInput.style.fontWeight = 'var(--bookshelf--ui--input--font-weight)'
        this.realInput.style.padding = 'var(--bookshelf--ui--input--padding)'
        // Stryker restore all

        this.onUpdateListener = this.update.bind(this)
    }

    public connectedCallback(): void {
        for (const event of this.events) {
            this.realInput.addEventListener(event, this.onUpdateListener)
        }
    }

    public disconnectedCallback(): void {
        for (const event of this.events) {
            this.realInput.removeEventListener(event, this.onUpdateListener)
        }
    }

    get value(): string {
        return this.realInput.value
    }

    set type(value: string) {
        this.realInput.setAttribute('type', value)
    }

    set placeholder(value: string) {
        this.realInput.setAttribute('placeholder', value)
    }

    private update(): void {
        const currentValue = this.realInput.value
        if (!this.onUpdate || this.lastValue === currentValue) {
            return
        }

        this.lastValue = currentValue

        this.onUpdate(currentValue)
    }
}

const TAG_NAME = 'bookshelf-ui-input'

customElements.define(TAG_NAME, Input)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Input
    }
}
