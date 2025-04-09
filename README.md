# Bookshelf

Your personal bookshelf in Obsidian. Access all your book notes in one place, track your reading progress, and gain
insights into your reading habits with beautiful charts.

![screenshots](resources/screenshots/screenshots.gif)

## Installation

- Go to "Settings" > "Community plugins" and make sure "Restricted mode" is turned off
- Search for "Bookshelf" in Obsidian's community plugins browser
- Install and enable the plugin
- Open the plugin settings to customize as needed

## How to use

### The Views

Bookshelf adds three views to Obsidian:

#### Library

The library view displays all books in your vault. You can search by title, sort, and filter by reading state. You can
also switch between gallery and table view.

To open the library, click the ![library icon](resources/docs/library-big.svg) icon in the ribbon or select "Open
library" from the command palette.

#### Statistics

The statistics view provides various metrics about the books you've read.

To open the statistics, click the ![statistics icon](resources/docs/chart-spline.svg) icon in the ribbon, or select
"Open statistics" from the command palette.

#### Book modal

The book modal displays details for a selected book and allows you to update the reading progress.

To open the book modal, click on any book in the library or statistics view. You can also use the "Open book modal"
command if the currently open note is a book note.

### Book Notes

Bookshelf collects book notes from the folder specified in the **Books folder** setting.
It currently processes the following metadata:

- Cover (property: `cover`)
- Author(s) (property: `author`)
- Publishing Date (property: `published`)
- Total number of pages (property: `pages`)
- Tags (property: `tags`)
- Rating (property: `rating`)
- Lists (property: `lists`)

If your book notes use different property names, you can customize them in the plugin's settings.

### Reading Progress

Bookshelf tracks your reading progress based on entries in your **book notes** and/or **daily notes**.
A reading progress entry consists of a date, a book, and a recorded action (such as starting, reading, or finishing a
book).

You can add reading progress entries manually by writing them in your notes, or use the form in the book details dialog
to add them more easily. The location for these entries can be configured in the settings.

By default, Bookshelf looks for reading progress entries under the "Reading Journey" heading in your book notes and
the "Reading" heading in your daily notes. You can change these headings in the settings to match your preferred note
structure.

You can track reading progress by entering a start and end position, or just an end position. Positions can be either
**page numbers** or **percentages** (e.g., `10-60%` or just `25%`).

- If only an end position is given, Bookshelf assumes the reading continued from the last recorded position.
- If no prior entry exists for the book, Bookshelf assumes reading started from page 1 or 0%, depending on the type of
  entry.

For example, if the first entry logs reading from pages 10 to 180, and the next entry specifies only page 290, Bookshelf
assumes you read from page 181 to 290.

Here's what entries in a book note look like using the default settings:

```markdown
## Reading Journey

- 2024-12-05: Started
- 2024-12-05: 10-180
- 2024-12-05: 290
- 2024-12-05: Finished
```

You don't have to specify the book in this case, because it's implied from the note.

Here's what entries in a daily note look like using the default settings:

```markdown
## Reading

- Finished [[Frankenstein]]
- Started [[Dracula]]
- Read [[Dracula]]: 1-130
- Read [[Dracula]]: 210
- Abandoned [[Dracula]]
```

You don't have to specify the date, because it's implied from the note.

### Customizing Reading Progress

You can customize the format of your reading progress entries in Bookshelf's settings to match your preferred style.
To do this, you have to build patterns using tokens that match the entries in your book notes and/or daily notes.

You may use the following tokens in your patterns. Each pattern setting denotes which tokens are supported.

- `{book}` WikiLink to the book
- `{date}` Date of the entry formatted according to **Date format** setting
- `{start}` The page you started reading on
- `{end}` The last page you read

Let's say reading progress entries in your daily notes look like this:

```markdown
- Read [[The Shining]] from page 12 to page 133
```

In this case, you should use the following pattern: `Read {book} from page {start} to page {end}`.
