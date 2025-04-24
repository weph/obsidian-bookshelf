export class Version {
    constructor(
        public readonly major: number,
        public readonly minor: number,
        public readonly patch: number,
    ) {}

    public static fromString(input: string): Version {
        const result = input.match(/^(\d+)\.(\d+)\.(\d+)$/)
        if (result === null) {
            throw new Error(`Invalid version "${input}"`)
        }

        return new Version(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]))
    }

    public greaterThan(other: Version): boolean {
        return (
            this.major > other.major ||
            (this.major === other.major &&
                (this.minor > other.minor || (this.minor === other.minor && this.patch > other.patch)))
        )
    }

    public asString(): string {
        return `${this.major}.${this.minor}.${this.patch}`
    }
}
