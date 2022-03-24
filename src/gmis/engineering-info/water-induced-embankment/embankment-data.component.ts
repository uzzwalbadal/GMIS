import { CustomCommonService } from './../../../shared/dateconvertor.service';
import { WaterInducedDisasterModelServiceProxy, Dto_WaterInducedDisasterModel, Dto_Spur, SpurServiceProxy, EmbankmentServiceProxy, Dto_Embankment } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'embankment-data.component.html',
  styles: [
    `
        mat-form-field {
          width: 100%;
        }
      `
  ]
})

export class WaterInducedEmbankmentDialogComponent extends AppComponentBase
  implements OnInit {
  saving: boolean = false;

  constructor(
    injector: Injector,
    private _dialogRef: MatDialogRef<WaterInducedEmbankmentDialogComponent>,
    private _EmbankmentService: EmbankmentServiceProxy,
    private _CommonService: CustomCommonService,

    @Inject(MAT_DIALOG_DATA)
    public ids : number
  ) { super(injector); }

  onNoClick(): void {
    this._dialogRef.close();
  }

  Dto_Embankment: Dto_Embankment = new Dto_Embankment();
  
  ngOnInit(): void {
    // console.log(this.ids);
    // console.log(this.ids.ids);

    if(this.ids > 0){
    abp.ui.setBusy("#DataFormDiv");
    this._EmbankmentService.get(this.ids)
    .pipe(
      finalize(() => {
        this.saving = false;
        abp.ui.clearBusy("#DataFormDiv");
      })
    )
    .subscribe((result: Dto_Embankment) => {
      this.Dto_Embankment = new Dto_Embankment();
      this.Dto_Embankment = result;
    });
    }else{
      this.Dto_Embankment = new Dto_Embankment();
      this.Dto_Embankment.id=0;
      this.Dto_Embankment.projectId = this._CommonService.getProjectid();
    }

    this.showSaveBtn = this._CommonService.getSaveButtonAccess();
    this.showUpdateBtn = this._CommonService.getUpdateButtonAccess();
  }
  showSaveBtn:boolean=false;
  showUpdateBtn:boolean = false;

  save(): void {
    abp.message.confirm(" Please Click Cancel for Editing","Do you want to submit ?",
      (result: boolean) => {
        if (result) {
    console.log("DM ", this.Dto_Embankment);

    abp.ui.setBusy("#DataFormDiv");
    if (this.Dto_Embankment.id > 0) {
      this._EmbankmentService.update(this.Dto_Embankment)
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
      this._EmbankmentService.create(this.Dto_Embankment)
        .pipe(
          finalize(() => {
            this.saving = false;
            abp.ui.clearBusy("#DataFormDiv");
          })
        )
        .subscribe((result: Dto_Embankment) => {
          // this.notify.info(this.l('Updated Successfully'));
          this.notify.success("Added Successfully");
          this.close(result);
        });
    } 
  }});
  }

  close(result: Dto_Embankment): void {
    this._dialogRef.close(result);
  }

}