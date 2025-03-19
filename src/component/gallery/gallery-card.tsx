interface Props {
    cover?: string
    title: string
    onClick: () => void
}

export function GalleryCard({ cover, title, onClick }: Props) {
    return (
        <div className="bookshelf--gallery--card" role="listitem" onClick={() => onClick()}>
            {cover ? <img src={cover} alt={title} /> : ''}
            <div className={cover ? 'overlay' : 'fallback-cover'}>
                <span className="title">{title}</span>
            </div>
        </div>
    )
}
