import styles from './reading-streak.module.scss'
import { Interval, PagesRead, Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { DateTime } from 'luxon'
import { StatisticsPanel } from '../statistics-panel/statistics-panel'
import { useContext } from 'react'
import { AppContext } from '../../app-context'

interface Props {
    statistics: Statistics
}

export function ReadingStreak({ statistics }: Props) {
    const values = Array.from(statistics.pagesRead(Interval.Day).entries())
    const max = Math.max(...values.map((v) => v[1].total))

    return (
        <StatisticsPanel title="Reading streak">
            <div className={styles.readingStreak}>
                {values.map((v, i) => (
                    <ReadingStreakItem key={i} date={v[0]} v={v[1]} max={max} />
                ))}
            </div>
        </StatisticsPanel>
    )
}

function ReadingStreakItem({ date, v, max }: { date: Date; v: PagesRead; max: number }) {
    const app = useContext(AppContext)
    const color = `rgba(var(--color-green-rgb), ${Math.ceil((v.total / max) * 5) / 5})`
    const extra = []

    for (const [book, pages] of v.books.entries()) {
        extra.push(`${book}: ${pages}`)
    }

    function showTooltip(elem: HTMLDivElement) {
        if (elem.childElementCount === 0) {
            return
        }

        const frag = document.createDocumentFragment()
        frag.appendChild(elem.childNodes[0].cloneNode(true))

        app.displayTooltip(elem, frag)
    }

    return (
        <div
            style={v.total > 0 ? { backgroundColor: color, borderWidth: 0 } : {}}
            className={styles.item}
            onMouseOver={(e) => showTooltip(e.currentTarget)}
        >
            {v.total > 0 && <ReadingStreakItemTooltip date={date} v={v} />}
        </div>
    )
}

function ReadingStreakItemTooltip({ date, v }: { date: Date; v: PagesRead }) {
    return (
        <div className={styles.tooltip}>
            {`${v.total} pages read on ${DateTime.fromJSDate(date).toLocaleString()}`}
            <ul>
                {Array.from(v.books.entries()).map((v) => (
                    <li key={v[0]}>{`${v[0]}: ${v[1]}`}</li>
                ))}
            </ul>
        </div>
    )
}
