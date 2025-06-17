export class DateRange {
    constructor(
        public readonly start: Date,
        public readonly end: Date,
    ) {}

    public static year(year: number): DateRange {
        return new DateRange(new Date(year, 0, 1), new Date(year, 11, 31))
    }

    public contains(date: Date): boolean {
        return date >= this.start && date <= this.end
    }
}
