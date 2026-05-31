import { BookshelfBasesView } from './bookshelf-bases-view'
import { Gallery } from '../../component/library/gallery/gallery'

export const GalleryViewType = 'bookshelf-gallery'

export class GalleryView extends BookshelfBasesView {
    readonly type = GalleryViewType
    override viewComponent = Gallery
}
