export class Photo {
    Id: number;
    Title: string;
    Uri: string;
    AzureUri: string;
    AlbumId: number;
    AlbumTitle: string;
    DateUploaded: Date

    constructor(id: number,
        title: string,
        uri: string,
        azureUri: string,
        albumId: number,
        albumTitle: string,
        dateUploaded: Date) {
        this.Id = id;
        this.Title = title;
        this.Uri = uri;
        this.AzureUri = azureUri;
        this.AlbumId = albumId;
        this.AlbumTitle = albumTitle;
        this.DateUploaded = dateUploaded;
    }
}