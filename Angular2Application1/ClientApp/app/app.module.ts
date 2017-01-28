import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UniversalModule } from "angular2-universal";
import { Headers, RequestOptions, BaseRequestOptions } from '@angular/http';

import { AccountModule } from "./components/Account/account.module";
import { AppComponent } from "./components/app/app.component";
import { HomeComponent } from "./components/home/home.component";
import { AlbumsComponent } from "./components/Albums/albums.component";
import { AlbumEditComponent } from "./components/Albums/album-edit.component";
import { AlbumFilterPipe } from "./components/Albums/album-filter.pipe";
import { AlbumPhotosComponent } from "./components/AlbumPhotos/album-photos.component";
import { PhotosComponent } from "./components/Photos/photos.component";

import { AlbumsService } from "./components/services/albums.service";
import { Configuration } from "./components/services/config.service";
import { UtilityService } from "./components/services/utility.service";
import { MembershipService } from "./components/services/membership.service";
import { NotificationService } from "./components/services/notification.service";

class AppBaseRequestOptions extends BaseRequestOptions {
    headers: Headers = new Headers();

    constructor() {
        super();
        this.headers.append('Content-Type', 'application/json');
        this.body = '';
    }
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HomeComponent,
        AlbumsComponent,
        AlbumEditComponent,
        AlbumFilterPipe,
        AlbumPhotosComponent,
        PhotosComponent,
    ],
    imports: [
        UniversalModule,
        RouterModule.forRoot([
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: HomeComponent },
            { path: "albums", component: AlbumsComponent },
            { path: "albums/:id/photos", component: AlbumPhotosComponent },
            { path: "photos", component: PhotosComponent },
            { path: "**", redirectTo: "home" }
        ]),
        ReactiveFormsModule,
        FormsModule,
        AccountModule,
    ],
    providers: [
        Configuration,
        AlbumsService,
        UtilityService,
        MembershipService,
        NotificationService,
        { provide: RequestOptions, useClass: AppBaseRequestOptions },
    ]
})
export class AppModule { }
