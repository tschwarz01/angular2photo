import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public ApiServer: string = "http://localhost:7530/api/";
    public albumsApiUrl: string = "albums";
    public albumsServiceWithApiUrl: string = this.ApiServer + this.albumsApiUrl;
    public albumServiceWithApiUrl: string = this.ApiServer + 'album';
}