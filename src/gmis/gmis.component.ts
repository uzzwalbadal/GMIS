import { Component, OnInit, AfterViewInit, ViewContainerRef, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmis',
  templateUrl: './gmis.component.html',
  styleUrls: ['./gmis.component.css']
})

export class GmisComponent extends AppComponentBase implements OnInit, AfterViewInit {

  private viewContainerRef: ViewContainerRef;

  constructor(
      injector: Injector,
      private _router: Router,
  ) {
      super(injector);
  }

  ngOnInit(): void {

      // SignalRAspNetCoreHelper.initSignalR();

      abp.event.on('abp.notifications.received', userNotification => {
          abp.notifications.showUiNotifyForUserNotification(userNotification);

          // Desktop notification
          Push.create('AbpZeroTemplate', {
              body: userNotification.notification.data.message,
              icon: abp.appPath + 'assets/app-logo-small.png',
              timeout: 6000,
              onClick: function () {
                  window.focus();
                  this.close();
              }
          });
      });

      this._router.navigate(['/gmis/dashboard']);
  }

  ngAfterViewInit(): void {
      $.AdminBSB.activateAll();
      $.AdminBSB.activateDemo();
  }

  onResize(event) {
      // exported from $.AdminBSB.activateAll
      $.AdminBSB.leftSideBar.setMenuHeight();
      $.AdminBSB.leftSideBar.checkStatuForResize(false);

      // exported from $.AdminBSB.activateDemo
      $.AdminBSB.demo.setSkinListHeightAndScroll();
      $.AdminBSB.demo.setSettingListHeightAndScroll();
  }
}
