import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AlbumsService } from '../services/albums.service';
import { Album } from './album';
import { Configuration } from '../services/config.service';


@Component({
    selector: 'albums',
    template: require('./albums.component.html')
})

export class AlbumsComponent implements OnInit {
    pageTitle: string = 'Page Title';
    albums: Album[];
    errorMessage: string;

    constructor(private _dataService: AlbumsService,
                private _settings: Configuration) {
    }

    ngOnInit() {
        this.loadAlbums()
    }

    loadAlbums() {
        this._dataService.getAlbums()
            .subscribe(albums => this.albums = albums,
                        error => this.errorMessage = <any>error);
    }

    //loadAlbums() {
    //    this._dataService.getAlbums()
    //        .subscribe(
    //        data => {
    //            this.albums = data;
    //        });
    //}
}
