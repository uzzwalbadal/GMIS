import { Dto_Project, UserDto, ListResultDtoOfUserDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize, count } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import { Dto_UserProject, UserProjectServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'user-project-dialog.component.html',
  styles: [
    `
        mat-form-field {
          width: 100%;
        }
        mat-checkbox {
          padding-bottom: 5px;
        }
      `
  ]
})

export class AddUserToProjectDialogComponent extends AppComponentBase
  implements OnInit {
  saving = true;
  userProject: Dto_UserProject = new Dto_UserProject();
  userss: UserDto[] = [];

  constructor(
    injector: Injector,
    private _userProjectService: UserProjectServiceProxy,
    private _dialogRef: MatDialogRef<AddUserToProjectDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _projectId: Dto_Project
  ) {
    super(injector);
  }
  projectName: string = "";

  ngOnInit(): void {
    this.userProject = new Dto_UserProject();
    this.userProject.projectId = this._projectId.id;
    this.projectName = this._projectId.name;

    this._userProjectService.getUsersNotAssignedToProject()
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: ListResultDtoOfUserDto) => {
        this.userss = [];
        this.userss = result.items;
        if(this.userss.length == 0 || this.userss == undefined)
{
  this.notify.error(this.l('Please add Data Entry User'));
  this.close(true);
}
        // this.showPaging(result, pageNumber);
      });
  }

  selectedUserId: number = 0;

  save(): void {
    if (this.selectedUserId == 0) {
      this.notify.error(this.l('Please select User'));
      return;
    }
    this.userProject.userId = this.selectedUserId;

    this.saving = true;

    this._userProjectService
      .create(this.userProject)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result) => {
        this.notify.info(this.l('User Added Successfully'));
        this.close(true);
      });
  }

  close(result: any): void {
    this._dialogRef.close(result);
  }
}