---
sidebar_position: 3
toc_max_heading_level: 4
---

# Book Notes

Bookshelf collects book notes from the folder specified in the **Books folder** setting.

## Book Title

Bookshelf takes the book title from the first level-one heading (`#`) in the note. If the first heading is a different
level (like `##` or `###`) or there's no heading at all, it will fall back to using the note's filename as the title.

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
