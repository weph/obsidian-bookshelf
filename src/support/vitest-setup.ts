import '@testing-library/jest-dom/vitest'
import moment from 'moment'
import { beforeEach, vi } from 'vitest'

window.moment = moment
window.activeDocument = document

beforeEach(async () => {
    vi.resetAllMocks()

    window.activeDocument.body.innerHTML = ''
})
