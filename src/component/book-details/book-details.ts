import { Book } from '../../book'
import '../reading-progress-bar-chart/reading-progress-bar-chart'
import { ReadingProgressBarChart } from '../reading-progress-bar-chart/reading-progress-bar-chart'

export interface BookDetailsProps {
    book: Book
}

export class BookDetails extends HTMLElement implements BookDetailsProps {
    private root: ShadowRoot

    private _book: Book

    private readingProgressChart: ReadingProgressBarChart

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
    }

    private update(): void {
        const cover = this.book.metadata.cover
        const title = this.book.metadata.title
        const authors = this.book.metadata.authors
        const published = this.book.metadata.published
        const tags = this.book.metadata.tags

        this.root.innerHTML = `
            <main>
                <div id="top">
                    <div id="cover">
                        ${cover ? `<img src="${cover}" alt="${title}" />` : ''}
                    </div>
                    <ul id="details">
                        ${authors?.length ? `<li><strong>Author:</strong> ${authors.join(', ')}</li>` : ''}
                        ${published ? `<li><strong>Published:</strong> ${published.getFullYear()}</li>` : ''}
                        ${tags?.length ? `<li><strong>Tags:</strong> ${tags.join(', ')}</li>` : ''}
                    </ul>
                </div>
                <bookshelf-reading-progress-bar-chart></bookshelf-reading-progress-bar-chart>
            </main>
            <style>
                #top {
                    display: flex;
                    flex-direction: row;
                    gap: 15px;
                }
                
                #cover {
                    width: 25%;
                    aspect-ratio: 1/1.25;
                }
                
                #cover img {
                    width: 100%;
                }
                
                #details {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                #details li {
                    padding: 2px;
                }
            </style>
        `

        this.readingProgressChart = this.root.querySelector(
            'bookshelf-reading-progress-bar-chart',
        ) as ReadingProgressBarChart
        this.readingProgressChart.readingJourney = this.book.readingJourney.items()
    }

    get book() {
        return this._book
    }

    set book(book: Book) {
        this._book = book
        this.update()
    }
}

const TAG_NAME = 'bookshelf-book-details'

customElements.define(TAG_NAME, BookDetails)

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: BookDetails
    }
}
