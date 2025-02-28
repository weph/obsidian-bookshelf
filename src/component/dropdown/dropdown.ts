import { css, html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-ui-dropdown'

interface Option {
    value: string
    label: string
}

@customElement(TAG_NAME)
export class Dropdown extends LitElement {
    static styles = css`
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
    `

    @state()
    private _value: string | undefined = undefined

    @query('select')
    private select: HTMLSelectElement | null

    @property({ attribute: false })
    public options: Array<Option> = []

    @property()
    public onChange: (value: string) => void = () => {}

    @property()
    public label: string

    protected render() {
        return html` <select @change=${this.handleChange} aria-label="${this.label}">
            ${this.options.map(
                (o, i) =>
                    html` <option .value="${i.toString()}" ?selected=${o.value === this._value}>${o.label}</option>`,
            )}
        </select>`
    }

    private handleChange() {
        if (this.value !== undefined) {
            this.onChange(this.value)
        }
    }

    @property({ attribute: false })
    set value(value: string) {
        this._value = value
    }

    get value(): string | undefined {
        if (this.select === null) {
            return this.options[0]?.value
        }

        return this.options[parseInt(this.select.value || '0')]?.value
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Dropdown
    }
}
