import { Injectable } from '@angular/core';

var alertify = require('alertifyjs/build/alertify.min.js'); 

@Injectable()
export class NotificationService {
    private _notifier: any = alertify;
    constructor() {
    }

    printSuccessMessage(message: string) {

        this._notifier.success(message);
    }

    printErrorMessage(message: string) {
        this._notifier.error(message);
    }

    printConfirmationDialog(message: string, okCallback: () => any) {
        this._notifier.confirm(message, function (e) {
            if (e) {
                okCallback();
            } else {
            }
        });
    }
}