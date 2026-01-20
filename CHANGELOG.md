# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

For a full diff see [`0.18.0...main`][0.18.0...main].

### Changed

- Show books in reading streak tooltip

## [`0.18.0`][0.18.0] - 2025-08-20

For a full diff see [`0.17.0...0.18.0`][0.17.0...0.18.0].

### Added

- Add option to sort books by note creation date
- Add reading streak chart to statistics

### Changed

- Sort lists alphabetically in the library dropdown ([#38](https://github.com/weph/obsidian-bookshelf/issues/38))

## [`0.17.0`][0.17.0] - 2025-07-14

For a full diff see [`0.16.1...0.17.0`][0.16.1...0.17.0].

### Added

- Track remaining progress when marking a book as finished ([#31](https://github.com/weph/obsidian-bookshelf/issues/31))
  When you mark a book as finished in the book details modal, Bookshelf can now automatically log the remaining
  progress. If you prefer to track it manually, that option is still available. Thanks to
  [@VanWolfing](https://github.com/VanWolfing) for the suggestion!
- Support for custom date ranges in the statistics view ([#16](https://github.com/weph/obsidian-bookshelf/issues/16))
  You can now filter your reading statistics using any date range you like.

## [`0.16.1`][0.16.1] - 2025-06-27

For a full diff see [`0.16.0...0.16.1`][0.16.0...0.16.1].

### Fixed

- Prevent reading section from being added multiple times ([#35](https://github.com/weph/obsidian-bookshelf/issues/35))
  This happened when a note's metadata wasn't yet available when adding reading progress. Bookshelf now waits for it
  to become available.

## [`0.16.0`][0.16.0] - 2025-06-10

For a full diff see [`0.15.0...0.16.0`][0.15.0...0.16.0].

### Added

- Track listening progress of audiobooks ([#9](https://github.com/weph/obsidian-bookshelf/issues/9))\
  You can now track your audiobook listening progress. Bookshelf can also convert listening time into the equivalent
  number of pages. See
  the [Tracking Progress](https://weph.github.io/obsidian-bookshelf/docs/reading-progress#tracking-progress) section in
  the documentation for details.

### Fixed

- Hide "pages read" in book details view when the number couldn't be determined

## [`0.15.0`][0.15.0] - 2025-05-24

For a full diff see [`0.14.0...0.15.0`][0.14.0...0.15.0].

### Added

- Advanced search ([#19](https://github.com/weph/obsidian-bookshelf/issues/19))\
  You can now search within individual fields using operators like `=`, `>=`, and `<=`. For details and examples,
  see the [Advanced Search](https://weph.github.io/obsidian-bookshelf/docs/views#advanced-search) section in the
  documentation.

### Changed

- Prefer note heading as book title ([#25](https://github.com/weph/obsidian-bookshelf/issues/25))\
  A book's title is now taken from the first level-one heading in the note. If the first heading in the note is a
  different level or there's no heading at all, Bookshelf falls back to using the note's filename as before.
- Improve fallback group titles\
  When grouping books by a certain criterion in the library, the fallback group now has a more descriptive title instead
  of just "N/A". The title is also displayed in italics to help distinguish it from regular group titles.

### Fixed

- Books without an author were not displayed when grouping by author
- Books without a rating were incorrectly grouped with books rated 0

## [`0.14.0`][0.14.0] - 2025-05-05

For a full diff see [`0.13.1...0.14.0`][0.13.1...0.14.0].

### Added

- Track reading progress using Roman numerals ([#10](https://github.com/weph/obsidian-bookshelf/issues/10))\
  Want to track every page, including those front matter sections? You can now enter Roman numerals to log your progress
  more precisely.
- Add button to clear search input\
  You can now clear the search term by using the familiar "x" icon in the search field.
- Add support for book series ([#14](https://github.com/weph/obsidian-bookshelf/issues/14))\
  You can now add book series information (series name and position in series). The book details modal displays this
  info, and you can group, sort, and search by series.

### Changed

- Extended search\
  The search field now also matches against author names and book series.

### Fixed

- Always show number of pages read\
  The number of pages read is now correctly shown in the book details modal when tracking progress using page numbers.
  Previously, it was only shown if the total number of pages was known. This makes sense for percentage-based tracking,
  but not when using actual page numbers.

## [`0.13.1`][0.13.1] - 2025-04-30

For a full diff see [`0.13.0...0.13.1`][0.13.0...0.13.1].

### Fixed

- Properly initialize library settings after upgrade ([#24](https://github.com/weph/obsidian-bookshelf/issues/24))\
  Upgrading from 0.12.0 to 0.13.0 caused the Library to appear empty until users manually pressed the "Reset" button.
  This is now fixed.

## [`0.13.0`][0.13.0] - 2025-04-29

For a full diff see [`0.12.0...0.13.0`][0.12.0...0.13.0].

### Added

- Remember library settings ([#11](https://github.com/weph/obsidian-bookshelf/issues/11))\
  Bookshelf now remembers your library settings (search term, list, grouping, sort, and view mode) as part of the
  workspace. If the library tab was open when you closed Obsidian, it'll reopen in the same state.
- Documentation for styling Bookshelf\
  There's a [new section in the documentation](https://weph.github.io/obsidian-bookshelf/docs/styling) listing the
  available CSS variables for easier tweaking of Bookshelf's appearance. There aren't many yet, but more are on the way.
- Make authors clickable in book details modal\
  If an author is entered as a WikiLink in the metadata, it will now appear as a clickable link in the book details
  modal.
- Add support for links to external websites or notes ([#21](https://github.com/weph/obsidian-bookshelf/issues/21))\
  You can now add links to external websites or notes within your vault to a book. They'll be displayed as clickable
  links in the book details modal. Thanks to [@TechnoMaverick](https://github.com/TechnoMaverick) for the suggestion!

### Changed

- Tweaked gallery card appearance ([#20](https://github.com/weph/obsidian-bookshelf/issues/20))\
  Cards now look a little tighter. Thanks again [@soundslikeinfo](https://github.com/soundslikeinfo) for the suggestion!

### Fixed

- Made daily note detection more robust ([#22](https://github.com/weph/obsidian-bookshelf/issues/22))

## [`0.12.0`][0.12.0] - 2025-04-24

For a full diff see [`0.11.0...0.12.0`][0.11.0...0.12.0].

### Added

- Release notes dialog\
  After each update, a dialog will now appear showing you what's new, improved, or fixed. Don’t want the interruption?
  You can turn it off in the settings.
- Open book note directly from gallery/table view ([#8](https://github.com/weph/obsidian-bookshelf/issues/8))\
  You can now open a book's note directly by holding a modifier key while clicking a book in the gallery or table view
  (CMD on macOS, CTRL on Windows and Linux). Thanks to [@soundslikeinfo](https://github.com/soundslikeinfo) for the
  suggestion!
- Allow filtering books in the library by list ([#7](https://github.com/weph/obsidian-bookshelf/issues/7))\
  The list filter will only appear if you're using lists.
- Show number of books in library ([#12](https://github.com/weph/obsidian-bookshelf/issues/12))\
  The total number of books is now displayed at the top of the library. When searching or applying filters, you'll see
  both the number of matching books and the total. If books are grouped, the count for each group will also be shown.
- Support Daily Notes via Periodic Notes plugin ([#18](https://github.com/weph/obsidian-bookshelf/issues/18))\
  Bookshelf now also supports Daily Notes via the Periodic Notes plugin.

### Fixed

- The library view now correctly displays a "no results" message when no books match the active filters or search query

## [`0.11.0`][0.11.0] - 2025-04-15

For a full diff see [`0.10.0...0.11.0`][0.10.0...0.11.0].

### Added

- Custom icon to library and statistics tab ✨
- Property for personal comment
- Number of pages read per item in book details modal

### Fixed

- Books weren't removed when notes were moved to a different folder

## [`0.10.0`][0.10.0] - 2025-04-11

For a full diff see [`0.9.0...0.10.0`][0.9.0...0.10.0].

### Changed

- Improved library navigation on mobile

### Fixed

- Fixed some styles for RTL languages
- X-axis of pages read bar chart was reset when re-rendered

## [`0.9.0`][0.9.0] - 2025-04-09

For a full diff see [`0.8.0...0.9.0`][0.8.0...0.9.0].

### Added

- Support for tracking reading progress using percentages
- Ability to add books to multiple lists
- Grouping of books in library view in alphabetical order, by list, author, year, and rating

### Fixed

- Sorting by reading progress

## [`0.8.0`][0.8.0] - 2025-04-03

For a full diff see [`0.7.0...0.8.0`][0.7.0...0.8.0].

### Added

- Command to open the book modal. This command appears in the command palette only when a book note is open.

### Changed

- Change visual representation of tags in table view to match Obsidian's style
- Automatically focus search field in library view

### Fixed

- Trim settings to prevent unintended spaces from slipping through

## [`0.7.0`][0.7.0] - 2025-04-02

For a full diff see [`0.6.1...0.7.0`][0.6.1...0.7.0].

### Added

- Added form to enter reading progress directly in the book details modal
- Added option to sort books by reading progress
- Added pages to book metadata and views

### Changed

- Removed 'year' option from pages read bar chart when a year is selected
- Streamlined book details modal

## [`0.6.1`][0.6.1] - 2025-03-30

For a full diff see [`0.6.0...0.6.1`][0.6.0...0.6.1].

### Fixed

- Fixed book modal rendering: title was missing and the modal looked broken on mobile

## [`0.6.0`][0.6.0] - 2025-03-28

For a full diff see [`0.5.0...0.6.0`][0.5.0...0.6.0].

### Added

- Added commands to open the library and statistics views.

### Changed

- Update book modal on external file changes

## [`0.5.0`][0.5.0] - 2025-03-25

For a full diff see [`0.4.0...0.5.0`][0.4.0...0.5.0].

### Changed

- Skip daily note processing if daily notes plugin is disabled
- Allow user to disable daily note processing in plugin settings
- Allow user to disable book note reading journey processing in plugin settings
- Remove book and reading journey items when note is deleted
- Replaced tag pie chart with tag cloud

### Fixed

- Books/stats were gone after updating or temporarily disabling the plugin

## [`0.4.0`][0.4.0] - 2025-03-21

For a full diff see [`0.3.1...0.4.0`][0.3.1...0.4.0].

### Changed

- Extracted creation of bookshelf instance to a factory

### Removed

- Removed support for wildcard placeholders (`{*}`) in patterns

## [`0.3.1`][0.3.1] - 2025-03-20

For a full diff see [`0.3.0...0.3.1`][0.3.0...0.3.1].

### Fixed

- Colors in tag pie chart were gone after rerender

## [`0.3.0`][0.3.0] - 2025-03-20

For a full diff see [`0.2.2...0.3.0`][0.2.2...0.3.0].

### Added

- Reflect changed settings immediately. No need to restart/reload Obsidian anymore.
- Updated documentation

### Changed

- Ignore reading journey entries referencing non-existing notes
- Migrated from Web Components to React

[0.3.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.3.0
[0.3.1]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.3.1
[0.4.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.4.0
[0.5.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.5.0
[0.6.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.6.0
[0.6.1]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.6.1
[0.7.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.7.0
[0.8.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.8.0
[0.9.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.9.0
[0.10.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.10.0
[0.11.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.11.0
[0.12.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.12.0
[0.13.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.13.0
[0.13.1]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.13.1
[0.14.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.14.0
[0.15.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.15.0
[0.16.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.16.0
[0.16.1]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.16.1
[0.17.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.17.0
[0.18.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.18.0
[0.2.2...0.3.0]: https://github.com/weph/obsidian-bookshelf/compare/0.2.2...0.3.0
[0.3.0...0.3.1]: https://github.com/weph/obsidian-bookshelf/compare/0.3.0...0.3.1
[0.3.1...0.4.0]: https://github.com/weph/obsidian-bookshelf/compare/0.3.1...0.4.0
[0.4.0...0.5.0]: https://github.com/weph/obsidian-bookshelf/compare/0.4.0...0.5.0
[0.5.0...0.6.0]: https://github.com/weph/obsidian-bookshelf/compare/0.5.0...0.6.0
[0.6.0...0.6.1]: https://github.com/weph/obsidian-bookshelf/compare/0.6.0...0.6.1
[0.6.1...0.7.0]: https://github.com/weph/obsidian-bookshelf/compare/0.6.1...0.7.0
[0.7.0...0.8.0]: https://github.com/weph/obsidian-bookshelf/compare/0.7.0...0.8.0
[0.8.0...0.9.0]: https://github.com/weph/obsidian-bookshelf/compare/0.8.0...0.9.0
[0.9.0...0.10.0]: https://github.com/weph/obsidian-bookshelf/compare/0.9.0...0.10.0
[0.10.0...0.11.0]: https://github.com/weph/obsidian-bookshelf/compare/0.10.0...0.11.0
[0.11.0...0.12.0]: https://github.com/weph/obsidian-bookshelf/compare/0.11.0...0.12.0
[0.12.0...0.13.0]: https://github.com/weph/obsidian-bookshelf/compare/0.12.0...0.13.0
[0.13.0...0.13.1]: https://github.com/weph/obsidian-bookshelf/compare/0.13.0...0.13.1
[0.13.1...0.14.0]: https://github.com/weph/obsidian-bookshelf/compare/0.13.1...0.14.0
[0.14.0...0.15.0]: https://github.com/weph/obsidian-bookshelf/compare/0.14.0...0.15.0
[0.15.0...0.16.0]: https://github.com/weph/obsidian-bookshelf/compare/0.15.0...0.16.0
[0.16.0...0.16.1]: https://github.com/weph/obsidian-bookshelf/compare/0.16.0...0.16.1
[0.16.1...0.17.0]: https://github.com/weph/obsidian-bookshelf/compare/0.16.1...0.17.0
[0.17.0...0.18.0]: https://github.com/weph/obsidian-bookshelf/compare/0.17.0...0.18.0
[0.18.0...main]: https://github.com/weph/obsidian-bookshelf/compare/0.18.0...main
