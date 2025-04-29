---
sidebar_position: 1
---

# Getting Started

## Installing the plugin

- Go to "Settings" > "Community plugins" and make sure "Restricted mode" is turned off
- Search for "Bookshelf" in Obsidian's community plugins browser
- Install and enable the plugin

## Accessing the views

Bookshelf adds three views to Obsidian:

- **Library**: Click the ![library icon](/img/library-big.svg) icon in the ribbon or select "**Open library**" from the
  command palette
- **Statistics**: Click the ![statistics icon](/img/chart-spline.svg) icon in the ribbon, or select
  "**Open statistics**" from the command palette
- **Book details**: Click on any book in the **library** or **statistics** view, or select "**Open book modal**" from
  the command palette

:::tip
To learn more about Bookshelf's views, see the [Views section](views.md).
:::

## Creating your first book note

By default, Bookshelf looks for your book notes in a folder named **Books** at the root of your vault.
If you already use a different folder, or you prefer a different name, you can change this in the plugin settings.

Any note created in the configured folder will automatically show up in the [Library view](views.md#library).

Here's an example of a fully annotated book note using all supported fields:

```markdown title="Books/Sunrise on the Reaping.md"
---
cover: 'https://upload.wikimedia.org/wikipedia/en/2/20/Sunrise_on_the_Reaping_book_cover.jpg'
author:
    - '[[Suzanne Collins]]'
published: 2025-03-18
tags:
    - young-adult
    - dystopian
    - science-fiction
    - fiction
rating: 3.5
pages: 400
lists:
    - 2025 Reads
    - Hunger Games
comment: Good, but not as riveting as the original series
---

# Sunrise on the Reaping
```

:::tip
You can find more examples in
the [demo vault](https://github.com/weph/obsidian-bookshelf/tree/main/resources/demo-vault).
To learn more about the properties and how to customize them, see the [Book Notes section](book-notes.mdx).
:::

## Tracking reading progress

If you checked the [Statistics view](views.md#statistics) after creating your first book note and saw that it was still
empty, it's because no reading progress has been tracked yet.

To get started, add a **Reading Journey** section to your book note like this:

```markdown title="Books/Sunrise on the Reaping.md"
---
(...)
---

# Sunrise on the Reaping

## Reading Journey

2025-04-01: Started
2025-04-01: Read 10-55
2025-04-02: Read 84
```

This means you started reading the book on April 1st, read pages 10 to 55 on the same day, and continued from page 56
to 84 on April 2nd.

:::tip
You can track reading progress in **book notes** and **daily notes**, and customize the format to you liking. For more
information, see the [Reading Progress section](reading-progress.md).
:::
