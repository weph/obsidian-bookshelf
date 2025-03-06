import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { DateTime } from 'luxon'

const TAG_NAME = 'bookshelf-date-format-description'

@customElement(TAG_NAME)
export class DateFormatDescription extends LitElement {
    private formatReferenceUrl = 'https://moment.github.io/luxon/#/formatting?id=table-of-tokens'

    @property()
    public format: string = ''

    protected render() {
        return html`
            For more syntax, refer to
            <a href="${this.formatReferenceUrl}" target="_blank" rel="noopener">format reference</a>
            <br />Your current syntax looks like this: <strong>${DateTime.now().toFormat(this.format)}</strong>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: DateFormatDescription
    }
}
