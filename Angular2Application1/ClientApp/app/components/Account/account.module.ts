import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlbumsService } from '../services/albums.service';
import { MembershipService } from '../services/membership.service';
import { NotificationService } from '../services/notification.service';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            { path: 'account/register', component: RegisterComponent },
            { path: 'account/login', component: LoginComponent },
        ]),
    ],
    declarations: [
        LoginComponent,
        RegisterComponent
    ],

    providers: [
        AlbumsService,
        MembershipService,
        NotificationService
    ]
})
export class AccountModule { }