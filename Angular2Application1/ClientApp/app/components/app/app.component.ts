//import { Component } from '@angular/core';

//@Component({
//    selector: 'app',
//    template: require('./app.component.html'),
//    styles: [require('./app.component.css')]
//})
//export class AppComponent {
//}
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
//import 'rxjs/add/operator/map';
//import './rxjs-operators';
import { enableProdMode } from '@angular/core';

enableProdMode();
import { MembershipService } from '../services/membership.service';
import { User } from '../shared/user';

@Component({
    selector: 'app',
    template: require('./app.component.html')
})
export class AppComponent implements OnInit {

    constructor(public membershipService: MembershipService,
        public location: Location) { }

    ngOnInit() { }

    //isUserLoggedIn(): boolean {
    //    return this.membershipService.isUserAuthenticated();
    //}

    getUserName(): string {
        //if (this.isUserLoggedIn()) {
        //    var _user = this.membershipService.getLoggedInUser();
        //    return _user.Username;
        //}
        //else
            return 'tschwarz';
    }

    //logout(): void {
    //    this.membershipService.logout()
    //        .subscribe(res => {
    //            localStorage.removeItem('user');
    //        },
    //        error => console.error('Error: ' + error),
    //        () => { });
    //}
}
