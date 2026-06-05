---
sidebar_position: 5
toc_max_heading_level: 4
---

# Book Notes

Bookshelf collects book notes from the folder specified in the **Books folder** setting.

## Book Title

Bookshelf resolves a note's title using the following priority list:

1. **Title property**: if a title property is present in the note's frontmatter, its value is used.
2. **First heading**: the first heading in the note, regardless of level (`#`, `##`, …).
3. **Filename**: the file name if the note contains no headings.

The explicit title property always wins over the fallbacks.\
You can rename this property in the **Book note properties** settings if you prefer a different name.

## Properties

You can add more information to your book notes by using properties.

:::info
If you're not familiar with the concept of properties in Obsidian, check out
[Obsidian's documentation](https://help.obsidian.md/properties).
:::

### Property Names

Rather than forcing you to use specific property names, Bookshelf allows you to configure them to your liking.
You don't have to use every or even any property if you don't need them.
However, Bookshelf's views may look a little bland without any additional information beyond the title.

### Property Types

Obsidian supports various property types, and each property in Bookshelf works best with a specific one.
Bookshelf tries to interpret your data even if you use a different type, but it's no wizard.
Sticking to the suggested types ensures the best results.

### Supported Properties

#### Title

**Property type:** Text\
**Default name:** `title`

The book title.

#### Cover

**Property type:** Text\
**Default name:** `cover`

The book's cover. This can be a URL (e.g. `https://book.test/book-cover.jpg`) or
a [Link to a file](https://help.obsidian.md/links#Link+to+a+file) inside your vault (e.g. `[[book-cover.jpg]]`)

#### Authors

**Property type:** List\
**Default name:** `author`

Name or names of the author. You can use a text field if only want to keep track of a single author, or a list of
multiple authors. If you maintain author notes inside your vault, you can
use [WikiLinks][WikiLink].

#### Publishing Date

**Property type:** Date\
**Default name:** `published`

The date the book was published.

#### Total number of pages

**Property type:** Number\
**Default name:** `pages`

The total number of pages in the book. If you track your reading progress using percentages, this value is used
to calculate how many pages you've read.

#### Audiobook duration

**Property type:** Text\
**Default name:** `duration`

The total playtime of an audiobook. Use the format `H:MM` (e.g., `5:30` for 5 hours and 30 minutes).

#### Tags

**Property type:** Tags\
**Default name:** `tags`

Tags you've assigned to the book.

#### Genre

**Property type:** List\
**Default name:** `genre`

Genre(s) you've assigned to the book.

#### Rating

**Property type:** Number\
**Default name:** `rating`

Your rating of the book.
Displayed as stars in Bookshelf's views.
You can use any positive number, including decimals (e.g. `3.5`, `4.1`).
Negative numbers are not supported.

#### Lists

**Property type:** List\
**Default name:** `lists`

Lists are another dimension in Bookshelf to organize your books.
You can assign a book to one or more lists (e.g. "Favorites", "Sci-Fi Classics").
To group books by lists in the [Library](views.md#library), select **List** from the grouping dropdown.

#### Comment

**Property type:** Text\
**Default name:** `comment`

A personal comment on that book.
This is shown in the [Book Details Modal](views.md#book-details-modal) and can be your opinion, a summary, or any other
note that helps you recall key information at a glance.

#### Links

**Property type:** List\
**Default name:** `links`

A list of links to external websites (e.g., `https://books.test/dracula`) or related notes within your vault
(`[[Dracula (Reading Notes)]]`). These links will appear in the [Book Details Modal](views.md#book-details-modal).

#### Series

**Property type:** Text\
**Default name:** `series`

The name of the book series this title belongs to. You can use a plain string or a [WikiLink][WikiLink] if you have a
dedicated note for the series.

#### Series Position

**Property type:** Number\
**Default name:** `position-in-series`

The book's position within its series. For example, enter 1 for the first book, 2 for the second, and so on.

[WikiLink]: https://help.obsidian.md/links#Supported+formats+for+internal+links
