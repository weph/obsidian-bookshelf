import { Book } from '../../../bookshelf/book/book'
import { createRoot } from 'react-dom/client'
import { ReactNode } from 'react'
import { BookProgressBar } from '../../progress-bar/book-progress-bar'
import { StarRating } from '../../star-rating/star-rating'
import { TagList } from '../../tag-list/tag-list'

export type RenderFunction = (element: HTMLElement, book: Book) => void

export const title: RenderFunction = (element, book) => renderText(element, book.metadata.title)

export const published: RenderFunction = (element, book) =>
    renderText(element, book.metadata.published?.getFullYear().toString())

export const pages: RenderFunction = (element, book) => renderText(element, book.metadata.pages?.toLocaleString())

export const duration: RenderFunction = (element, book) =>
    renderText(element, book.metadata.duration?.toString('verbose'))

export const genres: RenderFunction = (element, book) => renderText(element, book.metadata.genre?.join(', '))

export const status: RenderFunction = (element, book) => renderText(element, book.status)

export const author: RenderFunction = (element, book) => {
    renderReact(
        element,
        <>
            {(book.metadata.authors || []).map((author, i) => (
                <div key={i}>{author.toString()}</div>
            ))}
        </>,
    )
}

export const progress: RenderFunction = (element, book) => {
    renderReact(element, <BookProgressBar book={book} />)
}

export const rating: RenderFunction = (element, book) => {
    renderReact(element, <StarRating value={book.metadata.rating || 0} />)
}

export const tags: RenderFunction = (element, book) => {
    renderReact(element, <TagList tags={book.metadata.tags || []} />)
}

export const cover: RenderFunction = (element, book) => {
    renderReact(element, <img src={book.metadata.cover} alt={book.metadata.title} />)
}

function renderText(element: HTMLElement, text: string | undefined): void {
    element.innerText = text || ''
}

function renderReact(element: HTMLElement, children: ReactNode): void {
    createRoot(element.createDiv()).render(children)
}
