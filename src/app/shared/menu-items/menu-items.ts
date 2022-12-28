import { Injectable } from '@angular/core';
import { IRole } from '@interfaces/role.interface';
import { AuthService } from '@core/services/auth.service';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  subject: string;
}

const MENUITEMS = [
  { state: 'admins', name: 'Admins', type: 'link', icon: 'admin_panel_settings', action: 'view', subject: 'Admins' },
  // { state: 'contests', name: 'Contests', type: 'link', icon: 'pool', action: 'view', subject: 'Contests' },
  // { state: 'transactions', name: 'Transactions', type: 'link', icon: 'receipt', action: 'view', subject: 'Transactions' },
  { state: 'users', name: 'Users', type: 'link', icon: 'people', action: 'view', subject: 'Users' },
];

@Injectable()
export class MenuItems {
  constructor(private authService: AuthService) {
  }
  getMenuitem(): Menu[] {
    const user = this.authService.getUser();
    const menu = Object.assign([], MENUITEMS);
    return menu;
  }
}
