import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-ui-button'

@customElement(TAG_NAME)
export class Button extends LitElement {
    static styles = css`
        button {
            display: block;
            appearance: none;
            height: var(--bookshelf--ui--button--height);
            border-radius: var(--bookshelf--ui--button--border-radius);
            border-width: var(--bookshelf--ui--button--border-width);
            box-shadow: var(--bookshelf--ui--button--box-shadow);
            font-weight: var(--bookshelf--ui--button--font-weight);
            background-color: var(--bookshelf--ui--button--background);
            padding: var(--bookshelf--ui--button--padding);
        }

        button:hover {
            background-color: var(--bookshelf--ui--button--hover--background);
            box-shadow: var(--bookshelf--ui--button--hover--box-shadow);
        }
    `

    @property()
    public text: string

    protected render() {
        return html` <button>${this.text}</button>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Button
    }
}
