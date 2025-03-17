import { Book } from '../../bookshelf/book'
import '../button/button'
import '../star-rating/star-rating'
import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DateTime } from 'luxon'
import { ReadingJourneyItem } from '../../bookshelf/reading-journey/reading-journey-log'

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

        #reading-journey {
            position: relative;
            padding-left: 1rem;
            list-style: none;
        }

        #reading-journey li {
            position: relative;
            padding-left: 1rem;
            border-left: 2px solid var(--color-base-100);
            font-size: var(--font-ui-small);
            padding-bottom: 0.75rem;
            line-height: 1;
        }

        #reading-journey li:last-child {
            padding-bottom: 0;
        }

        #reading-journey li:before {
            content: ' ';
            position: absolute;
            left: -8px;
            width: 8px;
            height: 8px;
            border: 3px solid var(--color-base-100);
            border-radius: 100%;
            background-color: var(--color-base-00);
        }
    `

    @property({ attribute: false })
    public book: Book

    @property()
    public openNote: (book: Book) => void

    protected render() {
        const { cover, title, authors, published, rating, tags } = this.book.metadata

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
                            text="Open note"
                            @click=${() => this.openNote(this.book)}
                        ></bookshelf-ui-button>
                    </div>
                </div>
            </div>
            <div>
                <ul id="reading-journey">
                    ${this.book.readingJourney.map(
                        (item) =>
                            html` <li>
                                ${DateTime.fromJSDate(item.date).toLocaleString()}: ${this.journeyItemText(item)}
                            </li>`,
                    )}
                </ul>
            </div>
        `
    }

    private journeyItemText(item: ReadingJourneyItem) {
        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return item.action
            case 'progress':
                return `${item.startPage}-${item.endPage}`
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: BookDetails
    }
}
