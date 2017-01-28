import { Http, Response, Request } from '@angular/http';
import { Injectable } from '@angular/core';
import { AlbumsService } from './albums.service';
import { Registration } from '../shared/registration';
import { User } from '../shared/user';
import { isBrowser } from 'angular2-universal';

declare var localStorage: any;

@Injectable()
export class MembershipService {

    private _accountRegisterAPI: string = 'api/account/register/';
    private _accountLoginAPI: string = 'api/account/authenticate/';
    private _accountLogoutAPI: string = 'api/account/logout/';


    constructor(public accountService: AlbumsService, http: Http) { }

    register(newUser: Registration) {

        this.accountService.set(this._accountRegisterAPI);

        return this.accountService.post(JSON.stringify(newUser));
    }

    login(creds: User) {
        this.accountService.set(this._accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds))
            .do(data => console.log('membership.service login function: ' + JSON.stringify(data)));
    }

    logout() {
        this.accountService.set(this._accountLogoutAPI);
        return this.accountService.post(null, false);
    }

    isUserAuthenticated(): boolean {
        var _user: any = localStorage.getItem('user');
        if (_user != null)
            return true;
        else
            return false;
    }

    getLoggedInUser(): User {
        var _user: User;

        if (this.isUserAuthenticated()) {
            var _userData = JSON.parse(localStorage.getItem('user'));
            _user = new User(_userData.Username, _userData.Password);
        }

        return _user;
    }

}