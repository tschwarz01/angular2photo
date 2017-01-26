import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { HelloWorldComponent } from './components/HelloWorld/helloworld.component';
import { WeatherComponent } from './components/weather/weather.component';
import { AlbumsComponent } from './components/Albums/albums.component';
import { AlbumsComponent2 } from './components/Albums/albums2.component';
import { AlbumEditComponent } from './components/Albums/album-edit.component';
import { InlineEditComponent } from './components/shared/inline-edit.component';
import { AlbumFilterPipe } from './components/Albums/album-filter.pipe';

import { AlbumsService } from './components/services/albums.service';
import { Configuration } from './components/services/config.service';
import { UtilityService } from './components/services/utility.service';
import { MembershipService } from './components/services/membership.service';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        HelloWorldComponent,
        WeatherComponent,
        AlbumsComponent,
        AlbumsComponent2,
        AlbumEditComponent,
        InlineEditComponent,
        AlbumFilterPipe,
    ],
    imports: [
        UniversalModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'hello', component: HelloWorldComponent },
            { path: 'weather', component: WeatherComponent },
            { path: 'albums2', component: AlbumsComponent },
            { path: 'albums', component: AlbumsComponent2 },
            
            { path: 'album/:id', component: AlbumEditComponent },
            { path: '**', redirectTo: 'home' }
        ]),
        ReactiveFormsModule,
        FormsModule,
    ],
    providers: [
        Configuration,
        AlbumsService,
        UtilityService,
        MembershipService,
    ]
})
export class AppModule { }
