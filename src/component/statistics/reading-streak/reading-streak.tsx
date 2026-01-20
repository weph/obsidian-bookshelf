import styles from './reading-streak.module.scss'
import { Interval, PagesRead, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { DateTime } from 'luxon'

interface Props {
    statistics: Statistics
}

export function ReadingStreak({ statistics }: Props) {
    const values = Array.from(statistics.pagesRead(Interval.Day).entries())
    const max = Math.max(...values.map((v) => v[1].total))

    return (
        <div className={styles.readingStreak}>
            {values.map((v, i) => (
                <ReadingStreakItem key={i} date={v[0]} v={v[1]} max={max} />
            ))}
        </div>
    )
}

function ReadingStreakItem({ date, v, max }: { date: Date; v: PagesRead; max: number }) {
    const color = `rgba(var(--color-green-rgb), ${Math.ceil((v.total / max) * 5) / 5})`
    const extra = []

    for (const [book, pages] of v.books.entries()) {
        extra.push(`${book}: ${pages}`)
    }

    return (
        <div style={v.total > 0 ? { backgroundColor: color, borderWidth: 0 } : {}} className={styles.item}>
            {v.total > 0 && (
                <div className={styles.itemDetails}>
                    {`${v.total} pages read on ${DateTime.fromJSDate(date).toLocaleString()}`}
                    <ul>
                        {Array.from(v.books.entries()).map((v) => (
                            <li key={v[0]}>{`${v[0]}: ${v[1]}`}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
