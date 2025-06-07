import { ItemView, Plugin, TFile, WorkspaceLeaf } from 'obsidian'
import '../../obsidian/obsidian-note.integration-test'
import '../../obsidian/obsidian-notes.integration-test'
import { TestContext, TestResult, TestSuite, testSuite } from './integration-test'
import { createRoot } from 'react-dom/client'

const VIEW_TYPE_TEST_RUNNER = 'TestRunner'

class TestRunnerView extends ItemView {
    constructor(
        leaf: WorkspaceLeaf,
        private testSuite: TestSuite,
        private context: TestContext,
    ) {
        super(leaf)
    }

    getViewType(): string {
        return VIEW_TYPE_TEST_RUNNER
    }

    getDisplayText(): string {
        return 'Test Runner'
    }

    protected override async onOpen(): Promise<void> {
        const results = await this.testSuite.run(this.context)

        createRoot(this.containerEl.children[1]).render(this.html(results))
    }

    private html(testResult: TestResult) {
        return (
            <>
                <div className="test-output">{this.testResultHtml(testResult)}</div>
                <style>{`
                .test-output {
                    font-family: monospace;
                    background-color: #282a36;
                    padding: 1.25rem;
                    line-height: 1.5rem;
                }
    
                .test-result.passed > .test-name {
                    color: #50fa7b;
                }
    
                .test-result.failed > .test-name,
                .test-result.failed > .error {
                    color: #ff5555;
                }

                .test-result .error {
                    padding-left: 1.25rem;
                    font-family: monospace;
                    white-space: pre;
                }
            `}</style>
            </>
        )
    }

    private testResultHtml(testResult: TestResult) {
        return (
            <div className={'test-result ' + testResult.result}>
                <div className="test-name">
                    {testResult.name} ({testResult.durationInMs}ms)
                </div>
                <div className="error">{testResult.error}</div>
                <div className="children">
                    <ul>
                        {(testResult.children || []).map((child, i) => (
                            <li key={i}>{this.testResultHtml(child)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default class IntegrationTestPlugin extends Plugin {
    private pluginName = 'integration-test'

    private updatedFiles = new Set<string>()

    public override async onload() {
        this.registerView(
            VIEW_TYPE_TEST_RUNNER,
            (leaf) =>
                new TestRunnerView(leaf, testSuite, {
                    app: this.app,
                    file: this.file.bind(this),
                    createFile: this.createFile.bind(this),
                    updateFile: this.updateFile.bind(this),
                    deleteFile: this.deleteFile.bind(this),
                    waitForUpdate: this.waitForUpdate.bind(this),
                }),
        )

        this.app.workspace.onLayoutReady(() => this.activateView(VIEW_TYPE_TEST_RUNNER))
        this.registerEvent(this.app.metadataCache.on('changed', (file) => this.updatedFiles.add(file.path)))
        this.registerEvent(this.app.vault.on('modify', (file) => this.updatedFiles.add(file.path)))

        this.registerEvent(
            // @ts-expect-error raw event is not exposed
            this.app.vault.on('raw', async (file: string) => {
                if (file !== `.obsidian/plugins/${this.pluginName}/main.js`) {
                    return
                }

                // @ts-expect-error plugins is not exposed
                const plugins = this.app.plugins

                if (plugins.enabledPlugins.has(this.pluginName)) {
                    await plugins.disablePlugin(this.pluginName)
                }

                await plugins.enablePlugin(this.pluginName)
            }),
        )
    }

    private file(name: string): TFile {
        const file = this.app.vault.getFileByPath(name)

        if (file === null) {
            throw new Error(`File ${file} does not exist`)
        }

        return file
    }

    private async createFile(name: string, content: string): Promise<TFile> {
        this.updatedFiles.delete(name)

        const file = await this.app.vault.create(name, content)

        await this.waitForFileUpdate(name)

        return file
    }

    private async updateFile(name: string, content: string): Promise<void> {
        this.updatedFiles.delete(name)
        this.app.vault.modify(this.file(name), content)
        await this.waitForFileUpdate(name)
    }

    private async deleteFile(name: string): Promise<void> {
        const file = this.app.vault.getFileByPath(name)
        if (file === null) {
            return
        }

        await this.app.vault.delete(file)
    }

    private async waitForUpdate(name: string): Promise<void> {
        this.updatedFiles.delete(name)
        await this.waitForFileUpdate(name)
    }

    private async waitForFileUpdate(name: string): Promise<void> {
        const timeout = 10

        let iterations = 0
        while (!this.updatedFiles.has(name)) {
            if (++iterations >= 100) {
                throw new Error(`File has not been updated in ${iterations * timeout}ms`)
            }

            await new Promise((fn) => setTimeout(fn, timeout))
        }
    }

    private async activateView(viewType: string): Promise<void> {
        const { workspace } = this.app

        const leaves = workspace.getLeavesOfType(viewType)
        if (leaves.length > 0) {
            await workspace.revealLeaf(leaves[0])
            return
        }

        const leaf = workspace.getLeaf('tab')
        await leaf.setViewState({ type: viewType, active: true })
        await workspace.revealLeaf(leaf)
    }
}
