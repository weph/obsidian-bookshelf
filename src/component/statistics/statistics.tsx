import { Bookshelf } from '../../bookshelf/bookshelf'
import { Book } from '../../bookshelf/book/book'
import { Dropdown } from '../dropdown/dropdown'
import { MouseEvent, useState } from 'react'
import { PagesReadChart } from './pages-read-chart/pages-read-chart'
import { Gallery } from '../gallery/gallery'
import { TagUsageChart } from './tag-usage-chart/tag-usage-chart'
import styles from './statistics.module.scss'
import { useSyncedData } from '../hooks/use-synced-data'
import { DateRange } from '../../bookshelf/shared/date-range'

export interface Props {
    bookshelf: Bookshelf
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function Statistics({ bookshelf, onBookClick }: Props) {
    const [year, setYear] = useState<number | undefined>(undefined)
    const statistics = useSyncedData(bookshelf, (b) =>
        b.statistics(year === undefined ? undefined : DateRange.year(year)),
    )
    const actions = statistics.actions()
    const yearOptions = useSyncedData(bookshelf, (b) => [
        { value: undefined, label: 'All' },
        ...b
            .statistics()
            .years()
            .reverse()
            .map((y) => ({ value: y, label: y.toString() })),
    ])

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
                    availableIntervals={
                        year === undefined ? ['year', 'month', 'week', 'day'] : ['month', 'week', 'day']
                    }
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
