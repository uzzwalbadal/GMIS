import { AppComponentBase } from "@shared/app-component-base";
import { Component, Injector, OnInit, Inject } from "@angular/core";
import { Dto_GroundWaterInformation, GroundWaterServiceProxy } from "@shared/service-proxies/service-proxies";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { finalize } from "rxjs/operators";
import { CustomCommonService } from "@shared/dateconvertor.service";

@Component({
  templateUrl: 'groundwater-info-dialog.component.html',
  styles: [
    `
    mat-form-field {
      width: 100%;
    }
  `  
]
})

export class GroundWaterInfoDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  dto_GroundWaterInformation: Dto_GroundWaterInformation = new Dto_GroundWaterInformation();

  constructor(
    injector: Injector,
    private _groundWaterServiceProxyService: GroundWaterServiceProxy,
    private _dialogRef: MatDialogRef<GroundWaterInfoDialogComponent>,
    private _commonService: CustomCommonService,
    @Inject(MAT_DIALOG_DATA) private datas: Dto_GroundWaterInformation
  ) { super(injector); }

  onNoClick(): void {
    this._dialogRef.close();
  }

  projectName: string = "";
  projectId: string = "";
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;

  ngOnInit(): void {
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();

    console.log("Data ");
    if (this.datas.id > 0) {
      this.dto_GroundWaterInformation = this.datas;
      console.log("Data FOund ", this.dto_GroundWaterInformation);

    } else {
      this.dto_GroundWaterInformation = new Dto_GroundWaterInformation();
      this.dto_GroundWaterInformation.projectId = this.projectId;
    }
  }

  save(): void {
    abp.message.confirm(" Please Click Cancel for Editing","Do you want to submit ?",
      (result: boolean) => {
        if (result) {
    this.saving = true;
    console.log(this.dto_GroundWaterInformation);

    if (this.dto_GroundWaterInformation.id > 0) {
      this._groundWaterServiceProxyService.update(this.dto_GroundWaterInformation)
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
      this._groundWaterServiceProxyService.create(this.dto_GroundWaterInformation)
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
  }});
  }

  close(result: any): void {
    this._dialogRef.close(result);
  }
}