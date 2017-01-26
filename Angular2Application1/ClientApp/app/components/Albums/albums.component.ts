import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AlbumsService } from '../services/albums.service';
import { Album } from './album';
import { Configuration } from '../services/config.service';
import { Paginated } from '../shared/paginated';

import { UtilityService } from '../services/utility.service';
import { OperationResult } from '../shared/operationResult';


@Component({
    selector: 'albums',
    template: require('./albums.component.html')
})

export class AlbumsComponent extends Paginated implements OnInit {
    private _albumsAPI: string = 'api/albums/';
    private _albums: Array<Album>;

    pageTitle: string = 'Photo Albums';
    albums: Album[];
    errorMessage: string;
    listFilter: string;

    displayRow: number = 0;


    clickMessage = '';

    Temp(idx) {
        this.displayRow = idx;
    }

    constructor(private _dataService: AlbumsService,
        private _settings: Configuration,
        public utilityService: UtilityService) {
        super(0, 0, 0);
    }

    ngOnInit() {
        this._dataService.set(this._albumsAPI, 50);
        this.getAlbums();
        //this.loadAlbums();
    }

    getAlbums(): void {
        this._dataService.get(this._page)
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

    loadAlbums() {
        this._dataService.getAlbums()
            .subscribe(albums => this.albums = albums,
                        error => this.errorMessage = <any>error);
    }

    onDelete(album: Album) {
        console.log('You are my hero!' + album.Title);
    }

    delete(album: Album) {
        var _removeResult: OperationResult = new OperationResult(false, '');

        
                this._dataService.deleteResource(this._albumsAPI + 'delete/' + album.Id)
                    .subscribe(res => {
                        _removeResult.Succeeded = res.Succeeded;
                        _removeResult.Message = res.Message;
                    },
                    error => console.error('Error: ' + error),
                    () => {
                        if (_removeResult.Succeeded) {
                            console.log(album.Title + ' removed from gallery.');
                            this.getAlbums();
                        }
                        else {
                            console.log('Failed to remove photo');
                        }
                    });
            
    }

    //loadAlbums() {
    //    this._dataService.getAlbums()
    //        .subscribe(
    //        data => {
    //            this.albums = data;
    //        });
    //}

    editableText = "Click to edit me!";

    // Save name to the server here.  
    saveEditable(value) {
        console.log(value);
    }

    array = ['bmw', 'benz', 'honda'];

    customTrackBy(index: number): any {
        return index;
    }


    onNotify(_savedAlbum: Album): void {
        console.log('this is the object passed from edit back to albums.component: ' + JSON.stringify(_savedAlbum));
    }

}
