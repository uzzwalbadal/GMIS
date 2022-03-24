import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Dto_GroundWaterInformation, GroundWaterServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { GroundWaterInfoDialogComponent } from './data-component/groundwater-info-dialog.component';
import { ExcelService } from 'gmis/excel.service';
import { CustomCommonService } from '@shared/dateconvertor.service';

@Component({
  selector: 'app-groundwater-info',
  templateUrl: './groundwater-info.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./groundwater-info.component.css']
})
export class GroundwaterInfoComponent implements OnInit {
  dto_groundwaterInfo : Dto_GroundWaterInformation = new Dto_GroundWaterInformation();
  GroundwaterInfos:Dto_GroundWaterInformation[]=[];

  constructor(
    public _dialog: MatDialog,
    private excelService:ExcelService,
    private _commonService: CustomCommonService,
    private _groundWaterServiceProxy: GroundWaterServiceProxy
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
    // this.getCropList();
    this.getGroundWaterList();
  }

  isTableLoading: boolean = false;
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.GroundwaterInfos, 'Groundwater');
  }
  getGroundWaterList() {
    this.GroundwaterInfos = [];
    this.isTableLoading = true;
    this._groundWaterServiceProxy.getGroundWaterInfoListByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((result: Dto_GroundWaterInformation[]) => {
        this.GroundwaterInfos = result;
        if (result.length > 0) {
          console.log("GroundwaterInfos", result);

        }
      });
  }


  
  
  addNewData() {
    const dialogRef = this._dialog.open(GroundWaterInfoDialogComponent,{
      width: '200%',
     data: this.dto_groundwaterInfo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result ", result)
      if (result) {
        this.refresh();
      }
    });
  }

  refresh() {
    this.getGroundWaterList();
  }

  editGroundWaterData(GroundWaterInformation: Dto_GroundWaterInformation) {
    const dialogRef = this._dialog.open(GroundWaterInfoDialogComponent, {
      width: '200%',
      data: GroundWaterInformation
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ",result)
      if (result) {
        this.refresh();
      }
    });
  }
}
