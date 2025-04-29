import { Link } from '../../bookshelf/book/link'
import { MouseEvent } from 'react'
import styles from './text-link.module.scss'

interface Props {
    link: Link
    onClick: (link: Link) => void
}

export function TextLink({ link, onClick }: Props) {
    function handleClick(event: MouseEvent) {
        event.preventDefault()
        onClick(link)
    }

    const className = link.type === 'internal' ? styles.internalLink : styles.externalLink

    return (
        <a href={link.target} className={className} onClick={handleClick}>
            {link.displayText}
        </a>
    )
}
