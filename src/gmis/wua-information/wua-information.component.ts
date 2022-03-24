import { WUAInfoServiceProxy, WUATrainingsServiceProxy, Dto_WUAInfo, Dto_WUATraining } from './../../shared/service-proxies/service-proxies';
import { AppComponentBase } from 'shared/app-component-base';
import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import moment from 'moment';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { finalize } from 'rxjs/operators';
import { ExcelService } from 'gmis/excel.service';

@Component({
  selector: 'app-wua-information',
  templateUrl: './wua-information.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./wua-information.component.css']
})
export class WuaInformationComponent extends AppComponentBase implements OnInit {
  dto_WUAInfo: Dto_WUAInfo = new Dto_WUAInfo();
  dto_WUATraining: Dto_WUATraining = new Dto_WUATraining();
  dto_WUATrainings: Dto_WUATraining[] = [];

  constructor(
    injector: Injector,
    private _WUAInfoService: WUAInfoServiceProxy,
    private _WUATrainingService: WUATrainingsServiceProxy,
    private _commonService: CustomCommonService,
    private excelService: ExcelService,
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
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();

    this.getWUAInfo();
    this.getWUATrainingList();
    this.getNewTrainingInstance();
  }

  registrationDate: Date;
  RenewedUpDate: Date;
  today_date: Date = new Date();
  saving: boolean = false;

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.dto_WUATrainings, 'WUA');
  }

  getWUAInfo() {
    this._WUAInfoService.getWUAInfoDetailByProjectId(this.projectId)
      .subscribe((result: Dto_WUAInfo) => {
        // console.log(result);
        this.registrationDate = null;
        this.dto_WUAInfo = new Dto_WUAInfo();

        if (result.id > 0) {
          this.dto_WUAInfo = result;
          this.registrationDate = this.dto_WUAInfo.wuaRegistrationDate == null ? null : (this.dto_WUAInfo.wuaRegistrationDate).toDate();
          this.registrationDateSavedToDB = this.registrationDate;
          this.RenewedUpDate = this.dto_WUAInfo.wuaRenewdUpToDate == null ? null : (this.dto_WUAInfo.wuaRenewdUpToDate).toDate();

          //this.physicalProgressDate = this.dto_ContractManagement.physicalProgressDate == null ? null : (this.dto_ContractManagement.physicalProgressDate).toDate();
          //this.financialProgressDate = this.dto_ContractManagement.financialProgressDate == null ? null : (this.dto_ContractManagement.financialProgressDate).toDate();
        } else {
          this.dto_WUAInfo.id = 0;
          this.dto_WUAInfo.projectId = this.projectId;
          this.registrationDate = null;
          this.RenewedUpDate = null;
        }
      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getWUAInfo ", err);
        });
  }

  saveWUAInfo() {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          this.saving = true;

          // let hoursDiff = this.registrationDate.getHours() - this.registrationDate.getTimezoneOffset() / 60;
          // let minutesDiff = (this.registrationDate.getHours() - this.registrationDate.getTimezoneOffset()) % 60;
          // this.registrationDate.setHours(hoursDiff);
          // this.registrationDate.setMinutes(minutesDiff);

          // this.dto_WUAInfo.wuaRegistrationProgressDate =moment(this.registrationDate);
          this.dto_WUAInfo.wuaRegistrationDate = moment(this._commonService.DateConvertonMethod(this.registrationDate));
          this.dto_WUAInfo.wuaRenewdUpToDate = moment(this._commonService.DateConvertonMethod(this.RenewedUpDate));

          this.registrationDateSavedToDB = this.registrationDate;
          abp.ui.setBusy("#WUAInfoDiv");
          if (this.dto_WUAInfo.id > 0) {
            this._WUAInfoService.update(this.dto_WUAInfo)
              .pipe(
                finalize(() => {
                  this.saving = false;
                  abp.ui.clearBusy("#WUAInfoDiv");
                  this.registrationDateSavedToDB = this.registrationDate;
                }))
              .subscribe((result: Dto_WUAInfo) => {
                abp.notify.info("Saved Successfully");
              },
                (err) => {
                  abp.notify.error("Updated Error. Please report us");
                  console.log("getWUAInfo ", err);
                });
          } else {

            this._WUAInfoService.create(this.dto_WUAInfo)
              .pipe(
                finalize(() => {
                  this.saving = false;
                  abp.ui.clearBusy("#WUAInfoDiv");
                  this.registrationDateSavedToDB = this.registrationDate;
                }))
              .subscribe((result: Dto_WUAInfo) => {
                this.dto_WUAInfo.id = result.id;
                abp.notify.info("Saved Successfully");
              },
                (err) => {
                  abp.notify.error("Error Please report us");
                  console.log("getWUAInfo ", err);
                });
          }
        }
      });
    // this.getNewTrainingInstance();
  }

  saving1: boolean = false;

  registrationDateSavedToDB: Date = new Date();
  TrainingDate: Date = new Date();
  saveTrainings() {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          this.saving1 = true;
          this.dto_WUATraining.noOfParticipants
          this.dto_WUATraining.trainingDate = moment(this.TrainingDate);

          if (this.dto_WUATraining.id > 0) {
            this._WUATrainingService
              .update(this.dto_WUATraining)
              .pipe(
                finalize(() => {
                  this.saving1 = false;
                }))
              .subscribe((result: Dto_WUATraining) => {
                abp.notify.info("Update Successfully");
                this.saving1 = false;
              },
                (err) => {
                  abp.notify.error("Updated Error. Please report us");
                  console.log("getWUAInfo ", err);
                });
          } else {
            this.dto_WUATraining.projectId = this.projectId;
            this._WUATrainingService.create(this.dto_WUATraining)
              .pipe(
                finalize(() => {
                  this.saving1 = false;
                }))
              .subscribe((result: Dto_WUATraining) => {
                this.dto_WUATraining.id = result.id;
                abp.notify.info("Saved Successfully");
                this.saving1 = false;
                this.dto_WUATrainings.push(this.dto_WUATraining);
                // this.getNewTrainingInstance();
              },
                (err) => {
                  abp.notify.error("Error Please report us");
                  console.log("getWUATrainings ", err);
                });
          }
        }
      });
  }

  getNewTrainingInstance() {
    this.dto_WUATraining = new Dto_WUATraining();
    this.dto_WUATraining.projectId = this.projectId;
    this.TrainingDate = null;
    this.saving1 = false;
  }

  isTableLoading: boolean = false;
  getWUATrainingList() {
    this.isTableLoading = true;
    this._WUATrainingService
      .getWUATrainingsListByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        }))
      .subscribe((result: Dto_WUATraining[]) => {
        // console.log(result);
        this.dto_WUATrainings = [];
        this.dto_WUATrainings = result;
      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getWUATrainingList ", err);
        });
  }

  getTrainingDataForEdit(dto_WUATraining: Dto_WUATraining): void {
    this.getNewTrainingInstance();
    this.dto_WUATraining = dto_WUATraining;
    this.TrainingDate = this.dto_WUATraining.trainingDate == null ? null : (this.dto_WUATraining.trainingDate).toDate();

  }
}