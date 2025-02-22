export interface ButtonProps {
    text: string
}

export class Button extends HTMLElement implements ButtonProps {
    private root: ShadowRoot

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })

        this.update()
    }

    private update(): void {
        this.root.innerHTML = `
            <button>${this.text}</button>
            <style>
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
            </style>
        `
    }

    static get observedAttributes() {
        return ['text']
    }

    public attributeChangedCallback(): void {
        this.update()
    }

    get text(): string {
        return this.getAttribute('text') || ''
    }

    set text(value: string) {
        this.setAttribute('text', value)
    }
}

const TAG_NAME = 'bookshelf-ui-button'

customElements.define(TAG_NAME, Button)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Button
    }
}
