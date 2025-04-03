# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

For a full diff see [`0.7.0...main`][0.7.0...main].

### Added

- Command to open the book modal. This command appears in the command palette only when a book note is open.

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
[0.2.2...0.3.0]: https://github.com/weph/obsidian-bookshelf/compare/0.2.2...0.3.0
[0.3.0...0.3.1]: https://github.com/weph/obsidian-bookshelf/compare/0.3.0...0.3.1
[0.3.1...0.4.0]: https://github.com/weph/obsidian-bookshelf/compare/0.3.1...0.4.0
[0.4.0...0.5.0]: https://github.com/weph/obsidian-bookshelf/compare/0.4.0...0.5.0
[0.5.0...0.6.0]: https://github.com/weph/obsidian-bookshelf/compare/0.5.0...0.6.0
[0.6.0...0.6.1]: https://github.com/weph/obsidian-bookshelf/compare/0.6.0...0.6.1
[0.6.1...0.7.0]: https://github.com/weph/obsidian-bookshelf/compare/0.6.1...0.7.0
[0.7.0...main]: https://github.com/weph/obsidian-bookshelf/compare/0.7.0...main
