import type { Preview } from '@storybook/react'
import './preview.css'
import moment from 'moment/moment'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
}

window.moment = moment

export default preview
