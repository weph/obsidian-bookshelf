import { ItemView, ViewStateResult, WorkspaceLeaf } from 'obsidian'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Bookshelf } from '../../bookshelf/bookshelf'
import { bookSortOptions } from '../../component/library/book-sort-options'
import { initialSettings, Library, Settings } from '../../component/library/library'
import BookshelfPlugin from '../bookshelf-plugin'
import { useSyncedData } from '../../component/hooks/use-synced-data'
import { Book } from '../../bookshelf/book/book'
import { ExpressionFactory } from '../../bookshelf/book/search/expression-factory'
import { parser } from '../../bookshelf/book/search/parser'

export const VIEW_TYPE_LIBRARY = 'library'

export class LibraryView extends ItemView {
    public icon = 'library-big'

    private root: Root

    private settings: Settings = initialSettings

    constructor(
        leaf: WorkspaceLeaf,
        private bookshelfPlugin: BookshelfPlugin,
        private bookshelf: Bookshelf,
    ) {
        super(leaf)

        this.root = createRoot(this.contentEl)
    }

    public getViewType(): string {
        return VIEW_TYPE_LIBRARY
    }

    public getDisplayText(): string {
        return 'Bookshelf library'
    }

    public async setState(state: Partial<Settings>, result: ViewStateResult): Promise<void> {
        this.settings = {
            search: state.search || initialSettings.search,
            list: state.list || initialSettings.list,
            status: state.status || initialSettings.status,
            grouping: state.grouping || initialSettings.grouping,
            sort: state.sort || initialSettings.sort,
            view: state.view || initialSettings.view,
        }

        this.render()

        return super.setState(state, result)
    }

    public getState(): Record<string, unknown> {
        return { ...this.settings }
    }

    protected async onOpen(): Promise<void> {
        this.render()
    }

    private render(): void {
        this.root.render(
            <StrictMode>
                <SyncedLibrary
                    initialSettings={this.settings}
                    settingsChanged={(settings) => {
                        this.settings = settings
                        this.app.workspace.requestSaveLayout()
                    }}
                    bookshelf={this.bookshelf}
                    onBookClick={this.bookshelfPlugin.handleBookClick.bind(this.bookshelfPlugin)}
                />
            </StrictMode>,
        )
    }
}

function SyncedLibrary({
    initialSettings,
    settingsChanged,
    bookshelf,
    onBookClick,
}: {
    initialSettings: Settings
    settingsChanged: (settings: Settings) => void
    bookshelf: Bookshelf
    onBookClick: (book: Book) => void
}) {
    const [settings, setSettings] = useState<Settings>(initialSettings)
    const books = useSyncedData(bookshelf, (b) => b.all())

    useEffect(() => setSettings(initialSettings), [initialSettings])

    return (
        <Library
            settings={settings}
            settingsChanged={(settings) => {
                setSettings(settings)
                settingsChanged(settings)
            }}
            books={books}
            sortOptions={bookSortOptions}
            onBookClick={onBookClick}
            expressionFactory={new ExpressionFactory(parser())}
        />
    )
}
