export class Playtime {
    private constructor(private readonly playtimeInMinutes: number) {}

    public static fromString(input: string): Playtime {
        const matches = input.match(/^(\d+):(\d{2})$/)

        if (matches === null) {
            throw new Error(`Playtime "${input}" is not in format <hours>:<minutes>`)
        }

        return new Playtime(parseInt(matches[1]) * 60 + parseInt(matches[2]))
    }

    public static fromMinutes(playtimeInMinutes: number): Playtime {
        return new Playtime(playtimeInMinutes)
    }

    get hours(): number {
        return Math.floor(this.playtimeInMinutes / 60)
    }

    get minutes(): number {
        return this.playtimeInMinutes % 60
    }

    get inMinutes(): number {
        return this.playtimeInMinutes
    }

    public toString(format: 'compact' | 'verbose' = 'compact'): string {
        const hours = this.hours
        const minutes = this.minutes

        if (format === 'compact') {
            return `${hours}:${minutes.toString().padStart(2, '0')}`
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }

        return `${minutes}m`
    }
}
