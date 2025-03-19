import { DateTime } from 'luxon'

interface Props {
    format: string
}

const formatReferenceUrl = 'https://moment.github.io/luxon/#/formatting?id=table-of-tokens'

export function DateFormatDescription({ format }: Props) {
    return (
        <>
            For more syntax, refer to
            <a href={formatReferenceUrl} target="_blank" rel="noopener">
                format reference
            </a>
            <br />
            Your current syntax looks like this: <strong>{DateTime.now().toFormat(format)}</strong>
        </>
    )
}
