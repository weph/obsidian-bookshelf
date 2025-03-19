import { Book } from '../../bookshelf/book'
import { StarRating } from '../star-rating/star-rating'
import { Button } from '../button/button'
import { DateTime } from 'luxon'
import { ReadingJourneyItem } from '../../bookshelf/reading-journey/reading-journey-log'

interface Props {
    book: Book
    openNote: (book: Book) => void
}

export function BookDetails({ book, openNote }: Props) {
    const { cover, title, authors, published, rating, tags } = book.metadata

    const journeyItemText = (item: ReadingJourneyItem) => {
        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return item.action
            case 'progress':
                return `${item.startPage}-${item.endPage}`
        }
    }

    return (
        <div className="bookshelf--book-details">
            <div className="top">
                <div className="cover">{cover ? <img src={cover} alt={title} /> : ''}</div>
                <div className="details">
                    <ul className="metadata">
                        {authors?.length ? (
                            <li>
                                <strong>Author:</strong> {authors.join(', ')}
                            </li>
                        ) : (
                            ''
                        )}
                        {published ? (
                            <li>
                                <strong>Published:</strong> {published.getFullYear()}
                            </li>
                        ) : (
                            ''
                        )}
                        {rating ? (
                            <li>
                                <strong>Rating:</strong>
                                <StarRating value={rating} />
                            </li>
                        ) : (
                            ''
                        )}
                        {tags?.length ? (
                            <li>
                                <strong>Tags:</strong> {tags.join(', ')}
                            </li>
                        ) : (
                            ''
                        )}
                    </ul>
                    <div className="actions">
                        <Button text="Open note" onClick={() => openNote(book)} />
                    </div>
                </div>
            </div>
            <div>
                <ul className="reading-journey">
                    {book.readingJourney.map((item, i) => (
                        <li key={i}>
                            {DateTime.fromJSDate(item.date).toLocaleString()}: {journeyItemText(item)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
