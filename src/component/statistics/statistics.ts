import './pages-read-chart/pages-read-chart'
import './tag-usage-chart/tag-usage-chart'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { Book } from '../../bookshelf/book'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-statistics'

export interface StatisticsProps {
    bookshelf: Bookshelf
    onBookClick: ((book: Book) => void) | null
}

@customElement(TAG_NAME)
export class Statistics extends LitElement {
    static styles = css`
        .container {
            max-width: 1080px;
            margin: 0 auto 4rem auto;
            padding: 0 2rem;
        }

        h2 {
            text-align: center;
        }

        .counts {
            display: flex;
            justify-content: center;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 5rem;
        }

        .counts div {
            text-align: center;
        }

        .counts .number {
            font-size: 3rem;
        }
    `

    @property()
    public bookshelf: Bookshelf | null = null

    @property()
    public year: number | null = null

    @property()
    public onBookClick: ((book: Book) => void) | null

    protected render() {
        if (this.bookshelf === null) {
            return html`...`
        }

        const statistics = this.bookshelf.statistics(this.year)
        const actions = statistics.actions()

        const yearOptions = [
            { value: null, label: 'All' },
            ...this.bookshelf
                .statistics()
                .years()
                .reverse()
                .map((y) => ({ value: y, label: y.toString() })),
        ]

        return html`
            <bookshelf-ui-dropdown
                .options=${yearOptions}
                .onChange=${(value: null | number) => (this.year = value)}
            ></bookshelf-ui-dropdown>
            <div class="container">
                <h2>Books</h2>
                <div id="book-counts" class="counts">
                    <div>
                        <div class="number">${actions.started}</div>
                        started
                    </div>
                    <div>
                        <div class="number">${actions.finished}</div>
                        finished
                    </div>
                    <div>
                        <div class="number">${actions.abandoned}</div>
                        abandoned
                    </div>
                </div>
            </div>
            <div class="container">
                <h2>Pages</h2>
                <div id="page-counts" class="counts">
                    <div>
                        <div class="number">${statistics.totalNumberOfPages().toLocaleString()}</div>
                        total
                    </div>
                </div>
                <bookshelf-statistics-pages-read-chart
                    .statistics=${statistics}
                ></bookshelf-statistics-pages-read-chart>
            </div>
            <div class="container">
                <h2>Most Frequently Used Tags</h2>
                <bookshelf-statistics-tag-usage-chart .statistics=${statistics}></bookshelf-statistics-tag-usage-chart>
            </div>
            <div class="container">
                <h2>Books</h2>
                <bookshelf-gallery .books=${statistics.books()}></bookshelf-gallery>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Statistics
    }
}
