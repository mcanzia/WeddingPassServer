interface RichTextItem {
    text: string;
}

interface ValueText {
    richText: RichTextItem[];
}

interface ValueObject {
    text: ValueText;
}

export function isValueObject(value: any): value is ValueObject {
    return (
        value &&
        typeof value === 'object' &&
        'text' in value &&
        value.text &&
        'richText' in value.text &&
        Array.isArray(value.text.richText) &&
        value.text.richText.length > 0 &&
        'text' in value.text.richText[0] &&
        typeof value.text.richText[0].text === 'string'
    );
}