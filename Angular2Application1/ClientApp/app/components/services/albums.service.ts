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

    public _pageSize: number;
    public _baseUri: string;
    _baseUrl: string = '';

    constructor(private http: Http,
        private _settings: Configuration) {

        this._baseUrl = _settings.getApiURI();
    }

    set(baseUri: string, pageSize?: number): void {
        this._baseUri = baseUri;
        this._pageSize = pageSize;
    }

    get(page: number) {
        var uri = this._baseUri + page.toString() + '/' + this._pageSize.toString();

        return this.http.get(uri)
            .map(response => (<Response>response));
    }



    public getAlbums(): Observable<Album[]> {
        return this.http.get(this._settings.albumsServiceWithApiUrl + '/GetAll')
        //return this.http.get(this._settings.albumsServiceWithApiUrl + '/')
            .map((response: Response) => <Album[]>response.json())
            .do(data => console.log('getAlbums All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    };

    //getAlbum(id: number): Observable<Album> {
    //    return this.getAlbums()
    //        .map((albums: Album[]) => albums.find(a => a.Id === id))
    //        .catch(this.handleError);
    //}

    getAlbum(id: number): Observable<Album> {
        return this.http.get(this._settings.albumServiceWithApiUrl + id)
            .map((response: Response) => <Album>response.json())
            .do(data => console.log('get album (single): ' +JSON.stringify(data)))
            .catch(this.handleError);
    }

    updateAlbum(album: any) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(album);

        return this.http
            .put(`${this._settings.albumsServiceWithApiUrl}/${album.id}`, body, options)
            //.map((res: Response) => res.json())
            .catch(this.handleError);
    }

    deleteResource(resource: string) {
        return this.http.delete(resource)
            .map(response => <any>(<Response>response).json())
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    post(data?: any, mapJson: boolean = true) {
        if (mapJson)
            return this.http.post(this._baseUri, data)
                .map(response => <any>(<Response>response).json());
        else
            return this.http.post(this._baseUri, data);
    }
    
}