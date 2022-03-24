import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Dto_SocialInfoDetailListModel } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SocialInformationServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MatDialog } from '@angular/material';
import { SocialInfoDialogComponent } from './data-component/social-info-dialog.component';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { ExcelService } from 'gmis/excel.service';

export interface SocailInfoDialogData {
  YearList: number[];
  id: number;
}

@Component({
  selector: 'app-social-info',
  templateUrl: './social-info.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./social-info.component.css']
})

export class SocialInfoComponent extends AppComponentBase  implements OnInit {
  Years: number[]=[1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2022,2023,2024,2025];
  YearOfSurvey: number[]=[];

  SocialInfosList:Dto_SocialInfoDetailListModel[]=[];
  constructor(
    injector: Injector,
    public _dialog: MatDialog,
    private _SocialInformationService: SocialInformationServiceProxy,
    private _commonService: CustomCommonService,
    private excelService:ExcelService,
  ) {
    super(injector);
  }

  projectName: string = "";
  projectId: string = "";
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;

  ngOnInit() {
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
    this.projectName =  this._commonService.getProjectName();
    this.projectId =this._commonService.getProjectid();
    this.getSocialinfoList();
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.SocialInfosList, 'Social');
 }

  isTableLoading: boolean = false;
  getSocialinfoList() {
    this.isTableLoading = true;
    this._SocialInformationService.getSocialInfoByProjectId(this.projectId)
    .pipe(
      finalize(() => {
        this.isTableLoading = false;
      }))
      .subscribe((result: Dto_SocialInfoDetailListModel[]) => {
        this.SocialInfosList = result;
        // console.log(result);
      }, (err) => {
        abp.notify.error("Error Please report us");
        // console.log("getEconomicInfoList ", err);
      });
  }

  addNewSocialInfoData(){
    this.YearOfSurvey=[];

    if(this.SocialInfosList.length > 0){
      for(let yr of this.Years){
        let Result = this.SocialInfosList.findIndex(x=>x.yearOfSurvey == yr);
        if(Result == -1){
          this.YearOfSurvey.push(yr);
        }
      }
    }else{
      this.YearOfSurvey = this.Years;
    }

    const dialogRef = this._dialog.open(SocialInfoDialogComponent, { width: '200%',
      data: { id: 0,YearList : this.YearOfSurvey }
    });
    // YearList: number[];
    // id: number;
    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ", result)
      if (result) {
        this.getSocialinfoList();
        // this.refresh();
      }
    });
  }

  editInfo(data: Dto_SocialInfoDetailListModel){
    this.YearOfSurvey=[];

    if(this.SocialInfosList.length > 0){
      for(let yr of this.Years){
        let Result = this.SocialInfosList.findIndex(x=>x.yearOfSurvey == yr);
        if(Result == -1){
          this.YearOfSurvey.push(yr);
        }
      }
      this.YearOfSurvey.push(data.yearOfSurvey);
    }else{
      this.YearOfSurvey = this.Years;
    }

    const dialogRef = this._dialog.open(SocialInfoDialogComponent, {
      data: { id: data.id,YearList : this.YearOfSurvey }
    });
    // YearList: number[];
    // id: number;
    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ", result)
      if (result) {
        this.getSocialinfoList();
        // this.refresh();
      }
    });
  }

}
