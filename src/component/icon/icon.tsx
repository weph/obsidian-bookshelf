import styles from './icon.module.scss'
import * as react from 'react'
import { LucideProps } from 'lucide-react'

export interface Props {
    icon: react.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>>
    size?: 'xs' | 's' | 'm' | 'l' | 'xl'
    onClick?: () => void
    disabled?: boolean
    ariaLabel?: string
}

export function Icon({ icon, size, onClick, disabled, ariaLabel }: Props) {
    const className = onClick ? styles.clickable : styles.icon
    const Icon = icon

    return (
        <span
            className={className}
            onClick={() => onClick && !disabled && onClick()}
            aria-disabled={disabled || false}
            aria-label={ariaLabel}
        >
            <Icon style={{ width: `var(--icon-${size || 'm'})`, height: `var(--icon-${size || 'm'})` }} />
        </span>
    )
}
