import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    constructor(public snackBar: MatSnackBar ) {}

    config: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
    };

    success(message: string): void {
        this.config.panelClass = ['success', 'notification'];
        this.snackBar.open(message, '', this.config);
    }

    error(message: string): void {
        this.config.panelClass = ['error', 'notification'];
        this.snackBar.open(message, '', this.config);
    }
}
