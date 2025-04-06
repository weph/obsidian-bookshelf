import { isEmpty } from 'radashi'
import * as version20250402 from './bookshelf-settings-version-20250402'
import * as version20250406 from './bookshelf-settings-version-20250406'

const versions = [version20250402, version20250406]

export interface VersionedSettings {
    settingsVersion?: number
}

export function migratedSettings(settings: VersionedSettings): VersionedSettings {
    if (isEmpty(settings)) {
        return settings
    }

    for (const version of versions) {
        const currentVersion = settings.settingsVersion || 0

        if (currentVersion > version.VERSION) {
            continue
        }

        settings = version.migratedSettings(settings)
    }

    return settings
}
