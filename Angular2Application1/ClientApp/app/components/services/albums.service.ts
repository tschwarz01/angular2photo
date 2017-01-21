import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";

import { Album } from '../Albums/album';
import { Configuration } from '../services/config.service';

@Injectable()
export class AlbumsService {

    constructor(private _http: Http,
        private _settings: Configuration) {
    }

    public getAlbums(): Observable<Album[]> {
        return this._http.get(this._settings.albumsServiceWithApiUrl + '/GetAll')
            .map((response: Response) => <Album[]>response.json())
            .do(data => console.log('getAlbums All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    };

    getAlbum(id: number): Observable<Album> {
        return this.getAlbums()
            .map((albums: Album[]) => albums.find(a => a.Id === id))
            .catch(this.handleError);
    }

    updateAlbum(album: any) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(album);

        return this._http
            .put(`${this._settings.albumsServiceWithApiUrl}/${album.id}`, body, options)
            //.map((res: Response) => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}