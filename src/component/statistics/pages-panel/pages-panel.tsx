import { StatisticsPanel } from '../statistics-panel/statistics-panel'
import styles from '../statistics.module.scss'
import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { DateRange } from '../../../bookshelf/shared/date-range'

export function PagesPanel({ dateRange, statistics }: { dateRange: DateRange; statistics: Statistics }) {
    return (
        <StatisticsPanel title="Pages">
            <div className={styles.counts}>
                <div>
                    <div className={styles.number}>{statistics.totalNumberOfPages().toLocaleString()}</div>
                    total
                </div>
                <div>
                    <div className={styles.number}>
                        {(statistics.totalNumberOfPages() / dateRange.distinctCalendarUnits().days).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        )}
                    </div>
                    ⌀ per day
                </div>
            </div>
        </StatisticsPanel>
    )
}
