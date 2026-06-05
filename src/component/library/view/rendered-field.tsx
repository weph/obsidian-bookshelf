import { useEffect, useRef } from 'react'
import { Book } from '../../../bookshelf/book/book'
import { RenderFunction } from './render-functions'

interface Props {
    book: Book
    renderTo: RenderFunction
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

    return <span ref={ref}></span>
}
