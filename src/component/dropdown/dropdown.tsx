import styles from './dropdown.module.scss'

export interface DropdownOption<T> {
    value: T
    label: string
}

interface Props<TValue, T extends DropdownOption<TValue>> {
    label: string
    value: TValue
    options: Array<T>
    onChange: (option: T) => void
    id?: string
    className?: string
}

export function Dropdown<TValue, T extends DropdownOption<TValue>>({
    label,
    value,
    options,
    onChange,
    id,
    className,
}: Props<TValue, T>) {
    return (
        <select
            id={id}
            className={`${styles.dropdown} ${className || ''}`}
            onChange={(e) => onChange(options[parseInt(e.target.value)])}
            aria-label={label}
            value={options.findIndex((v) => v.value === value)}
        >
            {options.map((o, i) => (
                <option key={i} value={i.toString()}>
                    {o.label}
                </option>
            ))}
        </select>
    )
}
