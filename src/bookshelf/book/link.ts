import { Reference } from 'obsidian'

type LinkType = 'internal' | 'external'

export class Link {
    public constructor(
        public readonly type: LinkType,
        public readonly target: string,
        public readonly displayText: string,
        public readonly original: string,
    ) {}

    public static from(input: string | Reference): Link {
        if (typeof input === 'object') {
            return new Link('internal', input.link, input.displayText || input.link, input.original)
        }

        const url = new URL(input)
        const displayValue = url.host.replace(/.+\.([^.]+\.)/, '$1')

        return new Link('external', input, displayValue, input)
    }
}
