import { Input } from '../input/input'
import { MouseEvent, useState } from 'react'
import { Book, ReadingStatus } from '../../bookshelf/book/book'
import { Gallery } from './gallery/gallery'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { BookTable } from './table/table'
import styles from './library.module.scss'
import { SortDropdownOption } from './book-sort-options'
import { bookGroupingOptions } from './book-grouping-options'
import { Icon } from '../icon/icon'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '../button/button'
import { Books } from '../../bookshelf/book/books'
import { ExpressionFactory } from '../../bookshelf/book/search/expression-factory'
import { GroupedView } from './grouped-books/grouped-view'
import { pluralize } from './pluralize'
import { GroupedData } from '../../bookshelf/book/grouping'
import { BookViewItem } from './book-view-item'
import { createRoot } from 'react-dom/client'
import { BookProgressBar } from '../progress-bar/book-progress-bar'
import { StarRating } from '../star-rating/star-rating'
import { TagList } from '../tag-list/tag-list'

type ViewType = 'gallery' | 'table'

export interface Settings {
    search: string
    list: string | null
    status: ReadingStatus | null
    grouping: string | null
    sort: string | null
    view: ViewType
}

export const initialSettings: Settings = {
    search: '',
    list: null,
    status: null,
    grouping: null,
    sort: null,
    view: 'gallery',
}

export interface Props {
    settings: Settings
    settingsChanged: (newSettings: Settings) => void
    books: Books
    sortOptions: Array<SortDropdownOption>
    onBookClick: (book: Book, event: MouseEvent) => void
    expressionFactory: ExpressionFactory
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

function listOptions(books: Books): Array<DropdownOption<string | null>> {
    const lists = Array.from(new Set(books.map((b) => b.metadata.lists).flat())).sort((a, b) => a.localeCompare(b))

    if (lists.length === 0) {
        return []
    }

    return [{ value: null, label: 'All lists' }, ...lists.map((l) => ({ value: l, label: l }))]
}

function bookViewItem(viewType: ViewType, book: Book): BookViewItem {
    if (viewType === 'gallery') {
        return { book, fields: [] }
    }

    return {
        book,
        fields: [
            {
                name: 'Title',
                renderTo: (e) => (e.innerText = book.metadata.title),
            },
            {
                name: 'Author',
                renderTo: (e) => {
                    createRoot(e.createDiv()).render(
                        <>
                            {(book.metadata.authors || []).map((author, i) => (
                                <div key={i}>{author.toString()}</div>
                            ))}
                        </>,
                    )
                },
            },
            {
                name: 'Published',
                renderTo: (e) => (e.innerText = book.metadata.published?.getFullYear().toString() || ''),
            },
            {
                name: 'Pages',
                renderTo: (e) => (e.innerText = book.metadata.pages?.toLocaleString() || ''),
            },
            {
                name: 'Duration',
                renderTo: (e) => (e.innerText = book.metadata.duration?.toString('verbose') || ''),
            },
            {
                name: 'Progress',
                renderTo: (e) => {
                    createRoot(e.createDiv()).render(<BookProgressBar book={book} />)
                },
            },
            {
                name: 'Rating',
                renderTo: (e) => {
                    createRoot(e.createDiv()).render(<StarRating value={book.metadata.rating || 0} />)
                },
            },
            {
                name: 'Tags',
                renderTo: (e) => {
                    createRoot(e.createDiv()).render(<TagList tags={book.metadata.tags || []} />)
                },
            },
            {
                name: 'Genres',
                renderTo: (e) => (e.innerText = book.metadata.genre?.join(', ') || ''),
            },
            {
                name: 'Status',
                renderTo: (e) => (e.innerText = book.status),
            },
        ],
    }
}

export function Library({ settings, settingsChanged, books, sortOptions, onBookClick, expressionFactory }: Props) {
    const groupingOption = bookGroupingOptions.find((v) => v.value === settings.grouping) || bookGroupingOptions[0]
    const sortOption = sortOptions.find((o) => o.value === settings.sort) || sortOptions[0]
    const lists = listOptions(books)
    const ViewComponent = settings.view === 'gallery' ? Gallery : BookTable
    const NavigationComponent = window.innerWidth < 640 ? MobileNavigation : DesktopNavigation
    const reset = () => settingsChanged(initialSettings)

    let filteredBooks = new Books([])
    try {
        filteredBooks = books.matching(expressionFactory.fromQuery(settings)).sort(sortOption?.compareFn)
    } catch (e) {
        console.error(`Error filtering books`, e)
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

        if (filteredBooks.length === 0) {
            return <EmptyState headline="No books found" message="Try adjusting your search or filters." />
        }

        if (groupingOption.grouped) {
            const groupedBooks = groupingOption.grouped(filteredBooks)

            const groupedBookViewItems: GroupedData<Array<BookViewItem>> = {
                groups: new Map(
                    Array.from(groupedBooks.groups).map(([key, value]) => [
                        key,
                        value.map((book) => bookViewItem(settings.view, book)),
                    ]),
                ),
                nullLabel: groupedBooks.nullLabel,
            }

            return (
                <>
                    <BookCount total={books.length} filtered={filteredBooks.length} />
                    <GroupedView items={groupedBookViewItems} onBookClick={onBookClick} ViewComponent={ViewComponent} />
                </>
            )
        }

        return (
            <>
                <BookCount total={books.length} filtered={filteredBooks.length} />
                <ViewComponent
                    items={filteredBooks.map((book) => bookViewItem(settings.view, book))}
                    onBookClick={onBookClick}
                />
            </>
        )
    }

    return (
        <div className={styles.library}>
            <div className={styles.header}>
                <NavigationComponent
                    settings={settings}
                    settingsChanged={settingsChanged}
                    sortOptions={sortOptions}
                    lists={lists}
                    reset={reset}
                />
            </div>
            <div className={styles.content} role="main">
                {content()}
            </div>
        </div>
    )
}

interface NavigationProps {
    settings: Settings
    settingsChanged: (newSettings: Settings) => void
    sortOptions: Array<SortDropdownOption>
    lists: Array<DropdownOption<string | null>>
    reset: () => void
}

function DesktopNavigation({ settings, settingsChanged, lists, sortOptions, reset }: NavigationProps) {
    const settingsModified = JSON.stringify(settings) !== JSON.stringify(initialSettings)

    return (
        <>
            <div className={styles.left}>
                <Input
                    type="text"
                    placeholder="Search..."
                    value={settings.search}
                    onUpdate={(search) => settingsChanged({ ...settings, search })}
                    autoFocus={true}
                    clearable={true}
                />
                {lists.length > 0 && (
                    <Dropdown
                        label="List"
                        value={settings.list}
                        options={lists}
                        onChange={(o) => settingsChanged({ ...settings, list: o.value })}
                    />
                )}
                <Dropdown
                    label="Status"
                    value={settings.status}
                    options={statusFilterOptions}
                    onChange={(o) => settingsChanged({ ...settings, status: o.value })}
                />
                <Dropdown
                    label="Grouping"
                    value={settings.grouping}
                    options={bookGroupingOptions}
                    onChange={(o) => settingsChanged({ ...settings, grouping: o.value })}
                />
                <Dropdown
                    label="Sort"
                    value={settings.sort}
                    options={sortOptions}
                    onChange={(o) => settingsChanged({ ...settings, sort: o.value })}
                />
                {settingsModified && <Button text="Reset" onClick={() => reset()} accent={true} />}
            </div>
            <div>
                <Dropdown
                    label="View"
                    value={settings.view}
                    options={viewOptions}
                    onChange={(o) => settingsChanged({ ...settings, view: o.value })}
                />
            </div>
        </>
    )
}

function MobileNavigation({ settings, settingsChanged, lists, sortOptions, reset }: NavigationProps) {
    const [filtersVisible, setFiltersVisible] = useState(false)
    const settingsModified = JSON.stringify(settings) !== JSON.stringify(initialSettings)

    return (
        <div className={styles.mobileNavigation}>
            <div className={styles.searchBar}>
                <Input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search..."
                    value={settings.search}
                    onUpdate={(search) => settingsChanged({ ...settings, search })}
                    autoFocus={true}
                    clearable={true}
                />
                <Icon icon={SlidersHorizontal} onClick={() => setFiltersVisible(!filtersVisible)} />
            </div>
            {filtersVisible && (
                <div className={styles.mobileNavigationFilters}>
                    <Dropdown
                        label="View"
                        value={settings.view}
                        options={viewOptions}
                        onChange={(o) => settingsChanged({ ...settings, view: o.value })}
                    />
                    {lists.length > 0 && (
                        <Dropdown
                            label="List"
                            value={settings.list}
                            options={lists}
                            onChange={(o) => settingsChanged({ ...settings, list: o.value })}
                        />
                    )}
                    <Dropdown
                        label="Status"
                        value={settings.status}
                        options={statusFilterOptions}
                        onChange={(o) => settingsChanged({ ...settings, status: o.value })}
                    />
                    <Dropdown
                        label="Grouping"
                        value={settings.grouping}
                        options={bookGroupingOptions}
                        onChange={(o) => settingsChanged({ ...settings, grouping: o.value })}
                    />
                    <Dropdown
                        label="Sort"
                        value={settings.sort}
                        options={sortOptions}
                        onChange={(o) => settingsChanged({ ...settings, sort: o.value })}
                    />
                    {settingsModified && <Button text="Reset" onClick={() => reset()} accent={true} />}
                </div>
            )}
        </div>
    )
}

function BookCount({ total, filtered }: { total: number; filtered: number }) {
    function message() {
        if (filtered !== total) {
            return `Showing ${pluralize(filtered, 'book')} (out of ${total} total)`
        }

        if (total === 1) {
            return 'Showing the only book in your library'
        }

        return `Showing all ${total} books in your library`
    }

    return <div className={styles.bookCount}>{message()}</div>
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
