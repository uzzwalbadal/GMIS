import { CustomCommonService } from './../../shared/dateconvertor.service';
import { Dto_MajorRiverBasin, LocationWardRelationServiceProxy, LocationProjectWardRelationDetailDto, Dto_LocationInfo } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AddLocationToProjectDialogComponent } from './add-location/add-location-inProject-dialog.component';
import { MatDialog } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectLocationInfoServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ProjectWardRelationListGeneralizedView } from './Generalisedview.model';
import { ExcelService } from 'gmis/excel.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./location.component.css']
})

export class LocationComponent implements OnInit {
  saving: boolean = false;
  projectName: string = "";
  projectId: string = "";
  LocationInfoDto: Dto_LocationInfo = new Dto_LocationInfo();
  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _WardRelationService: LocationWardRelationServiceProxy,
    private _projectLocationInfoService: ProjectLocationInfoServiceProxy,
    private _commonService: CustomCommonService,
    private excelService: ExcelService,
  ) {
  }

  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  HideLocationInfoDetailDiv: boolean = true;
  ngOnInit() {
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();

    this.getRiverBasin();
    this.getProjectWardList();
    this.getLocationDetail();
    //get riverbasin
  }



  isTableLoading: boolean = false;
  refresh() {
    this.getProjectWardList();
  }

  locationForm = this.fb.group({
    ecologicalRegion: ['', Validators.required],
    nearestRoad: ['', Validators.required],
    airportDistance: ['', Validators.required],
    airport: ['', Validators.required],
    marketDistance: ['', Validators.required],
    market: ['', Validators.required],
    riverBasinDistance: ['', Validators.required],
    localRiverBasin: ['', Validators.required],
    majorRiverBasinId: ['', Validators.required],
    riverSource: ['', Validators.required],
    projectId: [this.projectId],
  });
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.TestLists, 'Location');
  }


  AddLocation() {
    let projectHelperDialog;
    projectHelperDialog = this._dialog.open(AddLocationToProjectDialogComponent, {
      data: "1"
    });

    projectHelperDialog.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  save() {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          this.saving = true;
          abp.ui.setBusy('#LocationInfoDiv');
          if (this.LocationInfoDto.id > 0) {
            //update
            this._projectLocationInfoService.update(this.LocationInfoDto)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#LocationInfoDiv');
                  this.saving = false;
                })
              )
              .subscribe((result: Dto_LocationInfo) => {
                this.LocationInfoDto = result;
                abp.notify.success("Updated Sucessfully");
              },
                (err) => {
                  abp.notify.error("Error Please report us");
                  console.log("updateLocationDetail ", err);
                });
          } else {
            this._projectLocationInfoService.create(this.LocationInfoDto)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#LocationInfoDiv');
                  this.saving = false;
                })
              )
              .subscribe((result: Dto_LocationInfo) => {
                this.LocationInfoDto = result;
                abp.notify.success("Saved Sucessfully");
              },
                (err) => {
                  abp.notify.error("Error Please report us");
                  console.log("createLocationDetail ", err);
                });
          }

        }
      });
  }

  getLocationDetail() {
    abp.ui.setBusy('#LocationInfoDiv');
    this._projectLocationInfoService.getLocationInfoDetailByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#LocationInfoDiv');
        })
      )
      .subscribe((result: Dto_LocationInfo) => {
        if (result.id > 0) {
          // console.log("data found");
          this.LocationInfoDto = result;
        } else {
          // console.log("data not found getLocationDetail");
          this.LocationInfoDto.projectId = this.projectId;
          this.LocationInfoDto.majorRiverBasinId = 0;
          this.LocationInfoDto.id = 0;
          this.LocationInfoDto.ecologicalRegion = "";
        }
      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getLocationDetail ", err);
        });
  }

  TestLists: ProjectWardRelationListGeneralizedView[] = [];
  getProjectWardList() {
    this.TestLists = [];
    this.isTableLoading = true;
    this._WardRelationService.getAllProjectRelation(this.projectId)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((ProjectWardRelations: LocationProjectWardRelationDetailDto[]) => {
        if (ProjectWardRelations.length > 0) {
          this.HideLocationInfoDetailDiv = false;
          let LocalTypeNameIds = ProjectWardRelations.map(function (a) {
            return a.localBodyTypeId;
          }); // list of localbodytypeid

          let LocalBodyTYpeId_Unique = LocalTypeNameIds.filter(function (value, index, self) {
            return self.indexOf(value) === index;
          }); // unique localbodytypeid

          for (let uniqueLocalTYpeId of LocalBodyTYpeId_Unique) {
            let SimilarLocalBodyNames = ProjectWardRelations.filter(x => x.localBodyTypeId == uniqueLocalTYpeId);
            let tempDto = new ProjectWardRelationListGeneralizedView();
            tempDto.id = 0;
            tempDto.districtName = SimilarLocalBodyNames[0].districtName;
            tempDto.localBodyName = SimilarLocalBodyNames[0].localBodyName;
            tempDto.localBodyTypeName = SimilarLocalBodyNames[0].localBodyTypeName;
            tempDto.provienceName = SimilarLocalBodyNames[0].provienceName;
            tempDto.wardName = SimilarLocalBodyNames.map(function (localbodys) {
              return localbodys.wardName;
            }).join(",");
            this.TestLists.push(tempDto);
          }
        } // if closing

      });
  }

  MajorRiverBasins: Dto_MajorRiverBasin[] = [];
  getRiverBasin() {
    this._projectLocationInfoService.getAllRiverBasin()
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: Dto_MajorRiverBasin[]) => {
        this.MajorRiverBasins = [];
        this.MajorRiverBasins = result;
      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getRiverBasin ", err);
        });
  }

  openModal(templateRef) {
    let dialogRef = this._dialog.open(templateRef, {
      // width: '250px',
      // data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}