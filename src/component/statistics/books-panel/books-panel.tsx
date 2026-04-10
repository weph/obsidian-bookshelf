import { StatisticsPanel } from '../statistics-panel/statistics-panel'
import styles from '../statistics.module.scss'
import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'

export function BooksPanel({ statistics }: { statistics: Statistics }) {
    const actions = statistics.actions()

    return (
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
    )
}
