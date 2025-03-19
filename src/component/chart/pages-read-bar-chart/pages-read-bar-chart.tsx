import 'chartjs-adapter-luxon'
import { TimeUnit } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

interface Props {
    data: Array<{ x: number; y: number }>
    xAxisUnit: TimeUnit
}

export function PagesReadBarChart({ data, xAxisUnit }: Props) {
    return (
        <Bar
            data={{
                datasets: [
                    {
                        label: '# of pages',
                        data,
                    },
                ],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        type: 'timeseries',
                        time: {
                            unit: xAxisUnit,
                        },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            }}
        />
    )
}
