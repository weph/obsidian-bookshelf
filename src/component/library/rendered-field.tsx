import { useEffect, useRef } from 'react'

interface Props {
    renderTo: (element: HTMLElement) => void
}

export function RenderedField({ renderTo }: Props) {
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const el = ref.current
        if (el) {
            el.empty?.()
            renderTo(el)
        }
    }, [renderTo])

    return <span ref={ref}></span>
}
