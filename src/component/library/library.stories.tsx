import type { Meta, StoryObj } from '@storybook/react'
import { Book } from '../../bookshelf/book/book'
import { algorithms, books } from '../../support/book-fixtures'
import { initialSettings, Library, Settings } from './library'
import { bookSortOptions } from './book-sort-options'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { Books } from '../../bookshelf/book/books'
import { ExpressionFactory } from '../../bookshelf/book/search/expression-factory'
import { parser } from '../../bookshelf/book/search/parser'

const meta = {
    title: 'Library',
} satisfies Meta<typeof Library>

export default meta
type Story = StoryObj<typeof Library>

function renderFunction(books: Array<Book>) {
    return () => {
        const [settings, setSettings] = useState<Settings>(initialSettings)

        return (
            <Library
                settings={settings}
                settingsChanged={setSettings}
                books={new Books(books)}
                sortOptions={bookSortOptions}
                onBookClick={fn()}
                expressionFactory={new ExpressionFactory(parser())}
            />
        )
    }
}

export const Primary: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
    render: renderFunction(Object.values(books)),
}

export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    render: renderFunction(Object.values(books)),
}

export const Empty: Story = {
    render: renderFunction([]),
}

export const SingleBook: Story = {
    render: renderFunction([algorithms]),
}
