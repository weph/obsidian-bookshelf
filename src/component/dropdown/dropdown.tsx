export interface DropdownOption<T> {
    value: T
    label: string
}

interface Props<T> {
    label: string
    value: T
    options: Array<DropdownOption<T>>
    onChange: (value: T) => void
}

export function Dropdown<T>({ label, value, options, onChange }: Props<T>) {
    return (
        <select
            className="bookshelf--ui--dropdown"
            onChange={(e) => onChange(options[parseInt(e.target.value)].value)}
            aria-label={label}
            defaultValue={options.findIndex((v) => v.value === value)}
        >
            {options.map((o, i) => (
                <option key={i} value={i.toString()}>
                    {o.label}
                </option>
            ))}
        </select>
    )
}
