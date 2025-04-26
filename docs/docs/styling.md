---
sidebar_position: 5
---

# Styling

Bookshelf aims to feel like a natural extension of Obsidian, mimicking its look and feel as closely as possible.
However, you might want to customize it and give it your own personal touch.
Obsidian allows you to add CSS snippets to modify it's appearance to your liking (see
the [CSS snippets documentation](https://help.obsidian.md/snippets) for more details).

Bookshelf comes with a
few [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)
to make this even easier.

For example, if you want the book cards in the gallery to have less padding and a more rounded look, you can use the
following snippet:

```css title=".obsidian/snippets/bookshelf.css"
body {
    --bookshelf--gallery-card--padding: 5px;
    --bookshelf--gallery-card--border-radius: 20px;
}
```

## Reference

### Library

| Variable                                   | Description       |
| ------------------------------------------ | ----------------- |
| `--bookshelf--library--header--background` | Header background |
| `--bookshelf--library--header--padding`    | Header padding    |

### Gallery

| Variable                                          | Description               |
| ------------------------------------------------- | ------------------------- |
| `--bookshelf--gallery-card--padding`              | Card padding              |
| `--bookshelf--gallery-card--border-radius`        | Card border radius        |
| `--bookshelf--gallery-card--background-color`     | Card background color     |
| `--bookshelf--gallery-card--shadow`               | Card shadow               |
| `--bookshelf--gallery-card--image--border-radius` | Cover image border radius |
