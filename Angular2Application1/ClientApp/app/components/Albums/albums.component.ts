import { Component, OnInit } from '@angular/core';

import { Album } from './album';

import { Paginated } from '../shared/paginated';
import { OperationResult } from '../shared/operationResult';

import { AlbumsService } from '../services/albums.service';
import { UtilityService } from '../services/utility.service';
import { NotificationService } from '../services/notification.service';


@Component({
    selector: 'albums',
    template: require('./albums.component.html')
})
export class AlbumsComponent extends Paginated implements OnInit {
    private _albumsAPI: string = 'api/albums/';
    private _albums: Array<Album>;

    pageTitle: string = 'Photo Albums';
    errorMessage: string;

    constructor(public albumsService: AlbumsService,
                public utilityService: UtilityService,
                public notificationService: NotificationService) {
                super(0, 0, 0);
    }

    ngOnInit() {
        this.albumsService.set(this._albumsAPI, 50);
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

    albumDelete(album: Album) {
        var _removeResult: OperationResult = new OperationResult(false, '');

        this.notificationService.printConfirmationDialog('Are you sure you want to delete the album?',
            () => {
                this.albumsService.deleteResource(this._albumsAPI + 'delete/' + album.Id)
                    .subscribe(res => {
                        _removeResult.Succeeded = res.Succeeded;
                        _removeResult.Message = res.Message;
                    },
                    error => console.error('Error: ' + error),
                    () => {
                        if (_removeResult.Succeeded) {
                            this.notificationService.printSuccessMessage(album.Title + ' removed from gallery.');
                            console.log(album.Title + ' removed from gallery.');
                            this.getAlbums();
                        }
                        else {
                            this.notificationService.printErrorMessage('Failed to delete photo');
                            console.log('Failed to remove photo');
                        }
                    });
            });
    }

    // Update Album 
    albumUpdate(_savedAlbum: Album): void {
        this.albumsService.updateAlbum(_savedAlbum).subscribe(
            data => {
                console.log('this is the object passed from edit back to albums.component: ' + JSON.stringify(_savedAlbum));
                this.getAlbums();
            },
            error => {
                console.error("Error saving changes");
            }
        );        
    }
}