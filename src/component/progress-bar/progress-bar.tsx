import styles from './progress-bar.module.scss'

interface Props {
    percentage: number
}

export function ProgressBar({ percentage }: Props) {
    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
            <div className={styles.percentage}>{percentage}%</div>
        </div>
    )
}
