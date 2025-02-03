export class Book {
    constructor(
        public title: string,
        public cover?: string,
        public authors?: Array<string>,
    ) {}
}
