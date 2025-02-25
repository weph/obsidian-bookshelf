# Obsidian Bookshelf

Your personal bookshelf in Obsidian. Access all your book notes in one place, track your reading progress, and gain
insights into your reading habits with beautiful charts.

![screenshots](resources/screenshots/screenshots.gif)

## Installation

- Go to "Settings" > "Community plugins" and make sure "Restricted mode" is turned off
- Search for "Bookshelf" in Obsidian's community plugins browser
- Install and enable the plugin
- Open the plugin settings to customize as needed

## How to use

### Book Notes

Bookshelf gathers book notes from the folder specified in **Books Folder**.
It currently processes the following metadata:

- Cover (property: `cover`)
- Author(s) (property: `author`)
- Publishing Date (property: `published`)
- Rating (property: `rating`)

If your book notes use different property names, you can customize them in the plugin's settings.

### Reading Progress

Bookshelf tracks your reading progress based on entries in your **book notes** and/or **daily notes**.
A reading progress entry includes a date, a book, and an action.

- For a book note, the book is implied.
- For a daily note, the date is implied.

You can specify the number of pages read by providing a start and end page, or just an end page.

- If only an end page is given, Bookshelf assumes the reading continued from the last recorded page.
- If no prior entry exists for the book, Bookshelf assumes reading started from page 1.

For example, If the first entry logs reading from pages 10 to 180, and the next entry specifies only page 290, Bookshelf
assumes you read from page 181 to 290.

You can customize the format of your reading progress entries in Bookshelf's settings to match your preferred style.

#### Book Note Example

```markdown
- 05/12/2024: Started
- 05/12/2024: 10-180
- 05/13/2024: 290
- 05/13/2024: Finished
```

#### Daily Note Example

```markdown
- Finished [[Frankenstein]]
- Started [[Dracula]]
- Read [[Dracula]]: 1-130
```
