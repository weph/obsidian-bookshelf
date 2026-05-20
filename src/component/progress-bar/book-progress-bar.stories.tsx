import type { Meta, StoryObj } from '@storybook/react'
import { BookProgressBar } from './book-progress-bar'
import { BookBuilder } from '../../support/book-builder'
import { Page } from '../../bookshelf/reading-journey/position/page'
import { Playtime } from '../../bookshelf/shared/playtime'
import { Time } from '../../bookshelf/reading-journey/position/time'
import { RomanNumeral } from '../../bookshelf/reading-journey/position/roman-numeral'

const meta = {
    title: 'Book Progress Bar',
    component: BookProgressBar,
} satisfies Meta<typeof BookProgressBar>

export default meta
type Story = StoryObj<typeof BookProgressBar>

export const PageAndTotalPagesKnown: Story = {
    args: {
        book: new BookBuilder().withStatus('reading').with('pages', 100).withLastPosition(new Page(55)).build(),
    },
}

export const TimeAndDurationKnown: Story = {
    args: {
        book: new BookBuilder()
            .withStatus('reading')
            .with('duration', Playtime.fromString('8:45'))
            .withLastPosition(new Time(Playtime.fromString('4:00')))
            .build(),
    },
}

export const FrontMatter: Story = {
    args: {
        book: new BookBuilder().withStatus('reading').with('pages', 200).withLastPosition(new RomanNumeral(23)).build(),
    },
}

export const TotalPagesUnknown: Story = {
    args: {
        book: new BookBuilder().withStatus('reading').withLastPosition(new Page(55)).build(),
    },
}

export const TotalDurationUnknown: Story = {
    args: {
        book: new BookBuilder()
            .withStatus('reading')
            .withLastPosition(new Time(Playtime.fromMinutes(24)))
            .build(),
    },
}

export const FinishedWithLessThan100Percent: Story = {
    args: {
        book: new BookBuilder().withStatus('finished').with('pages', 100).withLastPosition(new Page(55)).build(),
    },
}

export const AbandonedBook: Story = {
    args: {
        book: new BookBuilder().withStatus('abandoned').with('pages', 100).withLastPosition(new Page(55)).build(),
    },
}

export const UnreadBook: Story = {
    args: {
        book: new BookBuilder().withStatus('unread').with('pages', 100).build(),
    },
}
