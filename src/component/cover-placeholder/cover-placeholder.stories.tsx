import type { Meta, StoryObj } from '@storybook/react'
import { CoverPlaceholder } from './cover-placeholder'

const meta = {
    title: 'UI/Cover Placeholder',
    component: CoverPlaceholder,
    args: {
        title: 'Animal Farm',
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: '300px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CoverPlaceholder>

export default meta
type Story = StoryObj<typeof CoverPlaceholder>

export const Primary: Story = {}
