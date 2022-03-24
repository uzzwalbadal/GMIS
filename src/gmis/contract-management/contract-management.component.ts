import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ContractManagementServiceProxy, Dto_ContractManagement } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import moment from 'moment';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./contract-management.component.css']
})
export class ContractManagementComponent implements OnInit {
  dto_ContractManagement: Dto_ContractManagement = new Dto_ContractManagement();
  ContractMgmtForm: FormGroup;
  constructor(
    private _contractMgmtServiceProxy: ContractManagementServiceProxy,
    private _commonService: CustomCommonService,
    private fb: FormBuilder
  ) { }


  projectName: string = "";
  projectId: string = "";
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  ngOnInit() {
    this.NewFormInstance();

    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();

    this.getContractMgmtData();
    // this.NewFormInstance();
  }

  NewFormInstance() {
    this.ContractMgmtForm = this.fb.group({
      projectCost: ['', Validators.required],

      financialGON: ['', Validators.required],
      financialWUA: ['', Validators.required],
      financialDonar: ['', Validators.required],
      financialOthers: ['', Validators.required],

      icbNumber: ['', Validators.required],
      icbEstimatedCost: ['', Validators.required],
      ncbNumber: ['', Validators.required],
      ncbEstimatedCost: ['', Validators.required],
      wuaNumber: ['', Validators.required],
      wuaEstimatedCost: ['', Validators.required],

      contractId: ['', Validators.required],
      contractorName: ['', Validators.required],
      contractName: ['', Validators.required],
      agreementDate: ['', Validators.required],
      contractType: ['', Validators.required],
      contractMethod: ['', Validators.required],

      isVariation: ['', Validators.required],
      initialContractAmnt: [''],
      variationAmnt: [''],
      finalContractAmnt: [''],
      contractVariationApprovedDate: [''],
      contractStatus: [''],
      noOfTimesExtension: [''],
      contractVariationApprovedBy: [''],
      reasonsForContractVariation: [''],

      physicalProgressNote: ['', Validators.required],
      physicalProgressPercent: ['', Validators.required],
      physicalProgressDate: ['', Validators.required],
      financialProgressNote: ['', Validators.required],
      financialProgressPercent: ['', Validators.required],
      financialProgressAmount: ['', Validators.required],
      financialProgressDate: ['', Validators.required],

      isTimeVariation: ['', Validators.required],
      timeVariationInitialDueDate: [''],
      timeVariationExtendedDueDate: [''],
      timeVariationApprovedDate: [''],
      noOfTimeExtension: [''],
      timeVariationApprovedBy: [''],
      reasonsForTimeExtension: [''],

      projectId: [this.projectId],
      id: [0],
    });
  }

  onVariationChange(selectedValue: string): void {
    const initialContractAmntControl = this.ContractMgmtForm.get('initialContractAmnt');
    const variationAmntControl = this.ContractMgmtForm.get('variationAmnt');
    const finalContractAmntControl = this.ContractMgmtForm.get('finalContractAmnt');
    const noOfTimesExtensionControl = this.ContractMgmtForm.get('noOfTimesExtension');
    const contractVariationApprovedDateControl = this.ContractMgmtForm.get('contractVariationApprovedDate');
    const contractStatusControl = this.ContractMgmtForm.get('contractStatus');
    const contractVariationApprovedByControl = this.ContractMgmtForm.get('contractVariationApprovedBy');
    const reasonsForContractVariationControl = this.ContractMgmtForm.get('reasonsForContractVariation');

    initialContractAmntControl.clearValidators();
    variationAmntControl.clearValidators();
    finalContractAmntControl.clearValidators();
    noOfTimesExtensionControl.clearValidators();
    contractVariationApprovedDateControl.clearValidators();
    contractStatusControl.clearValidators();
    contractVariationApprovedByControl.clearValidators();
    reasonsForContractVariationControl.clearValidators();

    if (selectedValue) {
      initialContractAmntControl.setValidators([Validators.required]);
      variationAmntControl.setValidators([Validators.required]);
      finalContractAmntControl.setValidators([Validators.required]);
      noOfTimesExtensionControl.setValidators([Validators.required]);
      contractVariationApprovedDateControl.setValidators([Validators.required]);
      contractStatusControl.setValidators([Validators.required]);
      contractVariationApprovedByControl.setValidators([Validators.required]);
      reasonsForContractVariationControl.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
    }
    initialContractAmntControl.updateValueAndValidity();
    variationAmntControl.updateValueAndValidity();
    finalContractAmntControl.updateValueAndValidity();
    noOfTimesExtensionControl.updateValueAndValidity();
    contractVariationApprovedDateControl.updateValueAndValidity();
    contractStatusControl.updateValueAndValidity();
    contractVariationApprovedByControl.updateValueAndValidity();
    reasonsForContractVariationControl.updateValueAndValidity();
  }

  // onTimeVariationChange
  onTimeVariationChange(events: MatRadioChange): void {
    // console.log($event);

    const timeVariationInitialDueDateControl = this.ContractMgmtForm.get('timeVariationInitialDueDate');
    const timeVariationExtendedDueDateControl = this.ContractMgmtForm.get('timeVariationExtendedDueDate');
    const timeVariationApprovedDateControl = this.ContractMgmtForm.get('timeVariationApprovedDate');
    const noOfTimeExtensionControl = this.ContractMgmtForm.get('noOfTimeExtension');
    const timeVariationApprovedByControl = this.ContractMgmtForm.get('timeVariationApprovedBy');
    const reasonsForTimeExtensionControl = this.ContractMgmtForm.get('reasonsForTimeExtension');

    timeVariationInitialDueDateControl.clearValidators();
    timeVariationExtendedDueDateControl.clearValidators();
    timeVariationApprovedDateControl.clearValidators();
    noOfTimeExtensionControl.clearValidators();
    timeVariationApprovedByControl.clearValidators();
    reasonsForTimeExtensionControl.clearValidators();

    if (events.value) {
      timeVariationInitialDueDateControl.setValidators([Validators.required]);
      timeVariationExtendedDueDateControl.setValidators([Validators.required]);
      timeVariationApprovedDateControl.setValidators([Validators.required]);
      noOfTimeExtensionControl.setValidators([Validators.required]);
      timeVariationApprovedByControl.setValidators([Validators.required]);
      reasonsForTimeExtensionControl.setValidators([Validators.required]);
    }

    timeVariationInitialDueDateControl.updateValueAndValidity();
    timeVariationExtendedDueDateControl.updateValueAndValidity();
    timeVariationApprovedDateControl.updateValueAndValidity();
    noOfTimeExtensionControl.updateValueAndValidity();
    timeVariationApprovedByControl.updateValueAndValidity();
    reasonsForTimeExtensionControl.updateValueAndValidity();
  }

  saving: boolean = false;
  save() {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          this.saving = true;
          // console.log("hi");

          this.dto_ContractManagement = new Dto_ContractManagement();
          const projectModel: Dto_ContractManagement = Object.assign(
            {},
            this.dto_ContractManagement,
            this.ContractMgmtForm.value
          );
          projectModel.projectId = this.projectId;


          try {
            // projectModel.agreementDate = moment(this.ContractMgmtForm.controls.agreementDate.value);
            projectModel.agreementDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.agreementDate.value));
            projectModel.physicalProgressDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.physicalProgressDate.value));
            projectModel.financialProgressDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.financialProgressDate.value));

            // projectModel.dueDateOfCompletion = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.dueDateOfCompletion.value));

            // projectModel.physicalProgressDate = moment(this.ContractMgmtForm.controls.physicalProgressDate.value);
            // projectModel.physicalProgressDate = moment(this.physicalProgressDate);
            // projectModel.financialProgressDate = moment(this.ContractMgmtForm.controls.financialProgressDate.value);
            // projectModel.financialProgressDate = moment(this.financialProgressDate);
            if (projectModel.isVariation) {
              // projectModel.dueDate = moment(this.dueDate);
              // projectModel.dueDate = moment(this.ContractMgmtForm.controls.dueDate.value);
              // projectModel.dueDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.dueDate.value));
              projectModel.contractVariationApprovedDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.contractVariationApprovedDate.value));
            } else {
              projectModel.contractVariationApprovedDate = null;
            }

            if (projectModel.isTimeVariation) {
              projectModel.timeVariationInitialDueDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.timeVariationInitialDueDate.value));
              projectModel.timeVariationExtendedDueDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.timeVariationExtendedDueDate.value));
              projectModel.timeVariationApprovedDate = moment(this._commonService.DateConvertonMethod(this.ContractMgmtForm.controls.timeVariationApprovedDate.value));
            } else {
              projectModel.timeVariationInitialDueDate = null;
              projectModel.timeVariationExtendedDueDate = null;
              projectModel.timeVariationApprovedDate = null;
            }

          } catch (error) {
            abp.notify.error('Date Conversion Error');
          }

          if (projectModel.id > 0) {
            this._contractMgmtServiceProxy.update(projectModel)
              .subscribe((result: Dto_ContractManagement) => {
                abp.notify.info("Updated Successfully");
                this.saving = false;

              },
                (err) => {
                  abp.notify.error("Error in Update Please report us");
                  console.log("updateMgmtData ", err);
                });
          } else {
            // projectModel.projectId = this.projectId;

            this._contractMgmtServiceProxy.create(projectModel)
              .subscribe((result: Dto_ContractManagement) => {
                // console.log("Response from save",result);
                // projectModel.id = result.id;
                this.ContractMgmtForm.patchValue({
                  id: result.id
                });
                abp.notify.info("Saved Successfully");
                this.saving = false;
              },
                (err) => {
                  abp.notify.error("Error in Create Please report us");
                  console.log("SaveMgmtData ", err);
                });
          }
        }
      });
    // console.log(projectModel);

    // console.log(this.dto_ContractManagement);

  }

  // physicalProgressDate: Date = new Date();
  // financialProgressDate: Date = new Date();
  // agreementDate: Date = new Date();
  // approvedDate: Date = new Date();

  today_date: Date = new Date();

  // initialdueDate: Date = new Date();
  // extendeddueDate: Date = new Date();
  // extensionApprovedDate: Date = new Date();


  getContractMgmtData() {
    this._contractMgmtServiceProxy.getContractManagementDetailByProjectId(this.projectId)
      .subscribe((result: Dto_ContractManagement) => {
        this.dto_ContractManagement = new Dto_ContractManagement();

        if (result.id > 0) {
          this.dto_ContractManagement = result;

          this.ContractMgmtForm.patchValue(this.dto_ContractManagement);
          if (this.dto_ContractManagement.isVariation) {
            this.ContractMgmtForm.patchValue({ contractVariationApprovedDate: this.dto_ContractManagement.contractVariationApprovedDate == null ? null : (this.dto_ContractManagement.contractVariationApprovedDate).toDate() });
          } else {
            // console.log("patch value");
            this.ContractMgmtForm.patchValue({ contractVariationApprovedDate: '' });
          }

          this.ContractMgmtForm.patchValue({ agreementDate: this.dto_ContractManagement.agreementDate == null ? null : (this.dto_ContractManagement.agreementDate).toDate() });
          this.ContractMgmtForm.patchValue({ physicalProgressDate: this.dto_ContractManagement.physicalProgressDate == null ? null : (this.dto_ContractManagement.physicalProgressDate).toDate() });
          this.ContractMgmtForm.patchValue({ financialProgressDate: this.dto_ContractManagement.financialProgressDate == null ? null : (this.dto_ContractManagement.financialProgressDate).toDate() });

          if (this.dto_ContractManagement.isTimeVariation) {
            this.ContractMgmtForm.patchValue({ timeVariationInitialDueDate: this.dto_ContractManagement.timeVariationInitialDueDate == null ? null : (this.dto_ContractManagement.timeVariationInitialDueDate).toDate() });
            this.ContractMgmtForm.patchValue({ timeVariationExtendedDueDate: this.dto_ContractManagement.timeVariationExtendedDueDate == null ? null : (this.dto_ContractManagement.timeVariationExtendedDueDate).toDate() });
            this.ContractMgmtForm.patchValue({ timeVariationApprovedDate: this.dto_ContractManagement.timeVariationApprovedDate == null ? null : (this.dto_ContractManagement.timeVariationApprovedDate).toDate() });
          } else {
            this.ContractMgmtForm.patchValue({ timeVariationInitialDueDate: '' });
            this.ContractMgmtForm.patchValue({ timeVariationExtendedDueDate: '' });
            this.ContractMgmtForm.patchValue({ timeVariationApprovedDate: '' });
          }

        } else {
          // this.physicalProgressDate = null;
          // this.financialProgressDate = null;
          // this.agreementDate = null;
          // this.approvedDate = null;

          // this.initialdueDate = null;
          // this.extendeddueDate = null;
          // this.extensionApprovedDate = null;
        }

      },
        (err) => {
          abp.notify.error("Error Please report us");
          console.log("getContractMgmtData ", err);
        });
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  MoneyValidator(frmCtrlName: string): void {
    var ress = this.ContractMgmtForm.get(frmCtrlName).value;
    var valid = /^\d{0,16}(\.\d{0,2})?$/.test(ress);
    if (!valid && ress != null) {
      ress = ress.substring(0, ress.length - 1);
    }
    // this.ContractMgmtForm.patchValue({ frmCtrlName: '' });
    this.ContractMgmtForm.controls[frmCtrlName].setValue(ress);
  }

  PercentValidator(frmCtrlName: string): void {
    var ress = this.ContractMgmtForm.get(frmCtrlName).value;
    var valid = /^\d{0,3}(\.\d{0,2})?$/.test(ress);
    if (!valid && ress != null) {
      ress = ress.substring(0, ress.length - 1);
    }
    if (ress > 100 || ress < 0) {
      ress = ress.substring(0, ress.length - 1);
    }
    // this.ContractMgmtForm.patchValue({ frmCtrlName: '' });
    this.ContractMgmtForm.controls[frmCtrlName].setValue(ress);
  }

  //   $("#amount").on("keyup", function(){
  //     var valid = /^\d{0,4}(\.\d{0,2})?$/.test(this.value),
  //         val = this.value;

  //     if(!valid){
  //         console.log("Invalid input!");
  //         this.value = val.substring(0, val.length - 1);
  //     }
  // });

}