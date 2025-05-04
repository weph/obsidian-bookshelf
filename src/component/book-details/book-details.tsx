import { Book } from '../../bookshelf/book/book'
import { StarRating } from '../star-rating/star-rating'
import { DateTime } from 'luxon'
import { ReadingJourneyItem } from '../../bookshelf/reading-journey/reading-journey-log'
import { ReadingJourneyMatch } from '../../bookshelf/note-processing/note-processor'
import { ReadingJourneyForm } from './reading-journey-form'
import styles from './book-details.module.scss'
import { CoverPlaceholder } from '../cover-placeholder/cover-placeholder'
import { ExternalLink } from 'lucide-react'
import { TagList } from '../tag-list/tag-list'
import { Icon } from '../icon/icon'
import { Link } from '../../bookshelf/book/link'
import { TextLink } from '../text-link/text-link'

interface Props {
    book: Book
    openLink: (book: Book | Link) => void
    addProgress: (item: ReadingJourneyMatch) => Promise<void>
}

export function BookDetails({ book, openLink, addProgress }: Props) {
    const { cover, title, authors, published, pages, rating, tags, comment, links } = book.metadata

    const journeyItemText = (item: ReadingJourneyItem) => {
        switch (item.action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return item.action
            case 'progress':
                if (item.pages !== undefined) {
                    return `${item.start}-${item.end} (${item.pages} pages)`
                }

                return `${item.start}-${item.end}`
        }
    }

    return (
        <div className={styles.bookDetails}>
            <div className={styles.top}>
                <div className={styles.cover}>
                    {cover ? <img src={cover} alt={title} /> : <CoverPlaceholder title={title} />}
                </div>
                <div className={styles.details}>
                    <div className={styles.title}>
                        {title}
                        <div className={styles.openNote}>
                            <Icon icon={ExternalLink} onClick={() => openLink(book)} />
                        </div>
                    </div>
                    {authors.length > 0 && <Authors authors={authors} openLink={openLink} />}
                    <div className={styles.pagesAndDate}>
                        {pages && <div>{pages.toLocaleString()} pages</div>}
                        {published && <div>{published.getFullYear()}</div>}
                        {rating && <StarRating value={rating} />}
                    </div>

                    {tags && <TagList className={styles.tags} tags={tags} />}

                    {links && (
                        <ul className={styles.links}>
                            {links.map((l, i) => (
                                <li key={i}>
                                    <TextLink link={l} onClick={openLink} />
                                </li>
                            ))}
                        </ul>
                    )}

                    {comment && <q className={styles.comment}>{comment}</q>}
                </div>
            </div>
            <div>
                <ul className={styles.readingJourney}>
                    {book.readingJourney.map((item, i) => (
                        <li key={i}>
                            {DateTime.fromJSDate(item.date).toLocaleString()}: {journeyItemText(item)}
                        </li>
                    ))}
                    <li>
                        <ReadingJourneyForm book={book} add={addProgress} />
                    </li>
                </ul>
            </div>
        </div>
    )
}

interface AuthorsProps {
    authors: Array<string | Link>
    openLink: (link: Link) => void
}

function Authors({ authors, openLink }: AuthorsProps) {
    return (
        <div className={styles.authors}>
            by{' '}
            {authors.map((author, i) => [
                i > 0 && ', ',
                author instanceof Link ? (
                    <a
                        key={i}
                        href="#"
                        onClick={(event) => {
                            event.preventDefault()
                            openLink(author)
                        }}
                    >
                        {author.displayText}
                    </a>
                ) : (
                    <span key={i}>{author}</span>
                ),
            ])}
        </div>
    )
}
