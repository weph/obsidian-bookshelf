import { Bookshelf } from '../../bookshelf/bookshelf'
import { Book } from '../../bookshelf/book/book'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { useState } from 'react'
import { PagesReadChart } from './pages-read-chart/pages-read-chart'
import { Gallery } from '../gallery/gallery'
import { TagUsageChart } from './tag-usage-chart/tag-usage-chart'
import styles from './statistics.module.scss'

export interface Props {
    bookshelf: Bookshelf
    onBookClick: (book: Book) => void
}

export function Statistics({ bookshelf, onBookClick }: Props) {
    const [year, setYear] = useState<number | null>(null)
    const statistics = bookshelf.statistics(year)
    const actions = statistics.actions()
    const yearOptions: Array<DropdownOption<number | null>> = [
        { value: null, label: 'All' },
        ...bookshelf
            .statistics()
            .years()
            .reverse()
            .map((y) => ({ value: y, label: y.toString() })),
    ]

    return (
        <div className={styles.statistics}>
            <Dropdown label="Years" value={year} options={yearOptions} onChange={(o) => setYear(o.value)} />
            <div className={styles.container}>
                <h2>Books {year}</h2>
                <div className={styles.counts}>
                    <div>
                        <div className={styles.number}>{actions.started}</div>
                        started
                    </div>
                    <div>
                        <div className={styles.number}>{actions.finished}</div>
                        finished
                    </div>
                    <div>
                        <div className={styles.number}>{actions.abandoned}</div>
                        abandoned
                    </div>
                </div>
            </div>
            <div className={styles.container}>
                <h2>Pages</h2>
                <div className={styles.counts}>
                    <div>
                        <div className={styles.number}>{statistics.totalNumberOfPages().toLocaleString()}</div>
                        total
                    </div>
                </div>
                <PagesReadChart
                    statistics={statistics}
                    availableIntervals={year === null ? ['year', 'month', 'week', 'day'] : ['month', 'week', 'day']}
                />
            </div>
            <div className={styles.container}>
                <h2>Tags</h2>
                <TagUsageChart statistics={statistics} />
            </div>
            <div className={styles.container}>
                <h2>Books</h2>
                <Gallery books={statistics.books()} onBookClick={onBookClick} />
            </div>
        </div>
    )
}
