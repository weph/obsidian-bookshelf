import { Statistics } from '../../../bookshelf/reading-journey/statistics/statistics'
import { Pie } from 'react-chartjs-2'

interface Props {
    statistics: Statistics
}

export function TagUsageChart({ statistics }: Props) {
    const countsAndLabels = (): [Array<number>, Array<string>] => {
        const counts: Array<number> = []
        const labels: Array<string> = []

        Array.from(statistics.tagUsage().entries())
            .sort((a, b) => (a[1] > b[1] ? -1 : 1))
            .slice(0, 20)
            .forEach((i) => {
                counts.push(i[1])
                labels.push(i[0])
            })

        return [counts, labels]
    }

    const data = countsAndLabels()

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '540px', aspectRatio: '1/1' }}>
                <Pie
                    data={{
                        datasets: [
                            {
                                data: data[0],
                            },
                        ],
                        labels: data[1],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            colors: {
                                forceOverride: true,
                            },
                            legend: {
                                display: false,
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}
