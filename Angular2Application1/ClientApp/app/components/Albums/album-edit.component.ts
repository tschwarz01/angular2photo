import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";

import { AlbumsService } from '../services/albums.service';
import { Album } from './album';

@Component({
    selector: 'album-edit',
    template: require('./album-edit.component.html')
})

export class AlbumEditComponent implements OnInit {
    pageTitle: string = 'Product Detail';
    //albums: Observable<Album>;
    albums: Album;
    _albumId: number;
    errorMessage: string;
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _albumService: AlbumsService) {        
    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getAlbum(id);
                console.log('this is the album id within ngOnInit in album-edit ' + id);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getAlbum(id: number) {
        this._albumService.getAlbum(id).subscribe(
            albums => this.albums = albums,
            error => this.errorMessage = <any>error);
    }

    onBack(): void {
        this._router.navigate(['/albums']);
    }
}