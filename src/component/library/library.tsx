import { Input } from '../input/input'
import { useState } from 'react'
import { Book, ReadingStatus } from '../../bookshelf/book/book'
import { Gallery } from '../gallery/gallery'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { BookTable } from '../table/table'
import styles from './library.module.scss'
import { SortDropdownOption } from './book-sort-options'
import { bookGroupingOptions, GroupingDropdownOption } from './book-grouping-options'
import { Icon } from '../icon/icon'
import { SlidersHorizontal } from 'lucide-react'

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

function listOptions(books: Array<Book>): Array<DropdownOption<string | null>> {
    const lists = Array.from(new Set(books.map((b) => b.metadata.lists).flat()))
    if (lists.length === 0) {
        return []
    }

    return [{ value: null, label: 'All lists' }, ...lists.map((l) => ({ value: l, label: l }))]
}

export function Library({ books, sortOptions, onBookClick }: Props) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortOption, setSortOption] = useState<SortDropdownOption | null>(sortOptions[0])
    const [groupingOption, setGroupingOption] = useState<GroupingDropdownOption>(bookGroupingOptions[0])
    const [statusFilter, setStatusFilter] = useState<ReadingStatus | null>(null)
    const [list, setList] = useState<string | null>(null)
    const [view, setView] = useState<ViewType>('gallery')
    const lists = listOptions(books)
    const ViewComponent = view === 'gallery' ? Gallery : BookTable
    const NavigationComponent = window.innerWidth < 640 ? MobileNavigation : DesktopNavigation

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

                if (list !== null && !b.metadata.lists.includes(list)) {
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
                <NavigationComponent
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortOptions={sortOptions}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    groupingOption={groupingOption}
                    setGroupingOption={setGroupingOption}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    lists={lists}
                    list={list}
                    setList={setList}
                    view={view}
                    setView={setView}
                />
            </div>
            <div className={styles.content} role="main">
                {content()}
            </div>
        </div>
    )
}

interface NavigationProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    sortOptions: Array<SortDropdownOption>
    sortOption: SortDropdownOption | null
    setSortOption: (value: SortDropdownOption | null) => void
    groupingOption: GroupingDropdownOption
    setGroupingOption: (value: GroupingDropdownOption) => void
    statusFilter: ReadingStatus | null
    setStatusFilter: (value: ReadingStatus | null) => void
    lists: Array<DropdownOption<string | null>>
    list: string | null
    setList: (value: string | null) => void
    view: ViewType
    setView: (value: ViewType) => void
}

function DesktopNavigation(props: NavigationProps) {
    return (
        <>
            <div className={styles.left}>
                <Input
                    type="search"
                    placeholder="Search..."
                    value={props.searchTerm}
                    onUpdate={props.setSearchTerm}
                    autoFocus={true}
                />
                {props.lists.length > 0 && (
                    <Dropdown
                        label="List"
                        value={props.list}
                        options={props.lists}
                        onChange={(o) => props.setList(o.value)}
                    />
                )}
                <Dropdown
                    label="Status"
                    value={props.statusFilter}
                    options={statusFilterOptions}
                    onChange={(o) => props.setStatusFilter(o.value)}
                />
                <Dropdown
                    label="Grouping"
                    value={props.groupingOption.value}
                    options={bookGroupingOptions}
                    onChange={(o) => props.setGroupingOption(o)}
                />
                <Dropdown
                    label="Sort"
                    value={props.sortOption?.value}
                    options={props.sortOptions}
                    onChange={(o) => props.setSortOption(o)}
                />
            </div>
            <div>
                <Dropdown
                    label="View"
                    value={props.view}
                    options={viewOptions}
                    onChange={(o) => props.setView(o.value)}
                />
            </div>
        </>
    )
}

function MobileNavigation(props: NavigationProps) {
    const [filtersVisible, setFiltersVisible] = useState(false)

    return (
        <div className={styles.mobileNavigation}>
            <div className={styles.searchBar}>
                <Input
                    type="search"
                    placeholder="Search..."
                    value={props.searchTerm}
                    onUpdate={props.setSearchTerm}
                    autoFocus={true}
                />
                <Icon icon={SlidersHorizontal} onClick={() => setFiltersVisible(!filtersVisible)} />
            </div>
            {filtersVisible && (
                <div className={styles.mobileNavigationFilters}>
                    <Dropdown
                        label="View"
                        value={props.view}
                        options={viewOptions}
                        onChange={(o) => props.setView(o.value)}
                    />
                    {props.lists.length > 0 && (
                        <Dropdown
                            label="List"
                            value={props.list}
                            options={props.lists}
                            onChange={(o) => props.setList(o.value)}
                        />
                    )}
                    <Dropdown
                        label="Status"
                        value={props.statusFilter}
                        options={statusFilterOptions}
                        onChange={(o) => props.setStatusFilter(o.value)}
                    />
                    <Dropdown
                        label="Grouping"
                        value={props.groupingOption.value}
                        options={bookGroupingOptions}
                        onChange={(o) => props.setGroupingOption(o)}
                    />
                    <Dropdown
                        label="Sort"
                        value={props.sortOption?.value}
                        options={props.sortOptions}
                        onChange={(o) => props.setSortOption(o)}
                    />
                </div>
            )}
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
