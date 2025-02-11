interface Option<T> {
    value: T
    label: string
}

export interface DropdownProps<T> {
    options: Array<Option<T>>
    onChange: (value: T) => void
    value: T
}

export class Dropdown<T = never> extends HTMLElement implements DropdownProps<T> {
    private root: ShadowRoot

    private readonly select: HTMLSelectElement

    private readonly onUpdateListener: () => void

    private _options: Array<Option<T>> = []

    public onChange: (value: T) => void = () => {}

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <select></select>
            <style>
                select {
                    display: block;
                    appearance: none;
                    height: var(--bookshelf--ui--dropdown--height);
                    border-radius: var(--bookshelf--ui--dropdown--border-radius);
                    border-width: var(--bookshelf--ui--dropdown--border-width);
                    box-shadow: var(--bookshelf--ui--dropdown--box-shadow);
                    font-weight: var(--bookshelf--ui--dropdown--font-weight);
                    background-color: var(--bookshelf--ui--dropdown--background);
                    background-blend-mode: var(--bookshelf--ui--dropdown--background-blend-mode);
                    background-size: var(--bookshelf--ui--dropdown--background-size);
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' opacity='0.9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' %3E%3Cpath d='m7 15 5 5 5-5'/%3E%3Cpath d='m7 9 5-5 5 5'/%3E%3C/svg%3E");
                    background-position: var(--bookshelf--ui--dropdown--background-position);
                    background-repeat: no-repeat;
                    padding: var(--bookshelf--ui--dropdown--padding);
                }            
            </style>
        `

        this.onUpdateListener = this.update.bind(this)

        this.select = this.root.querySelector('select') as HTMLSelectElement
    }

    public connectedCallback(): void {
        this.select.addEventListener('change', this.onUpdateListener)
    }

    public disconnectedCallback(): void {
        this.select.removeEventListener('change', this.onUpdateListener)
    }

    get value(): T {
        return this._options[parseInt(this.select.value)]?.value
    }

    set value(value: T) {
        this.select.value = this._options.findIndex((o) => o.value === value).toString()
    }

    private update(): void {
        this.onChange(this.value)
    }

    set options(value: Array<Option<T>>) {
        this._options = value
        this.select.replaceChildren(...value.map((o, i) => this.option(i.toString(), o.label)))
    }

    private option(value: string, label: string): HTMLOptionElement {
        const option = document.createElement('option')
        option.value = value
        option.innerHTML = label

        return option
    }

    set label(value: string) {
        this.select.setAttribute('aria-label', value)
    }
}

const TAG_NAME = 'bookshelf-ui-dropdown'

customElements.define(TAG_NAME, Dropdown)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Dropdown
    }
}
