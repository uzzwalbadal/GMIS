import { AgricultreInfoServiceProxy, Dto_AgricultreInfo, Dto_CropName } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize, count } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Dto_UserProject, UserProjectServiceProxy, UserDto, Dto_Project, ListResultDtoOfUserDto } from '@shared/service-proxies/service-proxies';
import { DialogData } from '../agriculture-info.component';
import { CustomCommonService } from '@shared/dateconvertor.service';


@Component({
  templateUrl: 'agriculture-info-dialog.component.html',
  styles: [
    `
        mat-form-field {
          width: 100%;
          
        }
      `
  ]
})

export class AgricultureInfoDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  dto_Agricultre: Dto_AgricultreInfo = new Dto_AgricultreInfo();
  CropsLis: Dto_CropName[] = [];
  CropPattern: string = "";

  constructor(
    injector: Injector,
    private _userProjectService: UserProjectServiceProxy,
    private _agricultureService: AgricultreInfoServiceProxy,
    private _commonService: CustomCommonService,
    private _dialogRef: MatDialogRef<AgricultureInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: DialogData
  ) { super(injector); }

  onNoClick(): void {
    this._dialogRef.close();
  }

  projectId: string = "";
  isCropPatternExisting: boolean;
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;

  ngOnInit(): void {
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();

    this.CropsLis = this.datas.CropList;
    this.projectId = this.datas.projectId;
    this.isCropPatternExisting = this.datas.isCropPatternExisting;
    this.CropPattern = this.isCropPatternExisting == true ? "Before" : "After";

    if (this.datas.isEdit) {
      // console.log("Edit Mode ");
      this.saving = true;

      this._agricultureService.get(this.datas.id)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe((result: any) => {
          this.dto_Agricultre = new Dto_AgricultreInfo();
          this.dto_Agricultre = result;
        });

    } else {
      // console.log("create  Mode ");
      this.dto_Agricultre = new Dto_AgricultreInfo();
      this.dto_Agricultre.projectId = this.projectId;
      this.dto_Agricultre.isCropPatternExisting = this.isCropPatternExisting;
    }

    //     this._userProjectService.getUsersNotAssignedToProject()
    //       .pipe(
    //         finalize(() => {
    //           this.saving = false;
    //         })
    //       )
    //       .subscribe((result: ListResultDtoOfUserDto) => {
    //         this.userss = [];
    //         this.userss = result.items;
    //         if(this.userss.length == 0 || this.userss == undefined)
    // {
    //   this.notify.error(this.l('Please add Data Entry User'));
    //   this.close(true);
    // }
    //         // this.showPaging(result, pageNumber);
    //       });
  }

  save(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          if (this.dto_Agricultre.id > 0) {
            this._agricultureService.update(this.dto_Agricultre)
              .pipe(
                finalize(() => {
                  this.saving = false;
                })
              )
              .subscribe((result: any) => {
                this.notify.info(this.l('Updated Successfully'));
                this.close(result);
              });
          } else {
            this._agricultureService.create(this.dto_Agricultre)
              .pipe(
                finalize(() => {
                  this.saving = false;
                })
              )
              .subscribe((result: any) => {
                this.notify.info(this.l('Added Successfully'));
                this.close(result);
              });

          }
        }
      });
  }

  close(result: any): void {
    this._dialogRef.close(result);
  }
}