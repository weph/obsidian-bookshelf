import { StatisticsPanel } from '../statistics-panel/statistics-panel'
import { Gallery } from '../../gallery/gallery'
import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { Book, ReadingStatus } from '../../../bookshelf/book/book'
import { MouseEvent, useState } from 'react'
import { Dropdown, DropdownOption } from '../../dropdown/dropdown'
import { MatchField } from '../../../bookshelf/book/search/expressions/match-field'
import { Equals } from '../../../bookshelf/book/search/conditions/equals'

interface Props {
    statistics: Statistics
    onBookClick: (book: Book, event: MouseEvent) => void
}

const statusFilterOptions: Array<DropdownOption<ReadingStatus | null>> = [
    { value: null, label: 'All books' },
    { value: 'reading', label: 'Reading' },
    { value: 'abandoned', label: 'Abandoned' },
    { value: 'finished', label: 'Finished' },
]

export function BookGalleryPanel({ statistics, onBookClick }: Props) {
    const [status, setStatus] = useState<ReadingStatus | null>(null)

    const books =
        status === null ? statistics.books() : statistics.books().matching(new MatchField('status', new Equals(status)))

    return (
        <StatisticsPanel
            title="Books"
            controls={
                <Dropdown
                    label="Status"
                    value={status}
                    options={statusFilterOptions}
                    onChange={(o) => setStatus(o.value)}
                />
            }
        >
            <Gallery books={books} onBookClick={onBookClick} />
        </StatisticsPanel>
    )
}
