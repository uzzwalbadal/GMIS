import { SocialInformationServiceProxy, Dto_SocialInfo, Dto_EthicsDataViewModel, Dto_SocialInfoDataModel, EthicInformationServiceProxy, PagedResultDtoOfDto_EthicsInformation, Dto_EthicsInformation, Dto_SocialInfoDetailListModel } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { SocailInfoDialogData } from '../social-info.component';
import { CustomCommonService } from '@shared/dateconvertor.service';

@Component({
    templateUrl: 'social-info-dialog.component.html',
    styles: [
        `.mat-radio-button ~ .mat-radio-button {
            margin-left: 56px; margin-top: 10px; 
        } 
        .example-container {
            display: flex; 
            flex-direction: column;
         }
      `
    ]
})

export class SocialInfoDialogComponent extends AppComponentBase implements OnInit {
    YearOfSurvey: number[] = [];
    saving = false;
    dto_socialInfo: Dto_SocialInfo = new Dto_SocialInfo();
    dto_EthicsModel: Dto_EthicsDataViewModel[] = [];
    DTO_SocailInfoModel: Dto_SocialInfoDataModel = new Dto_SocialInfoDataModel();

    EthicsGrps: Dto_EthicsInformation[] = [];
    EthicsGrpsToShow: Dto_EthicsInformation[] = [];

    constructor(
        injector: Injector,
        private _SocialInformationService: SocialInformationServiceProxy,
        private _ethicInformationServiceProxy: EthicInformationServiceProxy,
        private _dialogRef: MatDialogRef<SocialInfoDialogComponent>,
        private _commonService: CustomCommonService,
        @Inject(MAT_DIALOG_DATA) public datas: SocailInfoDialogData
    ) {
        super(injector);
    }

    onNoClick(): void {
        this._dialogRef.close();
    }

    projectId: string = "";
    ShowSaveBtn: boolean = false;
    ShowUpdateBtn: boolean = false;
    ngOnInit(): void {
        this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
        this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();
        this.projectId = this._commonService.getProjectid();

        this.YearOfSurvey = this.datas.YearList;

        this._ethicInformationServiceProxy.getAll(1000, 0)
            .pipe(
                finalize(() => {
                    this.OnInitSecondPhase();
                })
            )
            .subscribe((result: PagedResultDtoOfDto_EthicsInformation) => {
                this.EthicsGrps = result.items;
                if (result.totalCount == 0) {
                    abp.notify.error("Please add ethics groups");
                    this.close(true);
                }
            }, (err) => {
                abp.notify.error("Server Error. Please report us");
                console.log("OnInit ", err);
                this.close(true);
            }
            );
    }

    OnInitSecondPhase() {
        if (this.datas.id > 0) {
            abp.ui.setBusy('#Myform');
            this._SocialInformationService.getSocialInfoById(this.datas.id)
                .pipe(
                    finalize(() => {
                        abp.ui.clearBusy('#Myform');
                        this.CreateNewEthicsInstance();
                        this.PeopleCount = this.dto_socialInfo.noOfHousehold;
                        this.calculateHouseOwner();
                        this.calculatefarmsizeTotal();
                    })
                )
                .subscribe((result: Dto_SocialInfoDetailListModel) => {
                    if (result.id > 0) {
                        this.dto_EthicsModel = result.ethicsGroupData;
                        this.dto_socialInfo = result;
                    } else {
                        this.notify.error("Error in Loading data. Please report us.");
                    }
                });
        } else {
            // console.log("create  Mode ");
            this.dto_socialInfo.projectId = this.projectId;
            this.dto_socialInfo.id = 0;
            this.dto_socialInfo.totalPopulation = 0;
            this.dto_socialInfo.averageFamilySize = 0;
            this.dto_socialInfo.landOwners = 0;
            this.dto_socialInfo.tenants = 0;
            this.dto_socialInfo.landless = 0;
            this.dto_socialInfo.ownerWithTenants = 0;

            this.dto_socialInfo.annualIncomePerAgriculture = 0;
            this.dto_socialInfo.annualIncomePerFamily = 0;
            this.dto_socialInfo.annualIncomePerOtherSrcs = 0;

            this.dto_socialInfo.male = 0;
            this.dto_socialInfo.female = 0;

            this.dto_socialInfo.maleLiteracyRate = 0;
            this.dto_socialInfo.femaleLiteracyRate = 0;

            this.dto_socialInfo.farmSizeLarge = 0;
            this.dto_socialInfo.farmSizeMedium = 0;
            this.dto_socialInfo.farmSizeSmall = 0;
            this.dto_socialInfo.farmSizeVeryLarge = 0;
            this.CreateNewEthicsInstance();
        }

    }

    CreateNewEthicsInstance() {
        this.EthicsGrpsToShow = [];
        if (this.dto_EthicsModel.length > 0) {
            for (let yr of this.EthicsGrps) {
                let Result = this.dto_EthicsModel.findIndex(x => x.ethicsGroupId == yr.id);
                if (Result == -1) {
                    this.EthicsGrpsToShow.push(yr);
                }
            }
        } else {
            // console.log("else");
            this.EthicsGrpsToShow = this.EthicsGrps;
        }

        // console.log("this.EthicsGrpsToShow ", this.EthicsGrpsToShow);
    }

    SelectEthnics: number = 0;
    PeopleCount: number = 0;
    addEthicsToList() {
        let dtos = new Dto_EthicsDataViewModel();
        dtos.id = 0;
        dtos.socialInfoId = 0;
        dtos.noOfPeople = this.TotalNoOfPeople;
        dtos.noOfPeoplePercent = 0;
        dtos.ethicsGroupId = this.SelectEthnics;
        let r = this.EthicsGrps.findIndex(x => x.id == this.SelectEthnics);
        if (r == -1) {
            abp.notify.error("Internal Error.. Please report us");
        }
        dtos.ethicsGroupName = this.EthicsGrps[r].name;
        this.PeopleCount = this.PeopleCount + this.TotalNoOfPeople;

        this.dto_EthicsModel.push(dtos);

        this.TotalNoOfPeople = null;
        this.isDisableAddEthicButton = true;
        this.SelectEthnics = 0;

        // console.log(this.dto_EthicsModel);
        this.CreateNewEthicsInstance();
        this.calculatePercentageEthicGroup();

    }

    tempValue: number = 0;
    focusOutFunction() {
        this.isDisableAddEthicButton = true;
        this.tempValue = 0;
        if (this.TotalNoOfPeople > 0) {
            this.tempValue = this.PeopleCount + this.TotalNoOfPeople;
            // console.log("total counts ", this.tempValue);

            if (this.tempValue > this.dto_socialInfo.noOfHousehold) {
                this.isDisableAddEthicButton = true;
                abp.notify.warn("No of People exced total no of Household");
                this.TotalNoOfPeople = this.dto_socialInfo.noOfHousehold - this.PeopleCount;
            } else {
                this.isDisableAddEthicButton = false;
                // abp.notify.info("Focous out event called " + this.dto_socialInfo.totalPopulation);
            }
        }
    }

    calculatePercentageEthicGroup() {
        if (this.dto_EthicsModel.length > 0) {
            for (let ethics of this.dto_EthicsModel) {
                let r = ((ethics.noOfPeople / this.PeopleCount) * 100);
                ethics.noOfPeoplePercent = parseFloat(r.toFixed(2));
            }
        }
    }

    isDisableAddEthicButton: boolean = true;
    TotalNoOfPeople: number = 0;

    save(): void {
        abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
        (result: boolean) => {
          if (result) {

        this.DTO_SocailInfoModel.ethicsDataModel = this.dto_EthicsModel;
        this.DTO_SocailInfoModel.socialInfoDataModel = this.dto_socialInfo;
        // console.log(this.DTO_SocailInfoModel);

        this._SocialInformationService.saveSocialInfoData(this.DTO_SocailInfoModel)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe((result: any) => {
                if (result == 1) {
                    if (this.dto_socialInfo.id > 0) {
                        this.notify.success("Updated Successfully");
                    } else {
                        this.notify.info(this.l('Added Successfully'));
                    }
                    this.close(true);
                } else {
                    this.notify.error("Error in saving data. Reload and Please try again");
                }
            });
        }});
    }

    close(result: any): void {
        this._dialogRef.close(result);
    }

    annualIncomePerFamilyFocusOut(): void {
        this.calculateOtherSourceIncome();
        this.calculateAverageAnnualIncomePerFamily();
    }

    calculateOtherSourceIncome(): void {
        let fromFamily: number = 0;
        let fromAgriculture: number = 0;
        if (this.dto_socialInfo.annualIncomePerAgriculture != null && this.dto_socialInfo.annualIncomePerAgriculture != undefined && this.dto_socialInfo.annualIncomePerAgriculture != 0) {
            fromAgriculture = this.dto_socialInfo.annualIncomePerAgriculture;
        }

        if (this.dto_socialInfo.annualIncomePerFamily != null && this.dto_socialInfo.annualIncomePerFamily != undefined && this.dto_socialInfo.annualIncomePerFamily != 0) {
            fromFamily = this.dto_socialInfo.annualIncomePerFamily;
        }

        if (fromAgriculture > 0) {
            this.dto_socialInfo.annualIncomePerOtherSrcs = this.dto_socialInfo.annualIncomePerFamily - this.dto_socialInfo.annualIncomePerAgriculture;
        } else {
            this.dto_socialInfo.annualIncomePerOtherSrcs = 0;
            this.dto_socialInfo.annualIncomePerAgriculture = 0;
        }
    }

    OtherSourceIncome(): void {
        if (this.dto_socialInfo.annualIncomePerAgriculture > this.dto_socialInfo.annualIncomePerFamily) {
            this.dto_socialInfo.annualIncomePerAgriculture = this.dto_socialInfo.annualIncomePerFamily;
        }
        this.calculateOtherSourceIncome();
    }

    NoOfHouseHoldFocusOut(): void {
        this.calculateAverageAnnualIncomePerFamily();
        this.calculateAverageFamilySize();
    }

    calculateAverageAnnualIncomePerFamily(): void {
        let result: number = 0;
        if (this.dto_socialInfo.noOfHousehold > 0 && this.dto_socialInfo.annualIncomePerFamily > 0) {
            let r = this.dto_socialInfo.annualIncomePerFamily / this.dto_socialInfo.noOfHousehold;
            result = parseFloat(r.toFixed(2));
        }
        this.dto_socialInfo.averageAnnualIncomePerFamily = result;
    }

    landOwnerTotal: number = 0;
    calculateHouseOwner() {
        let totals = this.dto_socialInfo.landOwners + this.dto_socialInfo.ownerWithTenants + this.dto_socialInfo.landless + this.dto_socialInfo.tenants;
        if (totals > this.dto_socialInfo.noOfHousehold) {
            this.dto_socialInfo.landOwners = 0;
            this.dto_socialInfo.tenants = 0;
            this.dto_socialInfo.landless = 0;
            this.dto_socialInfo.ownerWithTenants = 0;
            abp.notify.warn("Land owner total exceed total no Of household. All Value Reseted to 0");
            this.landOwnerTotal =0;
        }
        if (totals != null && totals != undefined && totals != 0) {

            this.landOwnerTotal = totals;
            let landOwner = (this.dto_socialInfo.landOwners / totals) * 100;
            this.dto_socialInfo.landOwnersPercent = parseFloat(landOwner.toFixed(2));

            let tenants = (this.dto_socialInfo.tenants / totals) * 100;
            this.dto_socialInfo.tenantsPercent = parseFloat(tenants.toFixed(2));

            let landless = (this.dto_socialInfo.landless / totals) * 100;
            this.dto_socialInfo.landlessPercent = parseFloat(landless.toFixed(2));

            let ownerwithtenants = (this.dto_socialInfo.ownerWithTenants / totals) * 100;
            this.dto_socialInfo.ownerWithTenantsPercent = parseFloat(ownerwithtenants.toFixed(2));
        }
    }

    farmsizeTotal: number = 0;
    calculatefarmsizeTotal() {
        let totals = this.dto_socialInfo.farmSizeSmall + this.dto_socialInfo.farmSizeMedium + this.dto_socialInfo.farmSizeLarge + this.dto_socialInfo.farmSizeVeryLarge;

        if (totals > this.dto_socialInfo.noOfHousehold) {
            this.dto_socialInfo.farmSizeSmall = 0;
            this.dto_socialInfo.farmSizeMedium = 0;
            this.dto_socialInfo.farmSizeLarge = 0;
            this.dto_socialInfo.farmSizeVeryLarge = 0;
            abp.notify.warn("Farmsize total exceed total no Of household. All Value Reseted to 0");
            this.farmsizeTotal = 0;
        }

        if (totals != null && totals != undefined && totals != 0) {

            this.farmsizeTotal = totals;
            let farmSizeSmall = (this.dto_socialInfo.farmSizeSmall / totals) * 100;
            this.dto_socialInfo.farmSizeSmallPercent = parseFloat(farmSizeSmall.toFixed(2));

            let farmSizeMedium = (this.dto_socialInfo.farmSizeMedium / totals) * 100;
            this.dto_socialInfo.farmSizeMediumPercent = parseFloat(farmSizeMedium.toFixed(2));

            let farmSizeLarge = (this.dto_socialInfo.farmSizeLarge / totals) * 100;
            this.dto_socialInfo.farmSizeLargePercent = parseFloat(farmSizeLarge.toFixed(2));

            let farmSizeVeryLarge = (this.dto_socialInfo.farmSizeVeryLarge / totals) * 100;
            this.dto_socialInfo.farmSizeVeryLargePercent = parseFloat(farmSizeVeryLarge.toFixed(2));
        }
    }

    changeFemaleCount() {
        if (this.dto_socialInfo.female != null && this.dto_socialInfo.female != undefined && this.dto_socialInfo.female != 0) {
            this.dto_socialInfo.totalPopulation = this.dto_socialInfo.male + this.dto_socialInfo.female;
            this.calculateAverageFamilySize();
        }
    }
    changeMaleCount() {
        if (this.dto_socialInfo.male != null && this.dto_socialInfo.male != undefined && this.dto_socialInfo.male != 0) {
            this.dto_socialInfo.totalPopulation = this.dto_socialInfo.male + this.dto_socialInfo.female;
            this.calculateAverageFamilySize();
        }
    }

    calculateAverageFamilySize() {
        let finalValue = 0;
        if (this.dto_socialInfo.noOfHousehold > 0 && this.dto_socialInfo.totalPopulation > 0) {
            let farmSizeVeryLarge = (this.dto_socialInfo.totalPopulation / this.dto_socialInfo.noOfHousehold);
            finalValue = parseFloat(farmSizeVeryLarge.toFixed(2));
        }
        this.dto_socialInfo.averageFamilySize = finalValue;
    }

    changeWomenHeadHouse() {
        if (this.dto_socialInfo.noOfHousehold != null && this.dto_socialInfo.womenHeadedHouseHold != null && this.dto_socialInfo.noOfHousehold != undefined && this.dto_socialInfo.noOfHousehold != 0) {
            if (this.dto_socialInfo.womenHeadedHouseHold > this.dto_socialInfo.noOfHousehold) {
                this.dto_socialInfo.womenHeadedHouseHold = this.dto_socialInfo.noOfHousehold;
            }
        }
    }

    changeFemalePercentage() {
        if (this.dto_socialInfo.femaleLiteracyRate != null && this.dto_socialInfo.femaleLiteracyRate != undefined && this.dto_socialInfo.femaleLiteracyRate != 0 && this.dto_socialInfo.femaleLiteracyRate <= 100) {
            this.dto_socialInfo.literacyRate = ((((this.dto_socialInfo.femaleLiteracyRate / 100) * this.dto_socialInfo.female) +
                ((this.dto_socialInfo.maleLiteracyRate / 100) * this.dto_socialInfo.male)) /
                (this.dto_socialInfo.male + this.dto_socialInfo.female) * 100);
        }
        else {
            abp.notify.warn("Literacy percentage error. Value set to 0");
            this.dto_socialInfo.femaleLiteracyRate = 0;
        }
    }

    checkPercentageValue(){

        if(this.dto_socialInfo.femaleLiteracyRate < 0){
            this.dto_socialInfo.femaleLiteracyRate = 0;
        }else if(this.dto_socialInfo.femaleLiteracyRate > 100){
            this.dto_socialInfo.femaleLiteracyRate =100;
        }

        if(this.dto_socialInfo.maleLiteracyRate < 0){
            this.dto_socialInfo.maleLiteracyRate = 0;
        }else if(this.dto_socialInfo.maleLiteracyRate > 100){
            this.dto_socialInfo.maleLiteracyRate =100;
        }


    }

    changeMalePercentage() {
        if (this.dto_socialInfo.maleLiteracyRate != null && this.dto_socialInfo.maleLiteracyRate != undefined && this.dto_socialInfo.maleLiteracyRate != 0 && this.dto_socialInfo.maleLiteracyRate <= 100) {
            this.dto_socialInfo.literacyRate = ((((this.dto_socialInfo.femaleLiteracyRate / 100) * this.dto_socialInfo.female) +
                ((this.dto_socialInfo.maleLiteracyRate / 100) * this.dto_socialInfo.male)) /
                (this.dto_socialInfo.male + this.dto_socialInfo.female) * 100);
        }
        else {
            abp.notify.warn("Literacy percentage error. Value set to 0");
            this.dto_socialInfo.maleLiteracyRate = 0;
        }
        //console.log(((this.dto_socialInfo.femaleLiteracyRate / 100) * this.dto_socialInfo.female) +
          //  ((this.dto_socialInfo.maleLiteracyRate / 100) * this.dto_socialInfo.male));
    }

    RemoveEthicsGroup(i: Dto_EthicsDataViewModel) {
        if (i != null) {
            // console.log("index  ", i);
            this.PeopleCount = this.PeopleCount - i.noOfPeople;
            this.dto_EthicsModel = this.dto_EthicsModel.filter(obj => obj !== i);
            this.TotalNoOfPeople = null;
            this.isDisableAddEthicButton = true;
            this.SelectEthnics = 0;

            this.CreateNewEthicsInstance();
            this.calculatePercentageEthicGroup();
        } else {
            abp.notify.error("Javascript error. Please reload");
        }
    }

}