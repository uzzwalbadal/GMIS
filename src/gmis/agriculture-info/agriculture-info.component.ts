import { Dto_AgricultreInfo, AgricultreInfoServiceProxy, Dto_CropName, Dto_AgricultreInfoDetailModel, AgricultureDetailServiceProxy, Dto_AgricultureDetail } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AgricultureInfoDialogComponent } from './data-component/agriculture-info-dialog.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { ExcelService } from 'gmis/excel.service';

export interface DialogData {
  isEdit: boolean;
  CropList: Dto_CropName[];
  isCropPatternExisting: boolean;
  id: number;
  projectId: string;
}

@Component({
  selector: 'app-agriculture-info',
  templateUrl: './agriculture-info.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./agriculture-info.component.css']
})
export class AgricultureInfoComponent implements OnInit {
  dto_AgricultreInfo: Dto_AgricultreInfo = new Dto_AgricultreInfo();

  ExistingCrop_AgricultreInfos: Dto_AgricultreInfoDetailModel[] = [];
  NewCrop_AgricultreInfos: Dto_AgricultreInfoDetailModel[] = [];

  constructor(
    public _dialog: MatDialog,
    private _agricultureServiceProxy: AgricultreInfoServiceProxy,
    private _commonService: CustomCommonService,
    private _AgricultureDetailServiceProxy: AgricultureDetailServiceProxy,
    private excelService:ExcelService
  ) { }

  projectName: string = "";
  projectId: string = "";
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;

  ngOnInit() {
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();
    this.Dto_AgricultureDetail = new Dto_AgricultureDetail();

    this.getCropList();
    this.getAgricultureList();
    this.getAgricultureDetail();
  }
  exportExistingAsXLSX():void {
    this.excelService.exportAsExcelFile(this.ExistingCrop_AgricultreInfos, 'Existing Crops');
 }
 exportProposedAsXLSX():void {
  this.excelService.exportAsExcelFile(this.NewCrop_AgricultreInfos, 'Proposed Crops');
}

  Dto_AgricultureDetail: Dto_AgricultureDetail = new Dto_AgricultureDetail();
  getAgricultureDetail(): void {
    this.saving = true;
    abp.ui.setBusy("#DataDiv");
    this._AgricultureDetailServiceProxy.getAgricultureDetailByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("#DataDiv"); this.saving = false;
        })
      )
      .subscribe((result: Dto_AgricultureDetail) => {
        if (result.id > 0) {
          this.Dto_AgricultureDetail = new Dto_AgricultureDetail();
          this.Dto_AgricultureDetail = result;
        } else {
          this.Dto_AgricultureDetail = new Dto_AgricultureDetail();
          this.Dto_AgricultureDetail.id = 0;
          this.Dto_AgricultureDetail.projectId = this.projectId;
        }
      },
        (error) => {
          console.log("getAgricultureDetail", error);
          abp.notify.error('Error in Getting data. Please try again');
        });
  }

  saving: boolean = false;
  onSubmitAgricultreDetail(): void {
    abp.message.confirm(" Please Click Cancel for Editing","Do you want to submit ?",
      (result: boolean) => {
        if (result) {

    this.saving = true;
    abp.ui.setBusy("#DataDiv");
    if (this.Dto_AgricultureDetail.id > 0) {
      this._AgricultureDetailServiceProxy.update(this.Dto_AgricultureDetail)
        .pipe(
          finalize(() => {
            abp.ui.clearBusy("#DataDiv"); this.saving = false;
          })
        )
        .subscribe((result: Dto_AgricultureDetail) => {
          abp.notify.success('Updated Successfully');
        },
          (error) => {
            console.log("onSubmitAgricultreDetail-create", error);
            abp.notify.error('Error in Getting data. Please try again');
          });
    } else {
      this._AgricultureDetailServiceProxy.create(this.Dto_AgricultureDetail)
        .pipe(
          finalize(() => {
            abp.ui.clearBusy("#DataDiv"); this.saving = false;
          })
        )
        .subscribe((result: Dto_AgricultureDetail) => {
          this.Dto_AgricultureDetail.id = result.id;
          abp.notify.success('Saved Successfully');
        },
          (error) => {
            console.log("onSubmitAgricultreDetail-create", error);
            abp.notify.error('Error in Getting data. Please try again');
          });
    }
  }});
  }
  
  NewTotalCropArea:number=0;
  ExistingTotalCropArea:number=0;
  isTableLoading: boolean = false;
  getAgricultureList() {
    this.NewCrop_AgricultreInfos = [];
    this.ExistingCrop_AgricultreInfos = [];
    this.isTableLoading = true;
    this.NewTotalCropArea =0;
    this.ExistingTotalCropArea =0;
    this._agricultureServiceProxy.getAgricultureInfoByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((result: Dto_AgricultreInfoDetailModel[]) => {
        if (result.length > 0) {
          this.NewCrop_AgricultreInfos = result.filter(x => x.isCropPatternExisting == false);
          this.NewCrop_AgricultreInfos.forEach(x=> this.NewTotalCropArea += x.cropArea);
          // console.log("New Crop", this.NewCrop_AgricultreInfos)

          this.ExistingCrop_AgricultreInfos = result.filter(x => x.isCropPatternExisting == true);
          this.ExistingCrop_AgricultreInfos.forEach(x=> this.ExistingTotalCropArea += x.cropArea);

          // console.log("Existing Crop", this.ExistingCrop_AgricultreInfos)
        }
      });
  }

  onProposedCultivatedAreaChange(event): boolean{
     const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    let res = (this.NewTotalCropArea/this.Dto_AgricultureDetail.proposedTotalCultivatedArea) * 100;
    res = parseFloat(res.toFixed(2));
   this.Dto_AgricultureDetail.proposedCropIntensity = res;
   return true;
  }

  onExistingCultivatedAreaChange(event):boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    let res = (this.ExistingTotalCropArea/this.Dto_AgricultureDetail.existingTotalCultivatedArea) * 100;
    res = parseFloat(res.toFixed(2));
   this.Dto_AgricultureDetail.existingCropIntensity = res;
   return true;
  }
  
  cropLists: Dto_CropName[] = [];
  getCropList() {
    this._agricultureServiceProxy.getCropNameList()
      .subscribe((result: Dto_CropName[]) => {
        this.cropLists = result;
      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getCropList ", err);
        });
  }

  addNewCropPatternData() {
    let CroplistToInject: Dto_CropName[] = [];
    if (this.NewCrop_AgricultreInfos.length > 0) {
      for (let crop of this.cropLists) {

        let Result = this.NewCrop_AgricultreInfos.findIndex(x => x.cropId == crop.id);
        if (Result == -1) {
          CroplistToInject.push(crop);
        }
      }
    } else {
      CroplistToInject = this.cropLists;
    }

    if (CroplistToInject.length > 0) {

    } else {
      abp.notify.info("Please Add Crop Name to add in New Crop Pattern");
      return;
    }
    const dialogRef = this._dialog.open(AgricultureInfoDialogComponent, {
      width: '200%',
      data: { isEdit: false, CropList: CroplistToInject, isCropPatternExisting: false, id: 0, projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ", result)
      if (result) {
        this.refresh();
      }
    });
  }

  addExistingCropPatternData() {
    let CroplistToInject: Dto_CropName[] = [];
    if (this.ExistingCrop_AgricultreInfos.length > 0) {
      for (let crop of this.cropLists) {

        let Result = this.ExistingCrop_AgricultreInfos.findIndex(x => x.cropId == crop.id);
        if (Result == -1) {
          CroplistToInject.push(crop);
        }
      }
    } else {
      CroplistToInject = this.cropLists;
    }

    if (CroplistToInject.length > 0) {

    } else {
      abp.notify.info("Please add crop name to add in Existing Crop Pattern");
      return;
    }

    const dialogRef = this._dialog.open(AgricultureInfoDialogComponent, {
      width: '200%',
      
      data: { isEdit: false, CropList: CroplistToInject, isCropPatternExisting: true, id: 0, projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ",result)
      if (result) {
        this.refresh();
      }
    });
  }

  refresh() {
    this.getAgricultureList();
  }

  editExistingCropPattern(Dto_AgricultureInfos: Dto_AgricultreInfoDetailModel) {
    let CroplistToInject: Dto_CropName[] = [];

    for (let crop of this.cropLists) {
      let Result = this.ExistingCrop_AgricultreInfos.findIndex(x => x.cropId == crop.id);
      if (Result == -1) {
        CroplistToInject.push(crop);
      }
    }

    let Result = this.cropLists.findIndex(x => x.id == Dto_AgricultureInfos.cropId);
    if (Result == -1) {
      abp.notify.error("Internal Error.. Please Report Us");
    }
    CroplistToInject.push(this.cropLists[Result]);

    if (CroplistToInject.length > 0) {

    } else {
      abp.notify.info("Please add crop name to add in Existing Crop Pattern");
      return;
    }

    const dialogRef = this._dialog.open(AgricultureInfoDialogComponent, {
      data: { isEdit: true, CropList: CroplistToInject, isCropPatternExisting: true, id: Dto_AgricultureInfos.id, projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ",result)
      if (result) {
        this.refresh();
      }
    });
  }

  

  editNewCropPattern(Dto_AgricultureInfos: Dto_AgricultreInfoDetailModel) {
    let CroplistToInject: Dto_CropName[] = [];

    for (let crop of this.cropLists) {
      let Result = this.NewCrop_AgricultreInfos.findIndex(x => x.cropId == crop.id);
      if (Result == -1) {
        CroplistToInject.push(crop);
      }
    }

    let Result = this.cropLists.findIndex(x => x.id == Dto_AgricultureInfos.cropId);
    if (Result == -1) {
      abp.notify.error("Internal Error.. Please Report Us");
    }
    CroplistToInject.push(this.cropLists[Result]);

    if (CroplistToInject.length > 0) {

    } else {
      abp.notify.info("Please add crop name to add in Existing Crop Pattern");
      return;
    }

    const dialogRef = this._dialog.open(AgricultureInfoDialogComponent, {
      data: { isEdit: true, CropList: CroplistToInject, isCropPatternExisting: true, id: Dto_AgricultureInfos.id, projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ",result)
      if (result) {
        this.refresh();
      }
    });
  }
}