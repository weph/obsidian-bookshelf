import { Book } from '../../bookshelf/book'
import '../chart/pages-read-bar-chart/pages-read-bar-chart'
import '../button/button'
import '../star-rating/star-rating'
import { Interval } from '../../bookshelf/reading-journey/statistics/statistics'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const TAG_NAME = 'bookshelf-book-details'

@customElement(TAG_NAME)
export class BookDetails extends LitElement {
    static styles = css`
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
    `

    @property()
    public book: Book

    @property()
    public openNote: (book: Book) => void

    protected render() {
        const { cover, title, authors, published, rating, tags } = this.book.metadata

        const data = Array.from(this.book.readingJourney.statistics().pagesRead(Interval.Day).entries()).map(
            (entry) => ({ x: entry[0].getTime(), y: entry[1] }),
        )

        return html`
            <div id="top">
                <div id="cover">${cover ? html`<img src="${cover}" alt="${title}" />` : ''}</div>
                <div id="details">
                    <ul id="metadata">
                        ${authors?.length ? html` <li><strong>Author:</strong> ${authors.join(', ')}</li>` : ''}
                        ${published ? html` <li><strong>Published:</strong> ${published.getFullYear()}</li>` : ''}
                        ${rating
                            ? html` <li>
                                  <strong>Rating:</strong>
                                  <bookshelf-ui-star-rating id="rating" value="${rating}"></bookshelf-ui-star-rating>
                              </li>`
                            : ''}
                        ${tags?.length ? html` <li><strong>Tags:</strong> ${tags.join(', ')}</li>` : ''}
                    </ul>
                    <div id="actions">
                        <bookshelf-ui-button
                            text="Open Note"
                            @click=${() => this.openNote(this.book)}
                        ></bookshelf-ui-button>
                    </div>
                </div>
            </div>
            <bookshelf-pages-read-bar-chart .data=${data} x-axis-unit="day"></bookshelf-pages-read-bar-chart>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: BookDetails
    }
}
