import { Input } from '../input/input'
import { useState } from 'react'
import { Book, ReadingStatus } from '../../bookshelf/book'
import { Gallery } from '../gallery/gallery'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { BookSortOptions } from '../../bookshelf/sort/book-sort-options'
import { BookTable } from '../table/table'
import styles from './library.module.scss'

type ViewType = 'gallery' | 'table'

export interface Props {
    books: Array<Book>
    sortOptions: BookSortOptions
    onBookClick: (book: Book) => void
}

const statusFilterOptions: Array<DropdownOption<ReadingStatus | null>> = [
    { value: null, label: 'All books' },
    { value: 'unread', label: 'Unread' },
    { value: 'reading', label: 'Reading' },
    { value: 'abandoned', label: 'Abandoned' },
    { value: 'finished', label: 'Finished' },
]

const viewOptions: Array<DropdownOption<ViewType>> = [
    { value: 'gallery', label: 'Gallery' },
    { value: 'table', label: 'Table' },
]

export function Library({ books, sortOptions, onBookClick }: Props) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortOption, setSortOption] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<ReadingStatus | null>(null)
    const [view, setView] = useState<ViewType>('gallery')

    const sortFunction = (): ((a: Book, b: Book) => number) => {
        if (sortOption !== '') {
            return sortOptions.compareFunction(sortOption)
        }

        if (sortOptions.titles().length > 0) {
            return sortOptions.compareFunction(sortOptions.titles()[0])
        }

        return () => 0
    }

    const content = () => {
        if (books.length === 0) {
            return (
                <EmptyState
                    headline="No books found"
                    message="Set up Bookshelf or add your first book note to start building your library."
                />
            )
        }

        const filteredBooks = books
            .filter((b) => {
                if (statusFilter !== null && b.status !== statusFilter) {
                    return false
                }

                return b.metadata.title.toLowerCase().includes(searchTerm.toLowerCase())
            })
            .sort(sortFunction())

        if (searchTerm && filteredBooks.length === 0) {
            return (
                <EmptyState headline="No books found" message="Try a different search term or check your spelling." />
            )
        }

        if (view === 'table') {
            return <BookTable books={filteredBooks} onBookClick={onBookClick} />
        }

        return <Gallery books={filteredBooks} onBookClick={onBookClick} />
    }

    return (
        <div className={styles.library}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <Input
                        type="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onUpdate={setSearchTerm}
                        autoFocus={true}
                    />
                    <Dropdown
                        label="Sort"
                        value={sortOption}
                        options={sortOptions.titles().map((title) => ({ value: title, label: title }))}
                        onChange={setSortOption}
                    />
                    <Dropdown
                        label="Status"
                        value={statusFilter}
                        options={statusFilterOptions}
                        onChange={setStatusFilter}
                    />
                </div>
                <div>
                    <Dropdown label="View" value={view} options={viewOptions} onChange={setView} />
                </div>
            </div>
            <div className={styles.content} role="main">
                {content()}
            </div>
        </div>
    )
}

function EmptyState({ headline, message }: { headline: string; message: string }) {
    return (
        <div>
            <div className={styles.messageContainer}>
                <h1>{headline}</h1>
                <p>{message}</p>
            </div>
        </div>
    )
}
