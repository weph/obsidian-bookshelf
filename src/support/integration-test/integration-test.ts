import { App, TFile } from 'obsidian'

export interface TestContext {
    app: App

    file(name: string): TFile

    createFile(name: string, content: string): Promise<TFile>

    updateFile(name: string, content: string): Promise<void>

    deleteFile(name: string): Promise<void>
}

type TestFunction = (context: TestContext) => void | Promise<void>

export interface TestResult {
    name: string
    result: 'passed' | 'failed'
    error?: string
    children?: Array<TestResult>
    durationInMs: number
}

interface TestCollection {
    add: (item: TestCollection) => void
    run: (context: TestContext) => Promise<TestResult>
}

class SingleTest implements TestCollection {
    constructor(
        private readonly name: string,
        private readonly fn: TestFunction,
    ) {}

    add(): void {
        throw new Error(`You cannot add elements to a single test`)
    }

    async run(context: TestContext): Promise<TestResult> {
        const start = new Date().getMilliseconds()

        try {
            await this.fn(context)

            return {
                name: this.name,
                result: 'passed',
                durationInMs: new Date().getMilliseconds() - start,
            }
        } catch (error) {
            return {
                name: this.name,
                result: 'failed',
                error: error.message,
                durationInMs: new Date().getMilliseconds() - start,
            }
        }
    }
}

export class TestSuite implements TestCollection {
    public tests: Array<TestCollection> = []

    public beforeAll: TestFunction = () => {}

    public afterAll: TestFunction = () => {}

    public beforeEach: TestFunction = () => {}

    public afterEach: TestFunction = () => {}

    constructor(public readonly name: string) {}

    add(item: TestCollection): void {
        this.tests.push(item)
    }

    async run(context: TestContext): Promise<TestResult> {
        const start = new Date().getMilliseconds()
        const children: Array<TestResult> = []

        await this.beforeAll(context)

        for (const test of this.tests) {
            await this.beforeEach(context)

            children.push(await test.run(context))

            await this.afterEach(context)
        }

        await this.afterAll(context)

        return {
            name: this.name,
            result: children.every((c) => c.result === 'passed') ? 'passed' : 'failed',
            children,
            durationInMs: new Date().getMilliseconds() - start,
        }
    }
}

const testSuite = new TestSuite('Integration Tests')
let current = testSuite

function test(name: string, fn: TestFunction) {
    current.add(new SingleTest(name, fn))
}

function describe(name: string, fn: () => void) {
    const previous = current
    current = new TestSuite(name)
    previous.add(current)
    fn()
    current = previous
}

function beforeAll(fn: TestFunction) {
    current.beforeAll = fn
}

function afterAll(fn: TestFunction) {
    current.afterAll = fn
}

function beforeEach(fn: TestFunction) {
    current.beforeEach = fn
}

function afterEach(fn: TestFunction) {
    current.afterEach = fn
}

export { testSuite, beforeAll, afterAll, beforeEach, afterEach, describe, test }
