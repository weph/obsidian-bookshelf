import { Bookshelf } from '../../bookshelf/bookshelf'
import { Book } from '../../bookshelf/book/book'
import { MouseEvent, useState } from 'react'
import { AvailableInterval, PagesReadChart } from './pages-read-chart/pages-read-chart'
import { Gallery } from '../gallery/gallery'
import { TagUsageChart } from './tag-usage-chart/tag-usage-chart'
import styles from './statistics.module.scss'
import { useSyncedData } from '../hooks/use-synced-data'
import { DateRange } from '../../bookshelf/shared/date-range'
import { DateRangeSelection } from './date-range-selection/date-range-selection'
import { ReadingStreak } from './reading-streak/reading-streak'

export interface Props {
    bookshelf: Bookshelf
    onBookClick: (book: Book, event: MouseEvent) => void
}

export function Statistics({ bookshelf, onBookClick }: Props) {
    const journey = useSyncedData(bookshelf, (b) => b.readingJourney())
    const start = journey.items()[0]?.date || null
    const end = journey.lastItem()?.date || null
    const [dateRange, setDateRange] = useState<DateRange | null>(null)
    const statistics = useSyncedData(bookshelf, (b) => {
        return b.statistics(dateRange || undefined)
    })

    if (start === null || end === null) {
        return <>No data</>
    }

    const totalRange = DateRange.custom(start, end)

    const actions = statistics.actions()

    return (
        <div className={styles.statistics}>
            {totalRange && <DateRangeSelection totalRange={totalRange} value={dateRange} onChange={setDateRange} />}
            <div className={styles.container}>
                <h2>Books</h2>
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
                    availableIntervals={availableIntervals(dateRange || totalRange)}
                />
            </div>
            <div className={styles.container}>
                <h2>Reading Streak</h2>
                <ReadingStreak statistics={statistics} />
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

function availableIntervals(dateRange: DateRange): Array<AvailableInterval> {
    const duration = dateRange.distinctCalendarUnits()

    if (duration.years > 1) {
        return ['year', 'month', 'week', 'day']
    }

    if (duration.months > 1) {
        return ['month', 'week', 'day']
    }

    if (duration.days > 7) {
        return ['week', 'day']
    }

    return ['day']
}
