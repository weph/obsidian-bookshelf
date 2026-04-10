import { ReactElement, ReactNode } from 'react'
import styles from './statistics-panel.module.scss'

interface Props {
    title: string
    controls?: ReactElement
    children: ReactNode
}

export function StatisticsPanel({ title, controls, children }: Props) {
    return (
        <section className={styles.statisticsPanel}>
            <header>
                <h2>{title}</h2>
                {controls}
            </header>
            {children}
        </section>
    )
}
