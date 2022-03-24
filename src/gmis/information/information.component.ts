import { AppConsts } from '@shared/AppConsts';
import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Dto_ProjectInfo, ProjectInformationServiceProxy, ProjectInformationInitals, Dto_ProgramType, Dto_ProjectStatus, Dto_ProgramInformation, DocumentServiceProxy, ListResultDtoOfDocumentDto, DocumentDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import moment from 'moment';
import { MatDialog } from '@angular/material';
import { DocumentUploadComponent } from 'gmis/document-upload/document-upload.component';
import { CustomCommonService } from '@shared/dateconvertor.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./information.component.css']
})

export class InformationComponent implements OnInit {
  projectName: string = "";
  projectId: string = "";
  projecttType: string = "";
  projectInformation: Dto_ProjectInfo = new Dto_ProjectInfo();
  saving = false;

  baseUrl: string;

  constructor(
    public dialog: MatDialog,
    private _dialog: MatDialog,
    private _documentServiceProxy: DocumentServiceProxy,
    private _projectInformationServiceProxy: ProjectInformationServiceProxy,
    private _commonService: CustomCommonService,
  ) { }

  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;

  ngOnInit() {
    this.baseUrl = AppConsts.remoteServiceBaseUrl;
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();

    this._projectInformationServiceProxy.getAllProjectInfosInitials()
      .subscribe((result: ProjectInformationInitals) => {
        this.programTypes = result.programTypeList;
        this.projectStatus = result.projectStatusList;
        this.programInformation = result.programInformationList;
      });

    this.projectInformationlist();
    this.refresh();

  }

  UploadProjectInfoDocument() {
    let projectHelperDialog;
    projectHelperDialog = this._dialog.open(DocumentUploadComponent, {
      data: "1"
    });

    projectHelperDialog.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  DocumentsList: DocumentDto[] = [];
  refresh() {
    abp.ui.setBusy("#DocumentListDiv");
    this._documentServiceProxy.getDocumentListByProjectidAndDocType(this.projectId, 1)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("#DocumentListDiv");
        })
      ).subscribe((result: ListResultDtoOfDocumentDto) => {
        // this.projects = result.items;
        this.DocumentsList = result.items;
        // console.log(this.DocumentsList)
      });
  }

  projectInformationlist(): void {
    abp.ui.setBusy("#DataDiv");
    this.saving = true;
    this._projectInformationServiceProxy.getProjectInformationByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("#DataDiv");
          this.saving = false;
        })
      )
      .subscribe((result: Dto_ProjectInfo) => {
        // console.log(result);
        if (result.id > 0) {
          // console.log("Data Found");
          this.projectInformation = new Dto_ProjectInfo();
          this.projectInformation = result;
          this.approvedDate = this.projectInformation.approved_date == null ? null : (this.projectInformation.approved_date).toDate();
          this.end_date = this.projectInformation.end_date == null ? null : (this.projectInformation.end_date).toDate();
          this.start_date = this.projectInformation.start_date == null ? null : (this.projectInformation.start_date).toDate();
        } else {
          this.projectInformation = new Dto_ProjectInfo();
          this.projectInformation.projectId = this.projectId;
          this.projectInformation.donarCountriesName = "";
          this.projectInformation.donarCountriesOthersName = "";
        }

      });
  }

  programTypes: Dto_ProgramType[] = [];
  projectStatus: Dto_ProjectStatus[] = [];
  programInformation: Dto_ProgramInformation[] = [];

  approvedDate: Date = null;
  end_date: Date = null;
  start_date: Date = null;
  today_date: Date = new Date();

  save(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          this.saving = true;

          try {
            this.projectInformation.approved_date = moment(this._commonService.DateConvertonMethod(this.approvedDate));
            this.projectInformation.start_date = moment(this._commonService.DateConvertonMethod(this.start_date));
          } catch (error) {
            abp.notify.error('Date Conversion Error');
          }

          if (this.projectInformation.isPhaseCompleted) {
            try {
              this.projectInformation.end_date = moment(this._commonService.DateConvertonMethod(this.end_date));
            } catch (error) {
              abp.notify.error('Date Conversion Error');
            }
          }

          if (this.projectInformation.id > 0) {
            this._projectInformationServiceProxy
              .update(this.projectInformation)
              .pipe(
                finalize(() => {
                  this.saving = false;
                })
              )
              .subscribe((result) => {
                abp.notify.info('Project Updated Successfully');
              });
          } else {
            this._projectInformationServiceProxy
              .create(this.projectInformation)
              .pipe(
                finalize(() => {
                  this.saving = false;
                })
              )
              .subscribe((result) => {
                this.projectInformation = result;
                abp.notify.info('Project Added Successfully');
              });
          }

        }
      });
  }

}