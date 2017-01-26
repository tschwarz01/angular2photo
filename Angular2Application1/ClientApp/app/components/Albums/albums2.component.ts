import { Component, OnInit } from '@angular/core';
import { Album } from './album';
import { Paginated } from '../shared/paginated';
import { AlbumsService } from '../services/albums.service';
import { UtilityService } from '../services/utility.service';

@Component({
    selector: 'albums',
    template: require('./albums2.component.html')
})
export class AlbumsComponent2 extends Paginated implements OnInit {
    private _albumsAPI: string = 'api/albums/';
    private _albums: Array<Album>;

    constructor(public albumsService: AlbumsService,
        public utilityService: UtilityService) {
        super(0, 0, 0);
    }

    ngOnInit() {
        this.albumsService.set(this._albumsAPI, 3);
        this.getAlbums();
    }

    getAlbums(): void {
        this.albumsService.get(this._page)
            .subscribe(res => {
                var data: any = res.json();
                this._albums = data.Items;
                this._page = data.Page;
                this._pagesCount = data.TotalPages;
                this._totalCount = data.TotalCount;
            },
            error => {

                if (error.status == 401 || error.status == 404) {
                    console.log('Authentication required');
                    this.utilityService.navigateToSignIn();
                }
            });
    }

    search(i): void {
        super.search(i);
        this.getAlbums();
    };

    convertDateTime(date: Date) {
        return this.utilityService.convertDateTime(date);
    }

    onNotify(_savedAlbum: Album): void {
        console.log('this is the object passed from edit back to albums.component: ' + JSON.stringify(_savedAlbum));
    }
}