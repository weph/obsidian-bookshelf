import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { DateRange } from '../../../bookshelf/shared/date-range'
import { KeyMetricsPanel } from '../key-metrics-panel/key-metrics-panel'

export function PagesPanel({ dateRange, statistics }: { dateRange: DateRange; statistics: Statistics }) {
    return (
        <KeyMetricsPanel
            title="Pages"
            metrics={[
                {
                    title: 'total',
                    value: statistics.totalNumberOfPages(),
                },
                {
                    title: '⌀ per day',
                    value: statistics.totalNumberOfPages() / dateRange.distinctCalendarUnits().days,
                },
            ]}
        />
    )
}
