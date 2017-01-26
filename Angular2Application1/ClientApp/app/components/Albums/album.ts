export class Album {
    Id: number;
    Title: string;
    SafeName: string;
    Description: string;
    Thumbnail: string;
    DateCreated: Date;
    TotalPhotos: number;

    constructor(id: number,
        title: string,
        safeName: string,
        description: string,
        thumbnail: string,
        dateCreated: Date,
        totalPhotos: number) {
        this.Id = id;
        this.Title = title;
        this.SafeName = safeName;
        this.Description = description;
        this.Thumbnail = thumbnail;
        this.DateCreated = dateCreated;
        this.TotalPhotos = totalPhotos;
    }
}