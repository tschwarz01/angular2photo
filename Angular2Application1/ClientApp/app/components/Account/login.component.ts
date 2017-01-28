import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/user';
import { OperationResult } from '../shared/operationResult';
import { MembershipService } from '../services/membership.service';
import { NotificationService } from '../services/notification.service';

@Component({
    template: require('./login.component.html')
})
export class LoginComponent implements OnInit {
    private _user: User;
    private _opResult: OperationResult;

    constructor(public membershipService: MembershipService,
        public notificationService: NotificationService,
        public router: Router) { }

    ngOnInit() {
        this._user = new User('', '');
    }

    login(): void {
        var _authenticationResult: OperationResult = new OperationResult(false, '');
        this.membershipService.login(this._user)
            .map((data: any) => data)
            .subscribe(
            (data: any) => {
                this._opResult = data;

                _authenticationResult.Message = this._opResult.Message;
                _authenticationResult.Succeeded = this._opResult.Succeeded;

                console.log('login.component login function: ' + JSON.stringify(_authenticationResult));
            },
            error => console.error('Error: ' + error),
            () => {
                if (_authenticationResult.Succeeded) {
                    this.notificationService.printSuccessMessage('Welcome back ' + this._user.Username + '!');
                    localStorage.setItem('user', JSON.stringify(this._user));
                    this.router.navigate(['home']);
                }
                else {
                    this.notificationService.printErrorMessage(_authenticationResult.Message);
                }
            });
    };

}