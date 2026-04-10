import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { KeyMetricsPanel } from '../key-metrics-panel/key-metrics-panel'

export function BookMetricsPanel({ statistics }: { statistics: Statistics }) {
    const actions = statistics.actions()

    return (
        <KeyMetricsPanel
            title="Books"
            metrics={[
                {
                    title: 'started',
                    value: actions.started,
                },
                {
                    title: 'finished',
                    value: actions.finished,
                },
                {
                    title: 'abandoned',
                    value: actions.abandoned,
                },
            ]}
        />
    )
}
