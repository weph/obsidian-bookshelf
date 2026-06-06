import { useEffect, useRef } from 'react'
import { Book } from '../../../../bookshelf/book/book'
import styles from './rendered-field.module.scss'

interface Props {
    book: Book
    renderTo: (e: HTMLElement, b: Book) => void
}

export function RenderedField({ book, renderTo }: Props) {
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const el = ref.current
        if (el) {
            el.empty?.()
            renderTo(el, book)
        }
    }, [renderTo])

    return <span className={styles.field} ref={ref}></span>
}
