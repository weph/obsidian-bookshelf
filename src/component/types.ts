import { Book } from '../bookshelf/book/book'
import { MouseEvent } from 'react'

export type BookClickCallback = (book: Book, event: MouseEvent) => void
