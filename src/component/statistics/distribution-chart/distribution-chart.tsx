import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { TagCloud } from '../../tag-cloud/tag-cloud'
import { Dropdown, DropdownOption } from '../../dropdown/dropdown'
import { useState } from 'react'
import { Book } from '../../../bookshelf/book/book'
import { StatisticsPanel } from '../statistics-panel/statistics-panel'

interface Props {
    statistics: Statistics
}

interface DimensionDropdownOption extends DropdownOption<string> {
    keys: (book: Book) => undefined | number | string | Array<string>
}

const dimensionOptions: Array<DimensionDropdownOption> = [
    {
        value: 'author',
        label: 'Author',
        keys: (book) => book.metadata.authors.map((a) => a.toString()),
    },
    {
        value: 'genres',
        label: 'Genres',
        keys: (book) => book.metadata.genre || [],
    },
    {
        value: 'tags',
        label: 'Tags',
        keys: (book) => book.metadata.tags || [],
    },
    {
        value: 'year',
        label: 'Year',
        keys: (book) => book.metadata.published?.getFullYear(),
    },
]

export function DistributionChart({ statistics }: Props) {
    const [dimension, setDimension] = useState<DimensionDropdownOption>(dimensionOptions[2])
    const tags = Object.fromEntries(statistics.frequencyMap(dimension.keys).entries())

    return (
        <StatisticsPanel
            title="Distribution"
            controls={
                <Dropdown
                    label="Dimension"
                    value={dimension.value}
                    options={dimensionOptions}
                    onChange={(o) => setDimension(o)}
                />
            }
        >
            <TagCloud tags={tags} />
        </StatisticsPanel>
    )
}
