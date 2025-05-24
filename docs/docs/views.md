---
sidebar_position: 2
---

# Views

Bookshelf adds three views to Obsidian:

## Library

![Library](/img/library.png)

The library view displays all books in your vault.
To learn more about what Bookshelf considers a book, see the [Book Notes section](book-notes.md).

To open the library, click the ![library icon](/img/library-big.svg) icon in the ribbon or select "Open
library" from the command palette.

At the top of the library view are several controls:

- **Search field** to search for books using a text query
- **List** to filter books by list (only visible if you're using lists)
- **Reading state filter** (Learn more about reading state on
  the [Reading Progress page](reading-progress.md#reading-state))
    - All books
    - Unread
    - Reading
    - Abandoned
    - Finished
- **Grouping** to group books by:
    - Alphabetically (starting letter)
    - List
    - Series
    - Author
    - Year (publication year)
    - Rating
- **Sort order** to sort books by different criteria and directions

You can also toggle between gallery and table view.

Bookshelf remembers changes you make to these controls as part of the workspace. If the library tab was open when you
closed Obsidian, it'll reopen in the same state.

:::tip
If you're using the Workspaces plugin to manage different layouts, each layout can have its own library configuration.
Just remember to save the layout after adjusting the controls. For more details, see
the [Workspaces plugin documentation](https://help.obsidian.md/plugins/workspaces).
:::

Clicking on a book opens the [Book Details Modal](views.md#book-details-modal). To open the book's note directly
instead, hold a modifier key while clicking (CMD on macOS, CTRL on Windows and Linux).

### Advanced Search

Each word you enter in the search field is matched independently. To search for an exact phrase, enclose it in quotes,
for example: "pet semetary". The search is also **case-insensitive**.

If you need more control, you can search within individual fields. For example, to find all books you've finished, that
have an author whose name includes "joe", that are on the list "Classics", and have a rating of at least 3.5, use:

`status:=finished author:joe list:=classics rating:>=3.5`

To find books you've read in 2024, try:

`date:>=2024-01-01 date:<=2024-12-31`

The general syntax is like this:

`<field name>:[<operator>]<value>`

The **operator is optional**. If no operator is given, the field is matched if it contains the value.

For example:

- `author:joe` matches `Joe Schmoe`, `Joey Schmoey`, and `Belle Joelle`
- `author:="Joe Schmoe"` only matches `Joe Schmoe`.

#### Fields

| Field    | Description                                |
| -------- | ------------------------------------------ |
| `author` | Author names                               |
| `list`   | List name                                  |
| `rating` | rating (numeric)                           |
| `series` | Book series                                |
| `status` | Reading status (e.g., reading, finished)   |
| `title`  | Book title                                 |
| `date`   | Reading progress date (format: YYYY-MM-DD) |

#### Operators

| Operator | Description           |
| -------- | --------------------- |
| `=`      | Matches exact values  |
| `>`      | Greater than          |
| `>=`     | Greater than or equal |
| `<`      | Less than             |
| `<=`     | Less than or equal    |

## Statistics

![Statistics](/img/statistics.png)

The statistics view provides various metrics about the books you've read.
To learn more about how you can track your reading progress using Bookshelf, take a look at
the [Reading Progress section](reading-progress.md)

To open the statistics, click the ![statistics icon](/img/chart-spline.svg) icon in the ribbon, or select
"Open statistics" from the command palette.

You can switch between viewing statistics for all time or for a specific year using the dropdown at the top of the view.

## Book Details Modal

![Book Details Modal](/img/book-details.png)

The book details modal shows detailed information for a selected book and allows you to update the reading progress.

To open the book modal, click on any book in the library or statistics view. You can also use the "Open book modal"
command if the currently open note is a book note.
