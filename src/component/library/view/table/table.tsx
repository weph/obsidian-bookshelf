import { Book } from '../../../../bookshelf/book/book'
import styles from './table.module.scss'
import { MouseEvent } from 'react'
import { BookViewItem } from '../../book-view-item'
import type { GroupedData } from '../../../../bookshelf/book/grouping'
import { GroupHeading } from '../group-heading/group-heading'

interface Props {
    items: GroupedData<Array<BookViewItem>> | Array<BookViewItem>
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function BookTable({ items, onBookClick }: Props) {
    if (Array.isArray(items)) {
        return (
            <table className={styles.bookTable}>
                <tbody>
                    <BookRows items={items} onBookClick={onBookClick} />
                </tbody>
            </table>
        )
    }

    return (
        <table className={styles.bookTable}>
            <tbody>
                {Array.from(items.groups).map((entry, index) => (
                    <BookGroup
                        key={index}
                        heading={entry[0] === null ? items.nullLabel : entry[0]}
                        fallback={entry[0] === null}
                        items={entry[1]}
                        onBookClick={onBookClick}
                    />
                ))}
            </tbody>
        </table>
    )
}

interface BookGroupProps {
    heading: string
    fallback: boolean
    items: Array<BookViewItem>
    onBookClick: (book: Book, event: MouseEvent) => void
}

function BookGroup({ heading, fallback, items, onBookClick }: BookGroupProps) {
    return (
        <>
            <tr className={styles.groupHeading}>
                <td colSpan={items[0].fields.length}>
                    <GroupHeading heading={heading} fallback={fallback} count={items.length} />
                </td>
            </tr>
            <BookRows items={items} onBookClick={onBookClick} />
        </>
    )
}

function BookRows({
    items,
    onBookClick,
}: {
    items: Array<BookViewItem>
    onBookClick: (book: Book, event: MouseEvent) => void
}) {
    if (items.length === 0) {
        return null
    }

    return (
        <>
            <tr>
                {items[0].fields.map((field, index) => (
                    <th key={index}>{field.name}</th>
                ))}
            </tr>
            {items.map((item, itemIndex) => (
                <tr key={itemIndex} onClick={(e) => onBookClick(item.book, e)}>
                    {item.fields.map((field, fieldIndex) => (
                        <td key={fieldIndex}>{field.value(item.book)}</td>
                    ))}
                </tr>
            ))}
        </>
    )
}
