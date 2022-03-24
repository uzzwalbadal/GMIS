import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ProjectInformationServiceProxy, Dto_ProjectInfo, LocationProjectWardRelationDetailDto, LocationWardRelationServiceProxy, Dto_LocationInfo, ProjectLocationInfoServiceProxy, SocialInformationServiceProxy, Dto_SocialInfoDetailListModel, Dto_AgricultreInfoDetailModel, AgricultreInfoServiceProxy, AgricultureDetailServiceProxy, Dto_AgricultureDetail, RiverHydrologyServiceProxy, Dto_RiverHydrology, HeadWorkServiceProxy, Dto_HeadWork, MainCanalServiceProxy, MainCanalViewModel, EconomicInformationServiceProxy, Dto_EconomicInfo, ContractManagementServiceProxy, Dto_ContractManagement } from '@shared/service-proxies/service-proxies';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { finalize } from 'rxjs/operators';
import { ProjectWardRelationListGeneralizedView } from 'gmis/location/Generalisedview.model';


@Component({
  selector: 'app-salientfeature',
  templateUrl: './salientfeature.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./salientfeature.component.css']
})
export class SalientfeatureComponent implements OnInit {

  constructor(
    private _projectInformationServiceProxy: ProjectInformationServiceProxy,
    private _commonService: CustomCommonService,
    private _WardRelationService: LocationWardRelationServiceProxy,
    private _projectLocationInfoService: ProjectLocationInfoServiceProxy,
    private _RiverHydrologyServiceProxy: RiverHydrologyServiceProxy,
    private _HeadWorkServiceProxy: HeadWorkServiceProxy,
    private _MainCanalServiceProxy: MainCanalServiceProxy,
    private _contractMgmtServiceProxy: ContractManagementServiceProxy,

    private _SocialInformationService: SocialInformationServiceProxy,
    private _agricultureServiceProxy: AgricultreInfoServiceProxy,
    private _AgricultureDetailServiceProxy: AgricultureDetailServiceProxy,
    private _economicServiceProxy: EconomicInformationServiceProxy,
    
  ) { }

  projectName: string = "";
  projectId: string = "";
  ngOnInit() {
    this.projectId =this._commonService.getProjectid();
    this.projectName =  this._commonService.getProjectName();
    this.projectInformationlist();
  }
  

  projectInformation: Dto_ProjectInfo = new Dto_ProjectInfo();
  projectInformationlist(): void {
    abp.ui.setBusy("#DataDiv");
    this._projectInformationServiceProxy.getProjectInformationByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("#DataDiv");
          this.getProjectWardList();
        })
      )
      .subscribe((result: Dto_ProjectInfo) => {
        if (result.id > 0) {
          this.projectInformation = new Dto_ProjectInfo();
          this.projectInformation = result;
        } else {
          this.projectInformation = new Dto_ProjectInfo();
          this.projectInformation.projectId = this.projectId;
        }
      });
  }
  export2Word() {

    var html, link, blob, url, css;

    css = (
               '<style>  table {   border-collapse: collapse;  border-style:none;  } .tables td,th{border:1px solid black;}' +
               //'@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
               //'div.WordSection1 {page: WordSection1;} ' +
               '</style>'
             );

     html = document.getElementById("tblPrint").outerHTML;
     blob = new Blob(['\ufeff', css + html], {
                 type: 'application/msword'
             });
     url = URL.createObjectURL(blob);
     link = document.createElement('A');
     link.href = url;
     link.download = 'Document';  // default name without extension 
     document.body.appendChild(link);
     if (navigator.msSaveOrOpenBlob) 
         navigator.msSaveOrOpenBlob(blob, 'Document.doc'); // IE10-11
     else link.click();  // other browsers
         document.body.removeChild(link);
};

  TestLists: ProjectWardRelationListGeneralizedView[] = [];
  ProjectWardRelations:LocationProjectWardRelationDetailDto[] = [];
  getProjectWardList() {
    this.ProjectWardRelations = [];
    this._WardRelationService.getAllProjectRelation(this.projectId)
      .pipe(
        finalize(() => {
          this.getLocationDetail();
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

  LocationInfoDto:Dto_LocationInfo = new Dto_LocationInfo();
  getLocationDetail() {
    abp.ui.setBusy('#LocationInfoDiv');
    this._projectLocationInfoService.getLocationInfoDetailByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#LocationInfoDiv');
          // this.getSocialinfoList();
          this.getRiverHydrologyInfo();
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

  RiverHydrologyDto: Dto_RiverHydrology = new Dto_RiverHydrology();
  getRiverHydrologyInfo(): void {
    this._RiverHydrologyServiceProxy.getRiverHydrologyInfoByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.getHeadWorksInfo();
        })
      )
      .subscribe((result: Dto_RiverHydrology) => {
        if (result.id > 0) {
          // console.log("Data Found RiverHydrology", result);
          this.RiverHydrologyDto = result;
        } else {
          this.RiverHydrologyDto = new Dto_RiverHydrology();
          this.RiverHydrologyDto.id = 0;
          this.RiverHydrologyDto.projectId = this.projectId;
          this.RiverHydrologyDto.floodDischarge100yrs
        }
      },
        (error) => {
          console.log("getRiverHydrologyInfo", error);
          abp.notify.error('Error in getting data. Please try again');
        });
  }

  Dto_HeadWork:Dto_HeadWork = new Dto_HeadWork();
  getHeadWorksInfo(): void {
    this._HeadWorkServiceProxy.getHeadWorksInfoByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#HeadWorksDiv');
          this.getMainCanalInfo();
        })
      )
      .subscribe((result: Dto_HeadWork) => {
        // console.log(result);
        if (result.id > 0) {
          this.Dto_HeadWork = result;
        }
      },
        (error) => {
          console.log("getHeadWorksInfo", error);
          abp.notify.error('Error in Getting data. Please try again');
        });
  }

  MainCanalLength: string="";
  MainCanalDischarge: string="";
  getMainCanalInfo():void{
    this._MainCanalServiceProxy.getMainCanalInfoByProjectId(this.projectId)
    .pipe(
      finalize(() => {
        abp.ui.clearBusy('#HeadWorksDiv');
        this.getContractMgmtData();
      })
    )
    .subscribe((result:MainCanalViewModel[]) => {
      for(let items of result){
        if(items.isCanalDirectionLeft){
          this.MainCanalDischarge += "Left "+ items.designDischarge;
          this.MainCanalLength += "Left "+ items.totalLength;
        }else{
          this.MainCanalDischarge += "Right "+ items.designDischarge;
          this.MainCanalLength += "Right "+ items.totalLength;
        }
      }
    },
      (error) => {
        console.log("getHeadWorksInfo", error);
        abp.notify.error('Error in Getting data. Please try again');
      });
  }

  dto_ContractManagement : Dto_ContractManagement = new  Dto_ContractManagement();
  getContractMgmtData() {
    this._contractMgmtServiceProxy.getContractManagementDetailByProjectId(this.projectId)
    .pipe(
      finalize(() => {
        this.getSocialinfoList();
      })
    )
      .subscribe((result: Dto_ContractManagement) => {
        this.dto_ContractManagement = new Dto_ContractManagement();

        if (result.id > 0) {
          this.dto_ContractManagement = result;
        }
      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getContractMgmtData ", err);
        });
  }
  
  

  SocialInfosList: Dto_SocialInfoDetailListModel[]=[];
  Dto_SocialInfoDetailListModel : Dto_SocialInfoDetailListModel = new Dto_SocialInfoDetailListModel();
  getSocialinfoList() {
    this._SocialInformationService.getSocialInfoByProjectId(this.projectId)
    .pipe(
      finalize(() => {
        this.getAgricultureDetail();
      }))
      .subscribe((result: Dto_SocialInfoDetailListModel[]) => {
        this.SocialInfosList = result;
        if(result.length > 0){
          this.Dto_SocialInfoDetailListModel = result.reduce(function (prev, current) {
                        return (prev.yearOfSurvey > current.yearOfSurvey) ? prev : current  });
        }
      }, (err) => {
        abp.notify.error("Error Please report us");
        // console.log("getEconomicInfoList ", err);
      });
  }

  Dto_AgricultureDetail:Dto_AgricultureDetail = new Dto_AgricultureDetail();
  getAgricultureDetail(): void {
    this._AgricultureDetailServiceProxy.getAgricultureDetailByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.getAgricultureList();
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

  NewCrop_AgricultreInfos:Dto_AgricultreInfoDetailModel[]=[];
  ExistingCrop_AgricultreInfos:Dto_AgricultreInfoDetailModel[]=[];
  getAgricultureList() {
    this.NewCrop_AgricultreInfos = [];
    this.ExistingCrop_AgricultreInfos = [];
    this._agricultureServiceProxy.getAgricultureInfoByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.getEconomicInfoList();
        })
      )
      .subscribe((result: Dto_AgricultreInfoDetailModel[]) => {
        if (result.length > 0) {
          this.NewCrop_AgricultreInfos = result.filter(x => x.isCropPatternExisting == false);
          console.log("New Crop", this.NewCrop_AgricultreInfos)
          this.ExistingCrop_AgricultreInfos = result.filter(x => x.isCropPatternExisting == true);
          console.log("Existing Crop", this.ExistingCrop_AgricultreInfos)
        }
      });
  }

  Dto_EconomicInfo :Dto_EconomicInfo = new Dto_EconomicInfo();
  getEconomicInfoList() {
    this._economicServiceProxy.getEconomicInfoListByProjectId(this.projectId)
      .pipe(
        finalize(() => {
        }))
      .subscribe((result: Dto_EconomicInfo[]) => {
          if(result.length > 0){
            this.Dto_EconomicInfo = result.reduce(function (prev, current) {
              return (prev.costingYear > current.costingYear) ? prev : current
           });
          }
      }, (err) => {
        abp.notify.error("Error Please report us");
      });
  }

}
