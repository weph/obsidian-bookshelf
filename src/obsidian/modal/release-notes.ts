export const releaseNotes = {
    '0.16.1': `
### Fixed

- Prevent reading section from being added multiple times ([#35](https://github.com/weph/obsidian-bookshelf/issues/35))\\
  This happened when a note's metadata wasn't yet available when adding reading progress. Bookshelf now waits for it to become available.
`,
    '0.16.0': `
### Added

- Track listening progress of audiobooks ([#9](https://github.com/weph/obsidian-bookshelf/issues/9))\\
  You can now track your audiobook listening progress. Bookshelf can also convert listening time into the equivalent number of pages. See the [Tracking Progress](https://weph.github.io/obsidian-bookshelf/docs/reading-progress#tracking-progress) section in the documentation for details.

### Fixed

- Hide "pages read" in book details view when the number couldn't be determined
`,
    '0.15.0': `
### Added

- Advanced search ([#19](https://github.com/weph/obsidian-bookshelf/issues/19))\\
  You can now search within individual fields using operators like \`=\`, \`>=\`, and \`<=\`. For details and examples, see the [Advanced Search](https://weph.github.io/obsidian-bookshelf/docs/views#advanced-search) section in the documentation.

### Changed

- Prefer note heading as book title ([#25](https://github.com/weph/obsidian-bookshelf/issues/25))\\
  A book's title is now taken from the first level-one heading in the note. If the first heading in the note is a different level or there's no heading at all, Bookshelf falls back to using the note's filename as before.
- Improve fallback group titles\\
  When grouping books by a certain criterion in the library, the fallback group now has a more descriptive title instead of just "N/A". The title is also displayed in italics to help distinguish it from regular group titles.

### Fixed

- Books without an author were not displayed when grouping by author
- Books without a rating were incorrectly grouped with books rated 0
`,
    '0.14.0': `
### Added

- **Track reading progress using Roman numerals** ([#10](https://github.com/weph/obsidian-bookshelf/issues/10))\\
  Want to track every page, including those front matter sections? You can now enter Roman numerals to log your progress more precisely.
- **Add button to clear search input**\\
  You can now clear the search term by using the familiar "x" icon in the search field.
- **Add support for book series** ([#14](https://github.com/weph/obsidian-bookshelf/issues/14))\\
  You can now add book series information (series name and position in series). The book details modal displays this info, and you can group, sort, and search by series.

### Changed

- **Extended search**\\
  The search field now also matches against author names and book series.

### Fixed

- **Always show number of pages read**\\
  The number of pages read is now correctly shown in the book details modal when tracking progress using page numbers. Previously, it was only shown if the total number of pages was known. This makes sense for percentage-based tracking, but not when using actual page numbers.
`,
    '0.13.1': `
### Fixed

- **Properly initialize library settings after upgrade** ([#24](https://github.com/weph/obsidian-bookshelf/issues/24))\\
  Upgrading from 0.12.0 to 0.13.0 caused the Library to appear empty until users manually pressed the "Reset" button. This is now fixed.
`,
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
