import { FrontmatterLinkCache } from 'obsidian'

export type PropertyValue = string | number | boolean | FrontmatterLinkCache

export interface Metadata {
    set(property: string, value: PropertyValue | Array<PropertyValue> | null): Promise<void>

    value(property: string): PropertyValue | Array<PropertyValue> | null
}

export class StaticMetadata implements Metadata {
    constructor(private metadata: { [key: string]: PropertyValue | Array<PropertyValue> | null }) {}

    public async set(property: string, value: PropertyValue | Array<PropertyValue> | null): Promise<void> {
        this.metadata[property] = value
    }

    public value(property: string): PropertyValue | Array<PropertyValue> | null {
        return this.metadata[property] || null
    }
}
