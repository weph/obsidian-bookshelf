export const releaseNotes = {
    '0.13.0': `
### Added

- **Remember library settings** ([#11](https://github.com/weph/obsidian-bookshelf/issues/11))\\
  Bookshelf now remembers your library settings (search term, list, grouping, sort, and view mode) as part of the workspace. If the library tab was open when you closed Obsidian, it'll reopen in the same state.
- **Documentation for styling Bookshelf**\\
  There's a [new section in the documentation](https://weph.github.io/obsidian-bookshelf/docs/styling) listing the available CSS variables for easier tweaking of Bookshelf's appearance. There aren't many yet, but more are on the way.
- **Make authors clickable in book details modal**\\
  If an author is entered as a WikiLink in the metadata, it will now appear as a clickable link in the book details modal.
- **Add support for links to external websites or notes** ([#21](https://github.com/weph/obsidian-bookshelf/issues/21))\\
  You can now add links to external websites or notes within your vault to a book. They'll be displayed as clickable links in the book details modal. Thanks to [@TechnoMaverick](https://github.com/TechnoMaverick) for the suggestion!

### Changed

- **Tweaked gallery card appearance** ([#20](https://github.com/weph/obsidian-bookshelf/issues/20))\\
  Cards now look a little tighter. Thanks again [@soundslikeinfo](https://github.com/soundslikeinfo) for the suggestion!

### Fixed

- Made daily note detection more robust ([#22](https://github.com/weph/obsidian-bookshelf/issues/22))
`,
    '0.12.0': `
### Added

- **Release notes dialog**\\
  After each update, a dialog will now appear showing you what's new, improved, or fixed. Don’t want the interruption? You can turn it off in the settings.
- **Open book note directly from gallery/table view** ([#8](https://github.com/weph/obsidian-bookshelf/issues/8))\\
  You can now open a book's note directly by holding a modifier key while clicking a book in the gallery or table view (CMD on macOS, CTRL on Windows and Linux). Thanks to [@soundslikeinfo](https://github.com/soundslikeinfo) for the suggestion!
- **Allow filtering books in the library by list** ([#7](https://github.com/weph/obsidian-bookshelf/issues/7))\\
  The list filter will only appear if you're using lists.
- **Show number of books in library** ([#12](https://github.com/weph/obsidian-bookshelf/issues/12))\\
  The total number of books is now displayed at the top of the library. When searching or applying filters, you'll see both the number of matching books and the total. If books are grouped, the count for each group will also be shown.
- **Support Daily Notes via Periodic Notes plugin** ([#18](https://github.com/weph/obsidian-bookshelf/issues/18))\\
  Bookshelf now also supports Daily Notes via the Periodic Notes plugin.

### Fixed

- The library view now correctly displays a "no results" message when no books match the active filters or search query
`,
}
