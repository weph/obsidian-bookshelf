import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { TagCloud } from '../../tag-cloud/tag-cloud'

interface Props {
    statistics: Statistics
}

export function TagUsageChart({ statistics }: Props) {
    const tags = (): { [key: string]: number } => {
        const result: { [key: string]: number } = {}

        for (const [tag, count] of statistics.tagUsage().entries()) {
            result[tag] = count
        }

        return result
    }

    return <TagCloud tags={tags()} />
}
