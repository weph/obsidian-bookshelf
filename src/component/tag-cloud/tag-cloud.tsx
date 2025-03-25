interface Props {
    tags: { [key: string]: number }
}

export function TagCloud({ tags }: Props) {
    const maxValue = Math.max(...Object.values(tags))
    const multiplier = maxValue / 9

    console.log(maxValue, multiplier)

    return (
        <ul className="bookshelf--tag-cloud">
            {Object.entries(tags).map(([tag, count]) => (
                <li key={tag} data-weight={Math.round(count / multiplier)}>
                    {tag}
                </li>
            ))}
        </ul>
    )
}
