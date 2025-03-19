interface Props {
    text: string
    onClick: () => void
}

export function Button({ text, onClick }: Props) {
    return (
        <button className="bookshelf--ui--button" onClick={() => onClick()}>
            {text}
        </button>
    )
}
