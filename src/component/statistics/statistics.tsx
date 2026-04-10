import { Bookshelf } from '../../bookshelf/bookshelf'
import { Book } from '../../bookshelf/book/book'
import { MouseEvent, useState } from 'react'
import { AvailableInterval, PagesReadChart } from './pages-read-chart/pages-read-chart'
import { DistributionChart } from './distribution-chart/distribution-chart'
import styles from './statistics.module.scss'
import { useSyncedData } from '../hooks/use-synced-data'
import { DateRange } from '../../bookshelf/shared/date-range'
import { DateRangeSelection } from './date-range-selection/date-range-selection'
import { ReadingStreak } from './reading-streak/reading-streak'
import { BookMetricsPanel } from './book-metrics-panel/book-metrics-panel'
import { PageReadMetricsPanel } from './page-read-metrics-panel/page-read-metrics-panel'
import { BookGalleryPanel } from './book-gallery-panel/book-gallery-panel'

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

    return (
        <div className={styles.statistics}>
            <DateRangeSelection totalRange={totalRange} value={dateRange} onChange={setDateRange} />
            <div className={styles.halfWidth}>
                <BookMetricsPanel statistics={statistics} />
            </div>
            <div className={styles.halfWidth}>
                <PageReadMetricsPanel dateRange={dateRange || totalRange} statistics={statistics} />
            </div>
            <PagesReadChart statistics={statistics} availableIntervals={availableIntervals(dateRange || totalRange)} />
            <ReadingStreak statistics={statistics} />
            <DistributionChart statistics={statistics} />
            <BookGalleryPanel statistics={statistics} onBookClick={onBookClick} />
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
