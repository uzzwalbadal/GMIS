import { Component, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MatCheckboxChange } from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
  LocationWardRelationServiceProxy,
  LocalBodynameServiceProxy,
  LocalBodyTypeServiceProxy,
  DistrictServiceProxy,
  ProvienceServiceProxy,
  PagedResultDtoOfDto_Provience,
  Dto_Provience,
  Dto_LocationDistrict,
  Dto_LocalBodyType,
  Dto_LocalBodyName,
  Dto_LocationProjectRelation,
  LocationProjectWardRelationDetailDto
} from '@shared/service-proxies/service-proxies';
import { ProjectWardRelationListGeneralizedView } from '../Generalisedview.model';
import { CustomCommonService } from '@shared/dateconvertor.service';

@Component({
  templateUrl: 'add-location-inProject-dialog.component.html',
  styles: [
    // `
    //   mat-form-field {
    //     width: 100%;
    //   }
    //   mat-checkbox {
    //     padding-bottom: 5px;
    //   }
    // `
  ]
})

export class AddLocationToProjectDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  projectName: string = "";
  projectId: string = "";
  FullWards: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,31,32,33,34,35,36,37,38,39,40];

  constructor(
    injector: Injector,
    private _WardRelationService: LocationWardRelationServiceProxy,
    private _localBodyNameService: LocalBodynameServiceProxy,
    private _districtsService: DistrictServiceProxy,
    private _provienceService: ProvienceServiceProxy,
    private _dialogRef: MatDialogRef<AddLocationToProjectDialogComponent>,
    private _commonService : CustomCommonService    
  ) {
    super(injector);
  }

  Proviences: Dto_Provience[] = [];
  isTableLoading: boolean = false;
  ProjectWardRelations: LocationProjectWardRelationDetailDto[] = [];
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  ngOnInit(): void {
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();

    abp.ui.setBusy("ProvienceDiv");
    this._provienceService.getAll("", 0, 1000)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("ProvienceDiv");
          this.getProjectWardList();
        })
      )
      .subscribe((result: PagedResultDtoOfDto_Provience) => {
        this.Proviences = result.items;
      });
    this.getNewCreateInstance();
  }
  
  DeleteWardFromRelation(ids:number):void{
    this._WardRelationService.delete(ids)
      .pipe(
        finalize(() => {
          this.getProjectWardList();
          this.ReloadTableAfterMatDialogClose = true;
        })
      )
      .subscribe((result) => {
          abp.notify.success("Removed Successfully");
      });
  }

  // dto_WardRelation : Dto_LocationProjectRelation = new Dto_LocationProjectRelation(); 
  ReloadTableAfterMatDialogClose:boolean = false;
  AddWardsToList(): void {
    let DataModel: Dto_LocationProjectRelation[] = [];
    for (let item of this.wards_checked) {
      let dtos: Dto_LocationProjectRelation = new Dto_LocationProjectRelation();
      dtos.id = 0;
      dtos.projectId = this.projectId;
      dtos.locationLocalBodyNameId = this.LocalBodyNamesId;
      dtos.ward = item;
      DataModel.push(dtos);
    }

    this._WardRelationService.createProjectWardRelation(DataModel)
      .pipe(
        finalize(() => {
          this.getProjectWardList();
          this.ReloadTableAfterMatDialogClose = true;
        })
      )
      .subscribe((result: boolean) => {
        if (result) {
          abp.notify.success("Added Successfully");
        } else {
          abp.notify.error("Failed.. Please try again");
        }
      });

    this.getNewCreateInstance();
  }

  provienceIds: number = 0;
  districtIds: number = 0;
  localBodyType: number = 0;
  LocalBodyNamesId: number = 0;
  wards: number[] = [];
  wards_checked: number[] = [];
  getNewCreateInstance() {
    this.wards = [];
    this.wards_checked = [];
    this.LocalBodyNamesId = 0;
    this.provienceIds = 0;
    this.districtIds = 0;
    this.localBodyType = 0;
  }

  close(): void {
    this._dialogRef.close(this.ReloadTableAfterMatDialogClose);
  }

  onChange(wardNo: number, events: MatCheckboxChange) {
    if (events.checked) {
      this.wards_checked.push(wardNo);
    } else {
      this.wards_checked = this.wards_checked.filter(x => x != wardNo);
    }
  }

  onChangeLocalBodyName(localBodyId: number) {
    this.wards = [];

    if (this.ProjectWardRelations.length > 0) {
      var wardsAlreadyInDb = this.ProjectWardRelations.map(function (a) {
        if (a.localBodyTypeId == localBodyId) {
          return a.wardName;
        }
      });

      if (wardsAlreadyInDb.length > 0) {
        for (let ward of this.FullWards) {
          let indexx = wardsAlreadyInDb.indexOf(ward);
          if (indexx == -1) {
            this.wards.push(ward);
          }
        }
      } else {
        this.wards = this.FullWards;
      }
    } else {
      this.wards = this.FullWards;
    }
  }

  localBodyNames: Dto_LocalBodyName[] = [];
  onChangeLocalBodyType(localbodyId: number) {
    this.wards = [];

    this._localBodyNameService.getLocalBodyNameFromDistrictIdAndLocalBodyType(this.districtIds, localbodyId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("onChangeLocalBodyTypeDiv");
        })
      )
      .subscribe((result: Dto_LocalBodyName[]) => {
        this.localBodyNames = result;
      });
  }

  localBodyTypes: Dto_LocalBodyType[] = [];
  onChangeDistrict(event: number) {
    this.localBodyNames = [];
    this.LocalBodyNamesId = 0;

    this.wards = [];
    this._localBodyNameService.getLocalBodyTypeFromDistrictId(event)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("onChangeLocalBodyTypeDiv");
        })
      )
      .subscribe((result: Dto_LocalBodyType[]) => {
        this.localBodyTypes = result;
      });
  }

  districts: Dto_LocationDistrict[] = [];
  onChangeProvience(event: number) {
    this.districts = [];
    this.districtIds = 0;

    this.localBodyTypes = [];
    this.localBodyType = 0;

    this.localBodyNames = [];
    this.LocalBodyNamesId = 0;

    this.wards = [];
    abp.ui.setBusy("onChangeDistrictDiv");
    this._districtsService.getDistrictFromProvienceId(event)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("onChangeDistrictDiv");
        })
      )
      .subscribe((result: Dto_LocationDistrict[]) => {
        this.districts = result;
      });
  }

  TestLists: ProjectWardRelationListGeneralizedView[] = [];
  getProjectWardList() {
    this.ProjectWardRelations = [];
    this.isTableLoading = true;
    this._WardRelationService.getAllProjectRelation(this.projectId)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((result: LocationProjectWardRelationDetailDto[]) => {
        this.ProjectWardRelations = result;

        this.TestLists = [];
        if (this.ProjectWardRelations.length > 0) {
          let LocalTypeNameIds = this.ProjectWardRelations.map(function (a) {
            return a.localBodyTypeId;
          }); // list of localbodytypeid

          let LocalBodyTYpeId_Unique = LocalTypeNameIds.filter(function (value, index, self) {
            return self.indexOf(value) === index;
          }); // unique localbodytypeid

          for (let uniqueLocalTYpeId of LocalBodyTYpeId_Unique) {
            let SimilarLocalBodyNames = this.ProjectWardRelations.filter(x => x.localBodyTypeId == uniqueLocalTYpeId);
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
}
