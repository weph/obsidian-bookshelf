import styles from './reading-streak.module.scss'
import { Interval, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { DateTime } from 'luxon'

interface Props {
    statistics: Statistics
}

export function ReadingStreak({ statistics }: Props) {
    const values = Array.from(statistics.pagesRead(Interval.Day).entries())
    const max = Math.max(...values.map((v) => v[1]))

    return (
        <div className={styles.readingStreak}>
            {values.map((v, i) => (
                <ReadingStreakItem key={i} date={v[0]} v={v[1]} max={max} />
            ))}
        </div>
    )
}

function ReadingStreakItem({ date, v, max }: { date: Date; v: number; max: number }) {
    const color = `rgba(var(--color-green-rgb), ${Math.ceil((v / max) * 5) / 5})`

    return (
        <div
            aria-label={`${v} pages read on ${DateTime.fromJSDate(date).toLocaleString()}`}
            style={v > 0 ? { backgroundColor: color, borderWidth: 0 } : {}}
            className={styles.item}
        ></div>
    )
}
