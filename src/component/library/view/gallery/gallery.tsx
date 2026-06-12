import { GalleryCard, ProgressBarOptions } from './gallery-card'
import styles from './gallery.module.scss'
import { BookViewItem } from '../../book-view-item'
import type { GroupedData } from '../../../../bookshelf/book/grouping'
import { GroupHeading } from '../group-heading/group-heading'
import { BookClickCallback } from '../../../types'

interface Props {
    items: GroupedData<Array<BookViewItem>> | Array<BookViewItem>
    onBookClick: BookClickCallback
    progressBar?: ProgressBarOptions
}

export function Gallery({ items, onBookClick, progressBar }: Props) {
    if (Array.isArray(items)) {
        return (
            <div className={styles.gallery} role="list">
                {items.map((item, index) => (
                    <GalleryCard
                        key={index}
                        item={item}
                        onClick={(e) => onBookClick(item.book, e)}
                        progressBar={progressBar || 'only-reading'}
                    />
                ))}
            </div>
        )
    }

    return Array.from(items.groups).map((entry) => (
        <div className={styles.group} key={entry[0]}>
            <GroupHeading
                heading={entry[0] === null ? items.nullLabel : entry[0]}
                fallback={entry[0] === null}
                count={entry[1].length}
            />
            <div className={styles.gallery} role="list">
                {entry[1].map((item, index) => (
                    <GalleryCard
                        key={index}
                        item={item}
                        onClick={(e) => onBookClick(item.book, e)}
                        progressBar={progressBar || 'only-reading'}
                    />
                ))}
            </div>
        </div>
    ))
}
