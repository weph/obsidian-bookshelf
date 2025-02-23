import { Book } from '../../book'
import '../reading-progress-bar-chart/reading-progress-bar-chart'
import '../button/button'
import '../star-rating/star-rating'
import { ReadingProgressBarChart } from '../reading-progress-bar-chart/reading-progress-bar-chart'

export interface BookDetailsProps {
    book: Book
    openNote: (book: Book) => void
}

export class BookDetails extends HTMLElement implements BookDetailsProps {
    private root: ShadowRoot

    private _book: Book

    private readingProgressChart: ReadingProgressBarChart

    public openNote: (book: Book) => void = () => {}

    constructor() {
        super()

        this.root = this.attachShadow({ mode: 'open' })
    }

    private update(): void {
        const cover = this.book.metadata.cover
        const title = this.book.metadata.title
        const authors = this.book.metadata.authors
        const published = this.book.metadata.published
        const rating = this.book.metadata.rating
        const tags = this.book.metadata.tags

        this.root.innerHTML = `
            <main>
                <div id="top">
                    <div id="cover">
                        ${cover ? `<img src="${cover}" alt="${title}" />` : ''}
                    </div>
                    <div id="details">
                        <ul id="metadata">
                            ${authors?.length ? `<li><strong>Author:</strong> ${authors.join(', ')}</li>` : ''}
                            ${published ? `<li><strong>Published:</strong> ${published.getFullYear()}</li>` : ''}
                            ${rating ? `<li><strong>Rating:</strong> <bookshelf-ui-star-rating id="rating" value="${rating}"></bookshelf-ui-star-rating></li>` : ''}
                            ${tags?.length ? `<li><strong>Tags:</strong> ${tags.join(', ')}</li>` : ''}
                        </ul>
                        <div id="actions">
                            <bookshelf-ui-button id="open-note" text="Open Note"></bookshelf-ui-button>
                        </div>
                    </div>
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
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                
                #metadata {
                    flex-grow: 1;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                #metadata li {
                    padding: 2px;
                }
                
                #actions {
                    display: flex;
                    justify-content: flex-end;
                }
                
                #rating {
                    display: inline-block;
                }
            </style>
        `

        this.readingProgressChart = this.root.querySelector('bookshelf-reading-progress-bar-chart')!
        this.readingProgressChart.readingJourney = this.book.readingJourney.items()

        this.root.querySelector('#open-note')!.addEventListener('click', () => this.openNote(this._book))
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
