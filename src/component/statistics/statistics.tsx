import { Bookshelf } from '../../bookshelf/bookshelf'
import { Book } from '../../bookshelf/book/book'
import { MouseEvent, useState } from 'react'
import { AvailableInterval, PagesReadChart } from './pages-read-chart/pages-read-chart'
import { Gallery } from '../gallery/gallery'
import { DistributionChart } from './distribution-chart/distribution-chart'
import styles from './statistics.module.scss'
import { useSyncedData } from '../hooks/use-synced-data'
import { DateRange } from '../../bookshelf/shared/date-range'
import { DateRangeSelection } from './date-range-selection/date-range-selection'
import { ReadingStreak } from './reading-streak/reading-streak'
import { StatisticsPanel } from './statistics-panel/statistics-panel'

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
            <DateRangeSelection totalRange={totalRange} value={dateRange} onChange={setDateRange} />
            <div className={styles.halfWidth}>
                <StatisticsPanel title="Books">
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
                </StatisticsPanel>
            </div>
            <div className={styles.halfWidth}>
                <StatisticsPanel title="Pages">
                    <div className={styles.counts}>
                        <div>
                            <div className={styles.number}>{statistics.totalNumberOfPages().toLocaleString()}</div>
                            total
                        </div>
                    </div>
                </StatisticsPanel>
            </div>
            <PagesReadChart statistics={statistics} availableIntervals={availableIntervals(dateRange || totalRange)} />
            <ReadingStreak statistics={statistics} />
            <DistributionChart statistics={statistics} />
            <StatisticsPanel title="Books">
                <Gallery books={statistics.books()} onBookClick={onBookClick} />
            </StatisticsPanel>
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
