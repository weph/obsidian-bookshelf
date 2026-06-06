import { Book } from '../../../bookshelf/book/book'
import { JSX } from 'react'
import { BookProgressBar } from '../../progress-bar/book-progress-bar'
import { StarRating } from '../../star-rating/star-rating'
import { TagList } from '../../tag-list/tag-list'

const text = (text: string | undefined) => <span>{text || ''}</span>

export type RenderFunction = (book: Book) => JSX.Element

export const title: RenderFunction = (book) => text(book.metadata.title)
export const published: RenderFunction = (book) => text(book.metadata.published?.getFullYear().toString())
export const pages: RenderFunction = (book) => text(book.metadata.pages?.toLocaleString())
export const duration: RenderFunction = (book) => text(book.metadata.duration?.toString('verbose'))
export const genres: RenderFunction = (book) => text(book.metadata.genre?.join(', '))
export const status: RenderFunction = (book) => text(book.status)

export const progress: RenderFunction = (book) => <BookProgressBar book={book} />
export const rating: RenderFunction = (book) => <StarRating value={book.metadata.rating || 0} />
export const tags: RenderFunction = (book) => <TagList tags={book.metadata.tags || []} />
export const cover: RenderFunction = (book) => <img src={book.metadata.cover} alt={book.metadata.title} />
export const author: RenderFunction = (book) => {
    return (
        <>
            {(book.metadata.authors || []).map((author, i) => (
                <div key={i}>{author.toString()}</div>
            ))}
        </>
    )
}
