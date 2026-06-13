import '@testing-library/jest-dom/vitest'
import moment from 'moment'
import { beforeEach, vi } from 'vitest'

// @ts-expect-error Weird definition mismatch after upgrading obsidian package. I should probably get rid of it altogether...
window.moment = moment
window.activeDocument = document

beforeEach(async () => {
    vi.resetAllMocks()

    window.activeDocument.body.innerHTML = ''
})
