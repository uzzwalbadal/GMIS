import { CustomCommonService } from './../../../shared/dateconvertor.service';
import { WaterInducedDisasterModelServiceProxy, Dto_WaterInducedDisasterModel, Dto_Spur, SpurServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'spur-data.component.html',
  styles: [
    `
        mat-form-field {
          width: 100%;
        }
      `
  ]
})

export class WaterInducedSpurDialogComponent extends AppComponentBase
  implements OnInit {
  saving: boolean = false;

  constructor(
    injector: Injector,
    private _dialogRef: MatDialogRef<WaterInducedSpurDialogComponent>,
    private _SpurService: SpurServiceProxy,
    private _CommonService: CustomCommonService,

    @Inject(MAT_DIALOG_DATA)
    public ids : number
  ) { super(injector); }

  onNoClick(): void {
    this._dialogRef.close();
  }

  Dto_Spur: Dto_Spur = new Dto_Spur();
  
  ngOnInit(): void {
    // console.log(this.ids);
    // console.log(this.ids.ids);

    if(this.ids > 0){
    abp.ui.setBusy("#DataFormDiv");
    this._SpurService.get(this.ids)
    .pipe(
      finalize(() => {
        this.saving = false;
        abp.ui.clearBusy("#DataFormDiv");
      })
    )
    .subscribe((result: Dto_Spur) => {
      this.Dto_Spur = new Dto_Spur();
      this.Dto_Spur = result;
    });
    }else{
      this.Dto_Spur = new Dto_Spur();
      this.Dto_Spur.id=0;
      this.Dto_Spur.projectId = this._CommonService.getProjectid();
    }

    // console.log(this.data);
    // this.Dto_Spur = this.data;
    this.showSaveBtn = this._CommonService.getSaveButtonAccess();
    this.showUpdateBtn = this._CommonService.getUpdateButtonAccess();
  }
  showSaveBtn:boolean=false;
  showUpdateBtn:boolean = false;

  save(): void {
    abp.message.confirm(" Please Click Cancel for Editing","Do you want to submit ?",
      (result: boolean) => {
        if (result) {
    console.log("DM ", this.Dto_Spur);

    abp.ui.setBusy("#DataFormDiv");
    if (this.Dto_Spur.id > 0) {
      this._SpurService.update(this.Dto_Spur)
        .pipe(
          finalize(() => {
            this.saving = false;
            abp.ui.clearBusy("#DataFormDiv");
          })
        )
        .subscribe((result: any) => {
          this.notify.info(this.l('Updated Successfully'));
          this.close(result);
        });
    }else{
      this._SpurService.create(this.Dto_Spur)
        .pipe(
          finalize(() => {
            this.saving = false;
            abp.ui.clearBusy("#DataFormDiv");
          })
        )
        .subscribe((result: Dto_Spur) => {
          // this.notify.info(this.l('Updated Successfully'));
          this.notify.success("Added Successfully");
          this.close(result);
        });
    }
  }});
  }

  close(result: Dto_Spur): void {
    this._dialogRef.close(result);
  }

}