import { useId, useState } from 'react'
import { DateTime } from 'luxon'
import { Dropdown, DropdownOption } from '../dropdown/dropdown'
import { Input } from '../input/input'
import { Button } from '../button/button'
import { Book } from '../../bookshelf/book/book'
import { ReadingJourneyMatch } from '../../bookshelf/note-processing/note-processor'
import styles from './reading-journey-form.module.scss'
import { Position, position } from '../../bookshelf/reading-journey/position/position'

type Action = 'started' | 'finished' | 'abandoned' | 'progress'

function initialValues(book: Book): { action: Action; start: Position } {
    const lastItem = book.readingJourney.lastItem()

    switch (lastItem?.action) {
        case 'started':
            return { action: 'progress', start: position(1) }
        case 'progress':
            return { action: 'progress', start: lastItem.end.next(book) }
    }

    return { action: 'started', start: position(1) }
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

interface PositionState {
    inputValue: string
    positionValue: Position | null
    error: boolean
}

function initialPositionState(): PositionState {
    return { inputValue: '', positionValue: null, error: false }
}

function positionState(inputValue: string): PositionState {
    let positionValue = null
    let error = false
    try {
        positionValue = position(inputValue)
    } catch {
        error = true
    }

    return { inputValue, positionValue, error }
}

export function ReadingJourneyForm({ book, add }: Props) {
    const initial = initialValues(book)

    const [action, setAction] = useState<Action>(initial.action)
    const [date, setDate] = useState(DateTime.now().toISODate())
    const [start, setStart] = useState<PositionState>(initialPositionState())
    const [end, setEnd] = useState<PositionState>(initialPositionState())

    const startId = useId()
    const endId = useId()

    const handleAdd = async () => {
        const dateObject = DateTime.fromISO(date).toJSDate()

        switch (action) {
            case 'started':
            case 'abandoned':
            case 'finished':
                await add({ action: action, bookNote: book.note!, date: dateObject })
                break
            case 'progress':
                if (end.positionValue === null) {
                    throw new Error('Cannot add progress without end position')
                }

                await add({
                    action: action,
                    bookNote: book.note!,
                    date: dateObject,
                    start: start.positionValue,
                    end: end.positionValue,
                })
                break
        }

        setStart(initialPositionState())
        setEnd(initialPositionState())

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

    const handleStart = (inputValue: string) => {
        const state =
            inputValue.trim() === '' ? { inputValue, positionValue: null, error: false } : positionState(inputValue)

        setStart(state)
    }

    const handleEnd = (inputValue: string) => {
        setEnd(positionState(inputValue))
    }

    const valid = (): boolean => {
        switch (action) {
            case 'started':
            case 'finished':
            case 'abandoned':
                return DateTime.fromISO(date).isValid
            case 'progress':
                return DateTime.fromISO(date).isValid && !start.error && !end.error && end.positionValue !== null
        }
    }

    return (
        <div className={styles.readingJourneyForm}>
            <Input className={styles.date} type="date" placeholder="" value={date} onUpdate={setDate} />
            <Dropdown
                className={styles.action}
                label="Action"
                value={action}
                options={actions}
                onChange={(o) => setAction(o.value)}
            />
            {action === 'progress' && (
                <>
                    <label htmlFor={startId} className={styles.startLabel}>
                        From
                    </label>
                    <Input
                        id={startId}
                        className={styles.startInput}
                        type="text"
                        placeholder={initial.start.toString()}
                        value={start.inputValue}
                        error={start.error}
                        onUpdate={handleStart}
                    />
                    <label htmlFor={endId} className={styles.endLabel}>
                        to
                    </label>
                    <Input
                        id={endId}
                        className={styles.endInput}
                        type="text"
                        placeholder=""
                        value={end.inputValue}
                        error={end.error}
                        onUpdate={handleEnd}
                        autoFocus={true}
                    />
                </>
            )}
            <div className={styles.add}>
                <Button text="add" accent={true} onClick={() => handleAdd()} disabled={!valid()} />
            </div>
        </div>
    )
}
