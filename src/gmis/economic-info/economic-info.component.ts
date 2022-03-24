import { finalize } from 'rxjs/operators';
import { EconomicInformationServiceProxy, Dto_EconomicInfo } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { ExcelService } from 'gmis/excel.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-economic-info',
  templateUrl: './economic-info.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./economic-info.component.css']
})

export class EconomicInfoComponent extends AppComponentBase implements OnInit {
  EconomicInfoList: Dto_EconomicInfo[] = [];
  CreateEconomicDto: Dto_EconomicInfo = new Dto_EconomicInfo();
  Years: number[] = [1980, 1981,
    1982,
    1983,
    1984,
    1985,
    1986,
    1987,
    1988,
    1989,
    1990,
    1991,
    1992,
    1993,
    1994,
    1995,
    1996,
    1997,
    1998,
    1999,
    2000,
    2001,
    2002,
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2022, 2023, 2024, 2025];
  CostingYear: number[] = [];

  constructor(
    injector: Injector,
    private _economicServiceProxy: EconomicInformationServiceProxy,
    private _commonService: CustomCommonService,
    private excelService: ExcelService,
    private fb: FormBuilder,
  ) {
    super(injector);
  }

  projectName: string = "";
  projectId: string = "";
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  ngOnInit() {
    this.NewEconomicFormInstance();

    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();
    this.getEconomicInfoList();
  }


  isTableLoading: boolean = false;
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.EconomicInfoList, 'Economic');
  }

  getEconomicInfoList() {
    this.isTableLoading = true;
    this._economicServiceProxy.getEconomicInfoListByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
          this.saving = false;
          this.getCostingYearList();
        }))
      .subscribe((result: Dto_EconomicInfo[]) => {
        this.EconomicInfoList = result;
        // this.createnewInstance();
      }, (err) => {
        abp.notify.error("Error Please report us");
        // console.log("getEconomicInfoList ", err);
      });
  }

  saving: boolean = false;

  save() {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          this.saving = true;
          this.CreateEconomicDto = new Dto_EconomicInfo();
          const projectModel: Dto_EconomicInfo = Object.assign(
            {},
            this.CreateEconomicDto,
            this.EconomicInfoForm.value
          );
          projectModel.projectId = this.projectId;

          // this.CreateEconomicDto.projectId = this.projectId;

          if (projectModel.id > 0) {
            this._economicServiceProxy.update(projectModel)
              .pipe(
                finalize(() => {
                  this.isTableLoading = false;
                  this.saving = false;
                })).subscribe((result: Dto_EconomicInfo) => {
                  let indexx = this.EconomicInfoList.findIndex(x => x.id == projectModel.id);
                  this.EconomicInfoList[indexx] = projectModel;
                  abp.notify.info("Saved Successfully");
                  // this.createnewInstance();
                }, (err) => {
                  abp.notify.error("Error Please report us");
                  console.log("update ", err);
                });
          } else {
            this._economicServiceProxy.create(projectModel)
              .pipe(
                finalize(() => {
                  this.isTableLoading = false;
                  this.saving = false;
                })).subscribe((result: Dto_EconomicInfo) => {
                  this.EconomicInfoList.push(result);
                  abp.notify.info("Saved Successfully");
                  this.EconomicInfoForm.patchValue({
                    id: result.id
                  });
                  // this.createnewInstance();
                }, (err) => {
                  abp.notify.error("Error Please report us");
                  console.log("create ", err);
                });
          }
        }
      });
  }

  editInfo(DtoObject: Dto_EconomicInfo) {
    this.CreateEconomicDto = new Dto_EconomicInfo();
    this.CreateEconomicDto = Object.assign({}, DtoObject);
    this.NewEconomicFormInstance();
    this.EconomicInfoForm.patchValue(this.CreateEconomicDto);

    this.CostingYear = [];
    for (let yr of this.Years) {
      let Result = this.EconomicInfoList.findIndex(x => x.costingYear == yr);
      if (Result == -1) {
        this.CostingYear.push(yr);
      }
    }
    this.CostingYear.push(DtoObject.costingYear);
  }

  getCostingYearList() {
    this.CostingYear = [];
    this.CreateEconomicDto = new Dto_EconomicInfo();

    if (this.EconomicInfoList.length > 0) {
      for (let yr of this.Years) {
        let Result = this.EconomicInfoList.findIndex(x => x.costingYear == yr);
        if (Result == -1) {
          this.CostingYear.push(yr);
        }
      }
    } else {
      this.CostingYear = this.Years;
    }
  }

  EconomicInfoForm: FormGroup;
  NewEconomicFormInstance() {
    this.EconomicInfoForm = this.fb.group({
      costingYear: ['', Validators.required],
      totalProjectCost: ['', Validators.required],
      eirr: ['', Validators.required],
      bC1: ['', Validators.required],
      discountRate1: ['', Validators.required],
      bC2: ['', Validators.required],
      discountRate2: ['', Validators.required],
      benefitWithoutProject: ['', Validators.required],
      benefitWithProject: ['', Validators.required],
      projectLife: ['', Validators.required],
      projectId: [this.projectId],
      id: [0],
    });
  }

  getNewFormInstance() {
    this.NewEconomicFormInstance();
    this.getCostingYearList();
  }

  MoneyValidator(frmCtrlName: string): void {
    var ress = this.EconomicInfoForm.get(frmCtrlName).value;
    var valid = /^\d{0,16}(\.\d{0,2})?$/.test(ress);
    if (!valid && ress != null) {
      ress = ress.substring(0, ress.length - 1);
    }
    // this.ContractMgmtForm.patchValue({ frmCtrlName: '' });
    this.EconomicInfoForm.controls[frmCtrlName].setValue(ress);
  }

  PercentValidator(frmCtrlName: string): void {
    var ress = this.EconomicInfoForm.get(frmCtrlName).value;
    var valid = /^\d{0,3}(\.\d{0,2})?$/.test(ress);
    if (!valid && ress != null) {
      ress = ress.substring(0, ress.length - 1);
    }
    if (ress > 100 || ress < 0) {
      ress = ress.substring(0, ress.length - 1);
    }
    // this.ContractMgmtForm.patchValue({ frmCtrlName: '' });
    this.EconomicInfoForm.controls[frmCtrlName].setValue(ress);
  }

}