import { ReadingJourney } from '../../bookshelf/reading-journey/reading-journey'
import { useId, useState } from 'react'
import { DateTime } from 'luxon'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { Input } from '../input/input'
import { Button } from '../button/button'
import { Book } from '../../bookshelf/book'
import { ReadingJourneyMatch } from '../../bookshelf/note-processing/note-processor'
import styles from './reading-journey-form.module.scss'

type Action = 'started' | 'finished' | 'abandoned' | 'progress'

function initialValues(bookJourney: ReadingJourney): { action: Action; page: number } {
    const lastItem = bookJourney.lastItem()

    switch (lastItem?.action) {
        case 'started':
            return { action: 'progress', page: 1 }
        case 'progress':
            return { action: 'progress', page: lastItem.endPage + 1 }
    }

    return { action: 'started', page: 1 }
}

const actions: Array<DropdownOption<Action>> = [
    { value: 'progress', label: 'Read' },
    { value: 'started', label: 'Started' },
    { value: 'abandoned', label: 'Abandoned' },
    { value: 'finished', label: 'Finished' },
]

interface Props {
    book: Book
    add: (item: ReadingJourneyMatch) => Promise<void>
}

export function ReadingJourneyForm({ book, add }: Props) {
    const initial = initialValues(book.readingJourney)

    const [action, setAction] = useState<Action>(initial.action)
    const [date, setDate] = useState(DateTime.now().toISODate())
    const [start, setStart] = useState<string>('')
    const [end, setEnd] = useState<string>('')

    const startId = useId()
    const endId = useId()

    const handleAdd = async () => {
        await add({
            action: action,
            bookNote: book.note!,
            date: DateTime.fromISO(date).toJSDate(),
            startPage: start === '' ? null : parseInt(start),
            endPage: parseInt(end),
        })

        setStart('')
        setEnd('')

        switch (action) {
            case 'started':
            case 'progress':
                setAction('progress')
                break
            case 'finished':
            case 'abandoned':
                setAction('started')
                break
        }
    }

    const valid = (): boolean => {
        switch (action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return DateTime.fromISO(date).isValid
            case 'progress':
                return DateTime.fromISO(date).isValid && !Number.isNaN(parseInt(end))
        }
    }

    return (
        <div className={styles.readingJourneyForm}>
            <Input className={styles.date} type="date" placeholder="" value={date} onUpdate={setDate} />
            <Dropdown className={styles.action} label="Action" value={action} options={actions} onChange={setAction} />
            {action === 'progress' && (
                <>
                    <label htmlFor={startId} className={styles.startLabel}>
                        From page
                    </label>
                    <Input
                        id={startId}
                        className={styles.startInput}
                        type="number"
                        placeholder={initial.page.toString()}
                        value={start}
                        onUpdate={setStart}
                    />
                    <label htmlFor={endId} className={styles.endLabel}>
                        to
                    </label>
                    <Input
                        id={endId}
                        className={styles.endInput}
                        type="number"
                        placeholder=""
                        value={end}
                        onUpdate={setEnd}
                        autoFocus={true}
                    />
                </>
            )}
            <div className={styles.add}>
                <Button text="add" onClick={() => handleAdd()} disabled={!valid()} />
            </div>
        </div>
    )
}
