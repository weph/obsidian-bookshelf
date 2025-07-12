import type { Meta, StoryObj } from '@storybook/react'
import { DateRangeSelection } from './date-range-selection'
import { DateRange } from '../../../bookshelf/shared/date-range'
import { fn } from '@storybook/test'
import { useArgs } from '@storybook/preview-api'

const meta = {
    title: 'Statistics/Date Range Selection',
    component: DateRangeSelection,
    args: {
        totalRange: DateRange.custom(new Date(2023, 0, 1), new Date(2025, 11, 31)),
        value: null,
        onChange: fn(),
    },
    decorators: [
        function Component(Story, ctx) {
            const [, setArgs] = useArgs<typeof ctx.args>()

            const onChange = (value: DateRange | null) => {
                ctx.args.onChange?.(value)
                setArgs({ value })
            }

            return <Story args={{ ...ctx.args, onChange }} />
        },
    ],
} satisfies Meta<typeof DateRangeSelection>

export default meta
type Story = StoryObj<typeof DateRangeSelection>

export const Primary: Story = {}
