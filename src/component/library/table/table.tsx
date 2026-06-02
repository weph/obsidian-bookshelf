import { Book } from '../../../bookshelf/book/book'
import styles from './table.module.scss'
import { MouseEvent } from 'react'
import { BookViewItem } from '../book-view-item'
import { RenderedField } from '../rendered-field'

interface Props {
    items: Array<BookViewItem>
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function BookTable({ items, onBookClick }: Props) {
    return (
        <table className={styles.bookTable}>
            <thead>
                <tr>
                    {items[0].fields.map((field, index) => (
                        <th key={index}>{field.name}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {items.map((item, itemIndex) => (
                    <tr key={itemIndex} onClick={(e) => onBookClick(item.book, e)}>
                        {item.fields.map((field, fieldIndex) => (
                            <td key={fieldIndex}>
                                <RenderedField book={item.book} renderTo={field.renderTo} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
