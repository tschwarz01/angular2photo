import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../shared/registration';
import { OperationResult } from '../shared/operationResult';
import { MembershipService } from '../services/membership.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'register',
    providers: [MembershipService, NotificationService],
    template: require('./register.component.html')
})
export class RegisterComponent implements OnInit {

    private _newUser: Registration;
    private _opResult: OperationResult;

    constructor(public membershipService: MembershipService,
        public notificationService: NotificationService,
        public router: Router) { }

    ngOnInit() {
        this._newUser = new Registration('', '', '');
    }

    register(): void {
        var _registrationResult: OperationResult = new OperationResult(false, '');
        this.membershipService.register(this._newUser)
            .map((data: any) => data)
            .subscribe(
            (data: any) => {
                this._opResult = data;

                _registrationResult.Message = this._opResult.Message;
                _registrationResult.Succeeded = this._opResult.Succeeded;

                console.log('registration.component register function: ' + JSON.stringify(_registrationResult));
            },
            error => console.error('Error: ' + error),
            () => {
                if (_registrationResult.Succeeded) {
                    this.notificationService.printSuccessMessage('Dear ' + this._newUser.Username + ', please login with your credentials');
                    this.router.navigate(['account/login']);
                }
                else {
                    this.notificationService.printErrorMessage(_registrationResult.Message);
                }
            });
    };
}