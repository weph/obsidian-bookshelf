import { CachedMetadata, FrontmatterLinkCache } from 'obsidian'

export type PropertyValue = string | number | boolean | FrontmatterLinkCache

export interface Metadata {
    value(property: string): PropertyValue | Array<PropertyValue> | null
}

export class ObsidianMetadata implements Metadata {
    private links = new Map<string, FrontmatterLinkCache>()

    constructor(private metadata: CachedMetadata) {
        for (const link of metadata.frontmatterLinks || []) {
            this.links.set(link.key, link)
        }
    }

    public value(property: string): PropertyValue | Array<PropertyValue> | null {
        const value = this.metadata.frontmatter?.[property] || null

        if (Array.isArray(value)) {
            return value.map((v, i) => this.links.get(`${property}.${i}`) || v)
        }

        return this.links.get(property) || value
    }
}

export class StaticMetadata implements Metadata {
    constructor(private metadata: { [key: string]: PropertyValue | Array<PropertyValue> }) {}

    public value(property: string): PropertyValue | Array<PropertyValue> | null {
        return this.metadata[property] || null
    }
}
