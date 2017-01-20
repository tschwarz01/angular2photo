import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { HelloWorldComponent } from './components/HelloWorld/helloworld.component';
import { WeatherComponent } from './components/weather/weather.component';
import { AlbumsComponent } from './components/Albums/albums.component';
import { AlbumEditComponent } from './components/Albums/album-edit.component';

import { AlbumsService } from './components/services/albums.service';
import { Configuration } from './components/services/config.service';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        HelloWorldComponent,
        WeatherComponent,
        AlbumsComponent,
        AlbumEditComponent,
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'hello', component: HelloWorldComponent },
            { path: 'weather', component: WeatherComponent },
            { path: 'albums', component: AlbumsComponent },
            { path: 'album/:id', component: AlbumEditComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        Configuration,
        AlbumsService
    ]
})
export class AppModule {
}
