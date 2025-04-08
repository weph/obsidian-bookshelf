import { Input } from '../input/input'
import { useState } from 'react'
import { Book, ReadingStatus } from '../../bookshelf/book'
import { Gallery } from '../gallery/gallery'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { BookTable } from '../table/table'
import styles from './library.module.scss'
import { SortDropdownOption } from './book-sort-options'
import { bookGroupingOptions, GroupingDropdownOption } from './book-grouping-options'

type ViewType = 'gallery' | 'table'

export interface Props {
    books: Array<Book>
    sortOptions: Array<SortDropdownOption>
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
    const [sortOption, setSortOption] = useState<SortDropdownOption | null>(sortOptions[0])
    const [groupingOption, setGroupingOption] = useState<GroupingDropdownOption>(bookGroupingOptions[0])
    const [statusFilter, setStatusFilter] = useState<ReadingStatus | null>(null)
    const [view, setView] = useState<ViewType>('gallery')
    const ViewComponent = view === 'gallery' ? Gallery : BookTable

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
            .sort(sortOption?.compareFn)

        if (searchTerm && filteredBooks.length === 0) {
            return (
                <EmptyState headline="No books found" message="Try a different search term or check your spelling." />
            )
        }

        if (groupingOption.grouped) {
            return Array.from(groupingOption.grouped(filteredBooks)).map((entry) => (
                <div key={entry[0]}>
                    <h2>{entry[0] || 'N/A'}</h2>
                    <ViewComponent books={entry[1]} onBookClick={onBookClick} />
                </div>
            ))
        }

        return <ViewComponent books={filteredBooks} onBookClick={onBookClick} />
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
                        value={sortOption?.value}
                        options={sortOptions}
                        onChange={(o) => setSortOption(o)}
                    />
                    <Dropdown
                        label="Grouping"
                        value={groupingOption.value}
                        options={bookGroupingOptions}
                        onChange={(o) => setGroupingOption(o)}
                    />
                    <Dropdown
                        label="Status"
                        value={statusFilter}
                        options={statusFilterOptions}
                        onChange={(o) => setStatusFilter(o.value)}
                    />
                </div>
                <div>
                    <Dropdown label="View" value={view} options={viewOptions} onChange={(o) => setView(o.value)} />
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
