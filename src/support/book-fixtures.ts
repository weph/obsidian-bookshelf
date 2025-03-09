import { BookBuilder } from './book-builder'

export const algorithms = new BookBuilder()
    .with('title', 'Algorithms')
    .with('cover', '/covers/algorithms.jpg')
    .with('authors', ['Robert Sedgewick'])
    .with('published', new Date(1983, 0, 1))
    .build()

export const continuousDelivery = new BookBuilder()
    .with('title', 'Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation')
    .with('cover', '/covers/continuous-delivery.jpg')
    .with('authors', ['Jez Humble', 'David Farley'])
    .with('published', new Date(2010, 6, 27))
    .build()

export const codeThatFitsYourHead = new BookBuilder()
    .with('title', 'Code That Fits in Your Head: Heuristics for Software Engineering')
    .with('cover', '/covers/code-that-fits-in-your-head.jpg')
    .with('authors', ['Mark Seemann'])
    .with('published', new Date(2021, 10, 15))
    .build()

export const designPatterns = new BookBuilder()
    .with('title', 'Design Patterns: Elements of Reusable Object-Oriented Software')
    .with('cover', '/covers/design-patterns.jpg')
    .with('authors', ['Erich Gamma', 'Grady Booch', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'])
    .with('published', new Date(1994, 0, 1))
    .with('tags', ['dev', 'patterns'])
    .build()

export const ddd = new BookBuilder()
    .with('title', 'Domain-Driven Design: Tackling Complexity in the Heart of Software')
    .with('cover', '/covers/domain-driven-design.jpg')
    .with('authors', ['Eric Evans'])
    .with('published', new Date(2003, 7, 20))
    .with('tags', ['dev', 'ddd'])
    .build()

export const extremeProgramming = new BookBuilder()
    .with('title', 'Extreme Programming Explained')
    .with('cover', '/covers/extreme-programming-explained.jpg')
    .with('authors', ['Kent Beck', 'Cynthia Andres'])
    .with('published', new Date(1999, 9, 5))
    .build()

export const goos = new BookBuilder()
    .with('title', 'Growing Object-Oriented Software, Guided by Tests')
    .with('cover', '/covers/growing-object-oriented-software.jpg')
    .with('authors', ['Steve Freeman', 'Nat Pryce'])
    .with('published', new Date(2009, 9, 1))
    .with('tags', ['dev', 'tdd', 'testing'])
    .build()

export const iddd = new BookBuilder()
    .with('title', 'Implementing Domain-driven Design')
    .with('cover', '/covers/implementing-domain-driven-design.jpg')
    .with('authors', ['Vaughn Vernon'])
    .with('published', new Date(2013, 0, 1))
    .with('tags', ['dev', 'ddd', 'hands-on'])
    .build()

export const blackBook = new BookBuilder()
    .with('title', "Michael Abrash's Graphics Programming Black Book")
    .with('cover', '/covers/graphics-programming-black-book.jpg')
    .with('authors', ['Michael Abrash'])
    .with('published', new Date(1997, 6, 1))
    .build()

export const refactoring = new BookBuilder()
    .with('title', 'Refactoring')
    .with('cover', '/covers/refactoring.jpg')
    .with('authors', ['Martin Fowler'])
    .with('published', new Date(1999, 0, 1))
    .build()

export const tddByExample = new BookBuilder()
    .with('title', 'Test-Driven Development by Example')
    .with('cover', '/covers/test-driven-development-by-example.jpg')
    .with('authors', ['Kent Beck'])
    .with('published', new Date(2002, 0, 1))
    .with('tags', ['dev', 'tdd', 'testing', 'hands-on'])
    .with('rating', 5)
    .withReadingProgress(new Date(2025, 0, 1), 1, 10)
    .withReadingProgress(new Date(2025, 0, 2), 11, 50)
    .withReadingProgress(new Date(2025, 0, 3), 51, 100)
    .withReadingProgress(new Date(2025, 0, 4), 101, 120)
    .withReadingProgress(new Date(2025, 0, 5), 121, 190)
    .withReadingProgress(new Date(2025, 0, 6), 191, 220)
    .build()

export const mythicalManMonth = new BookBuilder()
    .with('title', 'The Mythical Man-Month')
    .with('cover', '/covers/the-mythical-man-month.jpg')
    .with('authors', ['Frederick P. Brooks Jr.'])
    .with('published', new Date(1975, 0, 1))
    .build()

export const pragmaticProgrammer = new BookBuilder()
    .with('title', 'The Pragmatic Programmer')
    .with('cover', '/covers/the-pragmatic-programmer.jpg')
    .with('authors', ['Andrew Hunt', 'David Thomas'])
    .with('published', new Date(1999, 9, 1))
    .build()

export const legacyCode = new BookBuilder()
    .with('title', 'Working Effectively with Legacy Code')
    .with('cover', '/covers/working-effectively-with-legacy-code.jpg')
    .with('authors', ['Michael C. Feathers'])
    .with('published', new Date(2004, 8, 1))
    .build()

export const books = {
    algorithms,
    continuousDelivery,
    codeThatFitsYourHead,
    designPatterns,
    ddd,
    extremeProgramming,
    goos,
    iddd,
    blackBook,
    refactoring,
    tddByExample,
    mythicalManMonth,
    pragmaticProgrammer,
    legacyCode,
}
