import { Bookshelf } from '../../bookshelf/bookshelf'
import { useSyncExternalStore } from 'react'
import { debounce } from 'radashi'

export function useSyncedData<T>(bookshelf: Bookshelf, data: (bookshelf: Bookshelf) => T): T {
    let result = data(bookshelf)

    return useSyncExternalStore(
        (callback) => {
            const subscriber = debounce({ delay: 100 }, () => {
                result = data(bookshelf)
                callback()
            })

            return bookshelf.subscribe(subscriber)
        },
        () => result,
    )
}
