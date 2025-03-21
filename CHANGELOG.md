# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

For a full diff see [`0.3.1...main`][0.3.1...main].

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

- Reflect changed settings immediately. No need to restart/reload Obisdian anymore.
- Updated documentation

### Changed

- Ignore reading journey entries referencing non-existing notes
- Migrated from Web Components to React

[0.3.0]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.3.0
[0.3.1]: https://github.com/weph/obsidian-bookshelf/releases/tag/0.3.1
[0.2.2...0.3.0]: https://github.com/weph/obsidian-bookshelf/compare/0.2.2...0.3.0
[0.3.0...0.3.1]: https://github.com/weph/obsidian-bookshelf/compare/0.3.0...0.3.1
[0.3.1...main]: https://github.com/weph/obsidian-bookshelf/compare/0.3.1...main
