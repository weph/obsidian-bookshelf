import { StatisticsPanel } from '../statistics-panel/statistics-panel'
import styles from './key-metrics-panel.module.scss'

interface Metric {
    title: string
    value: number
}

interface Props {
    title: string
    metrics: Array<Metric>
}

export function KeyMetricsPanel({ title, metrics }: Props) {
    function formattedNumber(v: number) {
        const fractionDigits = Number.isInteger(v) ? 0 : 2

        return v.toLocaleString(undefined, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        })
    }

    return (
        <StatisticsPanel title={title}>
            <div className={styles.counts}>
                {metrics.map((v, i) => (
                    <div key={i}>
                        <div className={styles.number}>{formattedNumber(v.value)}</div>
                        {v.title}
                    </div>
                ))}
            </div>
        </StatisticsPanel>
    )
}
