export class Subscribers {
    private subscribers: Array<() => void> = []

    /**
     * @returns Function to unsubscribe
     */
    public add(subscriber: () => void): () => void {
        this.subscribers.push(subscriber)

        return () => {
            this.subscribers = this.subscribers.filter((s) => s !== subscriber)
        }
    }

    public notify(): void {
        this.subscribers.forEach((subscriber) => subscriber())
    }
}
