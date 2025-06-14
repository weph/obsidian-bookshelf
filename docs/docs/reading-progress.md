---
sidebar_position: 4
---

# Reading Progress

Bookshelf tracks your reading progress based on entries in your **book notes** and/or **daily notes**.
A reading progress entry consists of a date, a book, and a recorded action (such as starting, reading, or finishing a
book).

You can add reading progress entries manually by writing them in your notes, or use the form in the **book details
dialog**
to add them more easily. The location for these entries can be configured in the settings.

By default, Bookshelf looks for reading progress entries under the "Reading Journey" heading in your book notes and
the "Reading" heading in your daily notes. You can change these headings in the settings to match your preferred note
structure.

## Reading State

Bookshelf keeps track of the following reading states:

- unread
- reading
- finished
- abandoned

You can transition between these states by making **started**, **finished**, and **abandoned** entries.
The latest state will be used to determine the current reading state of a book.
If a book has no entries, it is considered unread.

## Tracking Progress

You can track reading progress by entering a start and end position, or just an end position. Positions can be:

- **Page numbers** (`30`)
- **Percentages** (`25%`)
- **Roman numerals** (`xviii`)
- **Time** (`2:34`)

If you're using percentages, make sure to set the [total number of pages property](book-notes#total-number-of-pages) in
the book note. This allows Bookshelf to convert percentages to page numbers in the statistics.

Bookshelf can also convert audiobook listening time into an equivalent number of pages. To enable this, make sure to set
both the [total number of pages property](book-notes#total-number-of-pages) and
the [audiobook duration property](book-notes.md#audiobook-duration).

Bookshelf makes a few assumptions when interpreting progress entries:

- If only an end position is given, it assumes you continued from the last recorded position.
- If the last recorded position was a Roman numeral and the current one is a page number, it assumes you moved from the
  front matter into the main part (starting at page 1).
- If there's no prior entry, it assumes you started at page 1, 0%, or 0:00, depending on whether the entry is a page
  number, percentage, or time.

**Example**

```
- 2024-12-05: x-xv  <- explicit start and end in Roman numerals
- 2024-12-06: xxx   <- implicit start at xvi from previous entry
- 2024-12-07: 15    <- implicit start at page 1 (transition from front matter)
- 2024-12-08: 76    <- implicit start at page 16 from previous entry
```

## Book Notes

Here's what entries in a book note look like using the default settings:

```markdown title="Books/Frankenstein.md"
## Reading Journey

- 2024-12-05: Started
- 2024-12-05: 10-180
- 2024-12-05: 290
- 2024-12-05: Finished
```

You don't have to specify the book in this case, because it's implied from the note.

## Daily Notes

Here's what entries in a daily note look like using the default settings:

```markdown title="Daily Notes/2024-12-05.md"
## Reading

- Finished [[Frankenstein]]
- Started [[Dracula]]
- Read [[Dracula]]: 1-130
- Read [[Dracula]]: 210
- Abandoned [[Dracula]]
```

You don't have to specify the date, because it's implied from the note.

## Customizing Reading Progress

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
