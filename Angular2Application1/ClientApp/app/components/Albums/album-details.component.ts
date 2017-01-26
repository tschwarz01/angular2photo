import { Component, OnInit, Input } from '@angular/core';
import { Album } from './album';

@Component({
    selector: 'album-details',
    template: require('album-details.component.html')
})
export class AlbumDetailsComponent implements OnInit {

    @Input()
    album: Album;

    constructor() { }

    ngOnInit() {
    }

    onSubmit({ value, valid }: { value: Album, valid: boolean }) {
        console.log(value, valid);
    }

}