import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";

import { AlbumsService } from '../services/albums.service';
import { Configuration } from '../services/config.service';
import { Album } from './album';

@Component({
    selector: 'album-edit',
    template: require('./album-edit.component.html')
})

export class AlbumEditComponent implements OnInit {
    pageTitle: string = 'Album Details';
    albumFG: FormGroup;
    albums: Album;
    _albumId: number;
    errorMessage: string;
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _albumService: AlbumsService,
        private _settings: Configuration,
        private fb: FormBuilder) {        
    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = +params['id'];
                this._albumId = id;
                this.getAlbum(id);
                //console.log('this is the album id within ngOnInit in album-edit ' + id);
            });

        this.albumFG = this.fb.group({
            id: [this._albumId],
            title: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.required, Validators.minLength(10)]]
        });
    };

    onSubmit({ value, valid }: { value: Album, valid: boolean }) {
        console.log(value, valid);

        this._albumService.updateAlbum(value).subscribe(
            data => {
                this._router.navigate(['albums']);
            },
            error => {
                console.error("Error saving changes");
                return Observable.throw(error);
            }
        );
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