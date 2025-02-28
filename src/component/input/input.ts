import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-ui-input'

@customElement(TAG_NAME)
export class Input extends LitElement {
    static styles = css`
        input {
            height: var(--bookshelf--ui--input--height);
            border-style: solid;
            border-radius: var(--bookshelf--ui--input--border-radius);
            border-width: var(--bookshelf--ui--input--border-width);
            border-color: var(--bookshelf--ui--dropdown--border-color);
            font-weight: var(--bookshelf--ui--input--font-weight);
            padding: var(--bookshelf--ui--input--padding);
        }
    `
    @query('input')
    private input: HTMLInputElement | null

    private _value: string

    private lastValue: string

    @property()
    public type: 'text' | 'search'

    @property()
    public placeholder: string

    @property()
    public onUpdate: (value: string) => void

    @property()
    set value(value: string) {
        this._value = value
    }

    get value() {
        return this.input?.value || ''
    }

    protected render() {
        return html`
            <input
                type="${this.type}"
                placeholder="${this.placeholder}"
                value="${this._value}"
                @keyup="${() => this.handleUpdate()}"
                @change="${() => this.handleUpdate()}"
                @input="${() => this.handleUpdate()}"
                @search="${() => this.handleUpdate()}"
            />
        `
    }

    private handleUpdate(): void {
        const currentValue = this.value
        if (!this.onUpdate || this.lastValue === currentValue) {
            return
        }

        this.lastValue = currentValue

        this.onUpdate(currentValue)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Input
    }
}
