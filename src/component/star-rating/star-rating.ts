export interface StarRatingProps {
    value?: number
}

export class StarRating extends HTMLElement implements StarRatingProps {
    private root: ShadowRoot

    private starContainer: HTMLElement

    private iconSize = 15

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
        this.root.innerHTML = `
            <main></main>
            <style>
                main {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    align-items: center;
                }
                
                .star {
                    overflow: hidden;
                }
            </style>
        `

        this.starContainer = this.root.querySelector('main')!
    }

    static get observedAttributes() {
        return ['value']
    }

    public attributeChangedCallback(): void {
        this.update()
    }

    private update(): void {
        if (this.value === undefined) {
            this.starContainer.innerHTML = ''
            return
        }

        const full = Math.trunc(this.value)
        const fraction = this.value - full

        this.starContainer.innerHTML = Array(full).fill(this.star(1)).join('') + this.star(fraction)
    }

    private star(percentage: number): string {
        if (percentage === 0) {
            return ''
        }

        return `
            <div class="star" style="width: ${this.iconSize * percentage}px; height: ${this.iconSize}px">
                <svg xmlns="http://www.w3.org/2000/svg" width="${this.iconSize}" height="${this.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
            </div>
        `
    }

    set value(value: number) {
        this.setAttribute('value', value.toString())
    }

    get value(): number | undefined {
        const attrValue = this.getAttribute('value')

        if (attrValue === null) {
            return undefined
        }

        return parseFloat(attrValue)
    }
}

const TAG_NAME = 'bookshelf-ui-star-rating'

customElements.define(TAG_NAME, StarRating)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: StarRating
    }
}
