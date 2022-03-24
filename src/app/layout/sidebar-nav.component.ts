import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MenuItem } from '@shared/layout/menu-item';

@Component({
    templateUrl: './sidebar-nav.component.html',
    selector: 'sidebar-nav',
    encapsulation: ViewEncapsulation.None
})
export class SideBarNavComponent extends AppComponentBase {

    menuItems: MenuItem[] = [
        // new MenuItem(this.l('HomePage'), '', 'home', '/app/home'),

        // new MenuItem(this.l('Tenants'), 'Pages.Tenants', 'business', '/app/tenants'),
        // new MenuItem(this.l('Users'), 'Pages.Users', 'people', '/app/users'),
        new MenuItem(this.l('Users'), 'Pages.Users', 'people', '/app/users'),
        new MenuItem('Project Management', '', 'info', '/app/project'),
        // new MenuItem('Manage', '', 'info', '../gmis'),
        new MenuItem('Manage', '', 'info', '/gmis/dashboard'),
        new MenuItem(this.l('Roles'), 'Pages.Tenants', 'local_offer', '/app/roles'),
        new MenuItem('Graph Data', '', 'info', '/app/graph-data'),
        
        // new MenuItem(this.l('Management'), 'Pages.Users', 'menu', '', [
        //     new MenuItem('Project', '', '', '', [
        //         new MenuItem('Create Project', '', '', '/app/project'),
        //     ]),
        //     new MenuItem('User', '', '', '/app/users')
        // ])
    ];

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        }

        return true;
    }
}
