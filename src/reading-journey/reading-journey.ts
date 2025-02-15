import { ReadingJourneyItem } from './reading-journey-log'

export class ReadingJourney {
    constructor(private _items: Array<ReadingJourneyItem>) {}

    public items(): Array<ReadingJourneyItem> {
        return this._items
    }

    public filter(predicate: (value: ReadingJourneyItem) => boolean): ReadingJourney {
        return new ReadingJourney(this._items.filter(predicate))
    }

    public map<T>(callback: (item: ReadingJourneyItem) => T): Array<T> {
        return this._items.map(callback)
    }
}
