import { PipeTransform, Pipe } from '@angular/core';
import { Album } from './album';

@Pipe({
    name: 'albumFilter'
})
export class AlbumFilterPipe implements PipeTransform {

    transform(value: Album[], filterBy: string): Album[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((album: Album) =>
            album.Title.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
