import { RiverHydrologyServiceProxy, Dto_WaterInducedDisasterModel, EmbankmentServiceProxy, Dto_Spur, Dto_Embankment, TertiaryCanalServiceProxy, ProjectLocationInfoServiceProxy, Dto_LocationInfo, DocumentDto, ListResultDtoOfDocumentDto, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';
import { MainCanalServiceProxy, Dto_RiverHydrology, HeadWorkServiceProxy, Dto_HeadWork, MainCanalStructureTypeServiceProxy, PagedResultDtoOfDto_MainCanalStructureType, Dto_MainCanalStructureType, MainCanalViewModel, MainCanalDataModel, Dto_MainCanalStructureDetailViewModel, BranchCanalServiceProxy, Dto_BranchCanal, WaterInducedDisasterModelServiceProxy, SpurServiceProxy, Dto_SecondaryCanal, SecondaryCanalServiceProxy, Dto_TertiaryCanal } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/internal/operators/finalize';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatRadioChange } from '@angular/material';
import { WaterInducedSpurDialogComponent } from './water-induced-spur/spur-data.component';
import { WaterInducedEmbankmentDialogComponent } from './water-induced-embankment/embankment-data.component';
import { CustomCommonService } from '@shared/dateconvertor.service';
import { DocumentUploadComponent } from 'gmis/document-upload/document-upload.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-engineering-info',
  templateUrl: './engineering-info.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./engineering-info.component.css']
})
export class EngineeringInfoComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    public _dialog: MatDialog,
    private _RiverHydrologyServiceProxy: RiverHydrologyServiceProxy,
    private _HeadWorkServiceProxy: HeadWorkServiceProxy,
    private _MainCanalServiceProxy: MainCanalServiceProxy,
    private _MainCanalStructureTypeServiceProxy: MainCanalStructureTypeServiceProxy,
    private _BranchCanalService: BranchCanalServiceProxy,
    private _SecondaryCanalService: SecondaryCanalServiceProxy,
    private _TertiaryCanalService: TertiaryCanalServiceProxy,
    private _WaterInducedService: WaterInducedDisasterModelServiceProxy,
    private _SpurService: SpurServiceProxy,
    private _EmbankmentService: EmbankmentServiceProxy,
    private _projectLocationInfoService: ProjectLocationInfoServiceProxy,
    private _commonService: CustomCommonService,
    private _documentServiceProxy: DocumentServiceProxy,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  projectName: string = "";
  projectId: string = "";
  ShowSaveBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  ngOnInit() {
    this.projectName = this._commonService.getProjectName();
    this.projectId = this._commonService.getProjectid();
    this.ShowSaveBtn = this._commonService.getSaveButtonAccess();
    this.ShowUpdateBtn = this._commonService.getUpdateButtonAccess();

    this.getRiverHydrologyInfo();
    this.NewHeadWork_FormInstance();
    this.NewFormInstance_WaterInducedDisaster();
    this.getLocationDetail();
    this.baseUrl = AppConsts.remoteServiceBaseUrl;
  }

  LocationInfoDto: Dto_LocationInfo = new Dto_LocationInfo();
  getLocationDetail() {
    abp.ui.setBusy('#RiverHydrologyDiv');
    this._projectLocationInfoService.getLocationInfoDetailByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#RiverHydrologyDiv');
        })
      )
      .subscribe((result: Dto_LocationInfo) => {
        if (result.id > 0) {
          // console.log("data found");
          this.LocationInfoDto = result;
          this.RiverSource = this.LocationInfoDto.riverSource;
          this.RiverBasin = this.LocationInfoDto.localRiverBasin;
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

  baseUrl: string;
  tabSelectionChanged(event) {
    // Get the selected tab
    // let selectedTab = event.tab;
    // console.log(selectedTab);
    // console.log(event);

    if (event.index == 1) {
      // console.log("Headworks info");
      if (this.HeadWorksFormGrp.get('id').value > 0) {

      } else {
        this.getHeadWorksInfo();
      }
    } else if (event.index == 2) {
      // console.log("MainCanal info");
      if (this.HeadWorksFormGrp.get('id').value > 0) {

      } else {
        abp.ui.setBusy('#MainCanalDiv');
        this.CanalStructureTypes = [];
        this._MainCanalStructureTypeServiceProxy.getAll(500, 0)
          .pipe(
            finalize(() => {
              abp.ui.clearBusy('#MainCanalDiv');
              this.getDocumentsUploadedMaincanal();
            })
          ).subscribe((result: PagedResultDtoOfDto_MainCanalStructureType) => {
            this.CanalStructureTypes = result.items;
            // console.log("CanalStructureTypes" ,this.CanalStructureTypes);
          },
            (error) => {
              console.log("getCanalStructureTypeList", error);
              abp.notify.error('Error in Getting data. Please try again');
            });
      }
    } else if (event.index == 3) {
      // console.log("Branch info");
      if (this.Dto_MainCanal.id > 0) {
        this.getNew_Dto_BranchCanal();
        this.getBranchCanalLists();
      }
    }
    else if (event.index == 4) {
      // console.log("Secondary info");
      if (this.Dto_BranchCanal.id > 0) {
        this.getNew_Dto_SecondaryCanal();
        this.getSecondaryCanalLists();
      }
    }
    else if (event.index == 5) {
      // console.log("Tertiary info");
      if (this.Dto_SecondaryCanal.id > 0) {
        this.getNew_Dto_TertiaryCanal();
        this.getTertiaryCanalLists();
      }
    }
    else if (event.index == 6) {
      console.log("Called me");
      this.getWaterInducedDisasterMgmtData();
    }
    // this.Dto_BranchCanal.branchName
    // Call some method that you want 
    // this.someMethod();
  }


  //Tertiary CANAL
  TertiaryCanals: Dto_TertiaryCanal[] = [];
  Dto_TertiaryCanal: Dto_TertiaryCanal = new Dto_TertiaryCanal();
  isTertiaryCanalTableLoading: boolean = false;
  getTertiaryCanalLists(): void {
    this.isTertiaryCanalTableLoading = true;
    // this.Dto_BranchCanal.id
    if (this.Dto_BranchCanal.id > 0) {
      this._TertiaryCanalService.getTertiaryCanalBySecondaryCanalId(this.Dto_SecondaryCanal.id)
        .pipe(
          finalize(() => {
            this.isTertiaryCanalTableLoading = false;
          })
        )
        .subscribe((result: Dto_TertiaryCanal[]) => {
          this.TertiaryCanals = result;
        },
          (error) => {
            console.log("getTertiaryCanalLists", error);
            abp.notify.error('Error in Getting data. Please try again');
          });
    } else {
      abp.notify.error("Please select Branch canal first");
    }
  }

  ViewTertiaryCanalDetail(indexx: number) {
    this.Dto_TertiaryCanal = new Dto_TertiaryCanal();
    this.Dto_TertiaryCanal = Object.assign({}, this.TertiaryCanals[indexx]);
  }

  getNew_Dto_TertiaryCanal(): void {
    this.Dto_TertiaryCanal = new Dto_TertiaryCanal();
    this.Dto_TertiaryCanal.secondaryCanalId = this.Dto_SecondaryCanal.id;
    this.Dto_TertiaryCanal.id = 0;
  }

  savingTertiaryCanalInfoForm: boolean = false;
  onSubmitTertiaryCanal(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          this.savingTertiaryCanalInfoForm = true;
          abp.ui.setBusy('#TertiaryCanalDiv');

          if (this.Dto_TertiaryCanal.id > 0) {
            this._TertiaryCanalService.update(this.Dto_TertiaryCanal)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#TertiaryCanalDiv');
                  this.savingTertiaryCanalInfoForm = false;
                })
              )
              .subscribe((result: Dto_TertiaryCanal) => {
                let res = this.TertiaryCanals.findIndex(obj => obj.id == this.Dto_TertiaryCanal.id);
                this.TertiaryCanals[res] = this.Dto_TertiaryCanal;
                abp.notify.info("Updated Successfully");
                this.getNew_Dto_TertiaryCanal();
              },
                (error) => {
                  console.log("Create-Tertiary-Canal", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          } else {
            // console.log(this.Dto_TertaryCanal);
            this._TertiaryCanalService.create(this.Dto_TertiaryCanal)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#TertiaryCanalDiv');
                  this.savingTertiaryCanalInfoForm = false;
                })
              )
              .subscribe((result: Dto_TertiaryCanal) => {
                this.Dto_TertiaryCanal.id = result.id;
                this.TertiaryCanals.push(this.Dto_TertiaryCanal);
              },
                (error) => {
                  console.log("Create-Tertiary-Canal", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          }
        }
      });
  }


  //Secondary CANAL
  SecondaryCanals: Dto_SecondaryCanal[] = [];
  Dto_SecondaryCanal: Dto_SecondaryCanal = new Dto_SecondaryCanal();
  isSecondaryCanalTableLoading: boolean = false;
  getSecondaryCanalLists(): void {
    this.isSecondaryCanalTableLoading = true;
    // this.Dto_BranchCanal.id
    if (this.Dto_MainCanal.id > 0) {
      this._SecondaryCanalService.getSecondaryCanalsByBranchCanalId(this.Dto_BranchCanal.id)
        .pipe(
          finalize(() => {
            this.isSecondaryCanalTableLoading = false;
          })
        )
        .subscribe((result: Dto_SecondaryCanal[]) => {
          this.SecondaryCanals = result;
        },
          (error) => {
            console.log("getSecondaryCanalLists", error);
            abp.notify.error('Error in Getting data. Please try again');
          });
    } else {
      abp.notify.error("Please select Branch canal first");
    }
  }

  ViewSecondaryCanalDetail(indexx: number) {
    this.Dto_SecondaryCanal = new Dto_SecondaryCanal();
    this.Dto_SecondaryCanal = Object.assign({}, this.SecondaryCanals[indexx]);
  }

  getNew_Dto_SecondaryCanal(): void {
    this.Dto_SecondaryCanal = new Dto_SecondaryCanal();
    this.Dto_SecondaryCanal.branchCanalId = this.Dto_BranchCanal.id;
    this.Dto_SecondaryCanal.id = 0;
  }

  savingSecondaryCanalInfoForm: boolean = false;
  onSubmitSecondaryCanal(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          this.savingSecondaryCanalInfoForm = true;
          abp.ui.setBusy('#SecondaryCanalDiv');

          if (this.Dto_SecondaryCanal.id > 0) {
            this._SecondaryCanalService.update(this.Dto_SecondaryCanal)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#SecondaryCanalDiv');
                  this.savingSecondaryCanalInfoForm = false;
                })
              )
              .subscribe((result: Dto_SecondaryCanal) => {
                let res = this.SecondaryCanals.findIndex(obj => obj.id == this.Dto_SecondaryCanal.id);
                this.SecondaryCanals[res] = this.Dto_SecondaryCanal;
                abp.notify.info("Updated Successfully");
                this.getNew_Dto_SecondaryCanal();
              },
                (error) => {
                  console.log("Create-Secondary-Canal", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          } else {
            // console.log(this.Dto_BranchCanal);
            this._SecondaryCanalService.create(this.Dto_SecondaryCanal)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#SecondaryCanalDiv');
                  this.savingBranchCanalInfoForm = false;
                })
              )
              .subscribe((result: Dto_SecondaryCanal) => {
                this.Dto_SecondaryCanal.id = result.id;
                this.SecondaryCanals.push(this.Dto_SecondaryCanal);
                // this.BranchCanals = result;
              },
                (error) => {
                  console.log("Create-Secondary-Canal", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          }
        }
      });
  }

  //water induced modal
  openSpurModal(Spurtemplate) {
    let dialogRef = this._dialog.open(Spurtemplate, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEmbankmentModal(embankmenttemplate) {
    let dialogRef = this._dialog.open(embankmenttemplate, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openWeirModal(Weirtemplate) {
    let dialogRef = this._dialog.open(Weirtemplate, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openBankModal(Banktemplate) {
    let dialogRef = this._dialog.open(Banktemplate, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Dto_WaterInducedDisasterModel: Dto_WaterInducedDisasterModel = new Dto_WaterInducedDisasterModel();
  Spurs: Dto_Spur[] = [];
  Embankments: Dto_Embankment[] = [];
  getWaterInducedDisasterMgmtData() {
    this.Dto_WaterInducedDisasterModel = new Dto_WaterInducedDisasterModel();
    this.NewFormInstance_WaterInducedDisaster();

    abp.ui.setBusy("#WaterInducedDisasterFrmGrpDiv");

    this._WaterInducedService.getWaterInducedDisasterDataByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy("#WaterInducedDisasterFrmGrpDiv");
        })
      )
      .subscribe((result: Dto_WaterInducedDisasterModel) => {
        if (result.id > 0) {
          this.WaterInducedDisasterFrmGrp.patchValue(result);

          if (result.inlineStructure == "Spur") {
            this.getSpursList();
          }
          if (result.lateralStructure == "Embankment") {
            this.getEmbankmentList();
          }

        }
        // this.Dto_Spur = new Dto_Spur();
        // this.Dto_Spur = result;
      });
  }

  SpursDataListLoading: boolean = false;
  getSpursList(): void {
    this.Spurs = [];
    this.SpursDataListLoading = true;
    this._SpurService.getSpurListByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.SpursDataListLoading = false;
        })
      )
      .subscribe((results: Dto_Spur[]) => {
        this.Spurs = results;
      });
  }

  EmbankmentDataListLoading: boolean = false;
  getEmbankmentList(): void {
    this.Embankments = [];
    this.EmbankmentDataListLoading = true;
    this._EmbankmentService.getEmbankmentByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          this.EmbankmentDataListLoading = false;
        })
      )
      .subscribe((results: Dto_Embankment[]) => {
        this.Embankments = results;
      });
  }

  onWaterInduced_InlineStructureValueChange(selectedValue: string): void {
    const inlineStructureOthersControl = this.WaterInducedDisasterFrmGrp.get('inlineStructureOthers');
    inlineStructureOthersControl.clearValidators();
    if (selectedValue === 'Others') {
      inlineStructureOthersControl.setValidators([Validators.required]);
    } else {
    }
    inlineStructureOthersControl.updateValueAndValidity();
  }

  onWaterInduced_LaterlStructureValueChange($event: MatRadioChange): void {
    const lateralStructureOthersControl = this.WaterInducedDisasterFrmGrp.get('lateralStructureOthers');

    lateralStructureOthersControl.clearValidators();

    if ($event.value === 'Others') {
      lateralStructureOthersControl.setValidators([Validators.required]);
    } else {
    }
    lateralStructureOthersControl.updateValueAndValidity();
  }

  onSubmitWaterInducedDisasterForm(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          this.Dto_WaterInducedDisasterModel = new Dto_WaterInducedDisasterModel();

          const DataModel: Dto_WaterInducedDisasterModel = Object.assign(
            {},
            this.Dto_WaterInducedDisasterModel,
            this.WaterInducedDisasterFrmGrp.value
          );
          DataModel.projectId = this.projectId;
          this.Saving_WaterInducedDisaster = true;
          abp.ui.setBusy("#WaterInducedDisasterFrmGrpDiv");

          if (DataModel.id > 0) {
            this._WaterInducedService.update(DataModel)
              .pipe(
                finalize(() => {
                  this.Saving_WaterInducedDisaster = false;
                  abp.ui.clearBusy("#WaterInducedDisasterFrmGrpDiv");
                }))
              .subscribe((result: Dto_WaterInducedDisasterModel) => {
                this.notify.info("Update Successfull");
              }, (err) => {
                abp.notify.error("Error Please report us");
                console.log("_WaterInducedService.update ", err);
              });
          } else {
            this._WaterInducedService.create(DataModel)
              .pipe(
                finalize(() => {
                  this.Saving_WaterInducedDisaster = false;
                  abp.ui.clearBusy("#WaterInducedDisasterFrmGrpDiv");
                }))
              .subscribe((result: Dto_WaterInducedDisasterModel) => {
                this.WaterInducedDisasterFrmGrp.patchValue({ id: result.id });
                this.notify.success("Saved Successfull");
              }, (err) => {
                abp.notify.error("Error Please report us");
                console.log("_WaterInducedService.create ", err);
              });
          }
        }
      });
    //WaterInducedDisasterFrmGrpDiv
  }

  WaterInducedDisasterFrmGrp: FormGroup;
  Saving_WaterInducedDisaster: boolean = false;
  NewFormInstance_WaterInducedDisaster() {
    this.WaterInducedDisasterFrmGrp = this.fb.group({
      averageRiverWidth: ['', Validators.required],
      averageRiverSlope1: ['', Validators.required],
      protectedArea: ['', Validators.required],
      reclaimedArea: ['', Validators.required],

      inlineStructure: [null,Validators.required],
      inlineStructureOthers: [''],
      lateralStructure: [null,Validators.required],
      lateralStructureOthers: [''],

      projectId: [this.projectId],
      id: [0],
    });
  }

  viewspurData(i: number): void {
    if (i > 0) {
      // let ids = this.Spurs[i].id;
      this.SpurDialogOpen(i);
    }
  }

  CreateNewSpurDto() {
    this.SpurDialogOpen(0);
  }

  SpurDialogOpen(ids: number): void {
    const dialogRef = this._dialog.open(WaterInducedSpurDialogComponent, {
      data: ids
    });

    // data: { isEdit: false, CropList: CroplistToInject, isCropPatternExisting: false, id: 0, projectId: this.projectId }

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ", result)
      if (result) {
        this.getSpursList();
      }
    });
  }

  viewembankmentData(i: number): void {
    if (i > 0) {
      // let ids = this.Spurs[i].id;
      this.EmbankmentDialogOpen(i);
    }
  }

  CreateNewEmbankmentDto() {
    this.EmbankmentDialogOpen(0);
  }

  EmbankmentDialogOpen(ids: number): void {
    const dialogRef = this._dialog.open(WaterInducedEmbankmentDialogComponent, {
      data: ids
    });

    // data: { isEdit: false, CropList: CroplistToInject, isCropPatternExisting: false, id: 0, projectId: this.projectId }

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ", result)
      if (result) {
        this.getEmbankmentList();
      }
    });
  }

  //BRANCH CANAL
  BranchCanals: Dto_BranchCanal[] = [];
  Dto_BranchCanal: Dto_BranchCanal = new Dto_BranchCanal();
  isBranchCanalTableLoading: boolean = false;
  getBranchCanalLists(): void {
    this.isBranchCanalTableLoading = true;
    abp.ui.setBusy('#BranchCanalDiv');
    this.Dto_BranchCanal.id
    if (this.Dto_MainCanal.id > 0) {
      this._BranchCanalService.getBranchCanalByMainCanalId(this.Dto_MainCanal.id)
        .pipe(
          finalize(() => {
            abp.ui.clearBusy('#BranchCanalDiv');
            this.isBranchCanalTableLoading = false;
          })
        )
        .subscribe((result: Dto_BranchCanal[]) => {
          this.BranchCanals = result;
        },
          (error) => {
            console.log("getBranchCanalLists", error);
            abp.notify.error('Error in Getting data. Please try again');
          });
    } else {
      abp.notify.error("Please select main canal first");
    }
  }

  ViewBranchCanalDetail(indexx: number) {
    this.Dto_BranchCanal = new Dto_BranchCanal();
    this.Dto_BranchCanal = Object.assign({}, this.BranchCanals[indexx]);
    //this.BranchCanals.indexOf()
    // let res = this.BranchCanals.map(x=>x.)
  }

  getNew_Dto_BranchCanal(): void {
    this.Dto_BranchCanal = new Dto_BranchCanal();
    this.Dto_BranchCanal.mainCanalId = this.Dto_MainCanal.id;
  }

  savingBranchCanalInfoForm: boolean = false;
  onSubmitBranchCanal(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          this.savingBranchCanalInfoForm = true;

          if (this.Dto_BranchCanal.id > 0) {
            this._BranchCanalService.update(this.Dto_BranchCanal)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#BranchCanalDiv');
                  this.savingBranchCanalInfoForm = false;
                })
              )
              .subscribe((result: Dto_BranchCanal) => {
                let res = this.BranchCanals.findIndex(obj => obj.id == this.Dto_BranchCanal.id);
                this.BranchCanals[res] = this.Dto_BranchCanal;
                abp.notify.info("Updated Successfully");
                this.getNew_Dto_BranchCanal();
              },
                (error) => {
                  console.log("CreateBranchCanal", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });

          } else {
            console.log(this.Dto_BranchCanal);
            this._BranchCanalService.create(this.Dto_BranchCanal)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#BranchCanalDiv');
                  this.savingBranchCanalInfoForm = false;
                })
              )
              .subscribe((result: Dto_BranchCanal) => {
                this.Dto_BranchCanal.id = result.id;
                this.BranchCanals.push(this.Dto_BranchCanal);
                // this.BranchCanals = result;
              },
                (error) => {
                  console.log("CreateBranchCanal", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          }
        }
      });
  }

  //Main Canal
  savingMainCanalInfoForm: boolean = false;
  addStructureToList(): void {
    let tes = new Dto_MainCanalStructureDetailViewModel();
    tes.id = 0;
    tes.mainCanalStructureTypeId = this.canalStructureId;
    tes.noOfStructure = this.NoOfStructure;
    let r = this.CanalStructureTypesToShow.findIndex(x => x.id == this.canalStructureId);
    if (r == -1) {
      abp.notify.error("Internal Error.. Please report us");
    }
    tes.name = this.CanalStructureTypesToShow[r].name;


    this.CanalStructureDatas.push(tes);
    // console.log(this.CanalStructureDatas);
    this.getStructureTypeInSelectList();
  }
  RemoveStructureType(i: number) {
    if (i != null) {
      // console.log("index  ", i);
      this.CanalStructureDatas = this.CanalStructureDatas.filter(obj => obj.mainCanalStructureTypeId != i);
      this.getStructureTypeInSelectList();
    } else {
      abp.notify.error("Javascript error. Please reload");
    }
  }

  MainCanalDataModel: MainCanalDataModel = new MainCanalDataModel();
  onSubmitMainCanal(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          let DataModel = new MainCanalDataModel();
          DataModel.mainCanalDetail = this.Dto_MainCanal;
          DataModel.canalStructureDetails = this.CanalStructureDatas;

          // this.Dto_MainCanal.id==0

          this._MainCanalServiceProxy.mainCanalData(DataModel)
            .pipe(
              finalize(() => {
                abp.ui.clearBusy('#HeadWorksDiv');
              })
            )
            .subscribe((result: number) => {
              if (result == 1) {
                let msg = DataModel.mainCanalDetail.id > 0 ? "Update" : "Added";
                abp.notify.success("Main Canal Data " + msg + " successfully.");
                // this.getMainCanalInfo();
                this.onCanalDirectionChange();
              }
            },
              (error) => {
                console.log("getHeadWorksInfo", error);
                abp.notify.error('Error in Getting data. Please try again');
              });
        }
      });
    // this.Dto_MainCanal.totalLength
    // this.MainCanalDataModel.mainCanalDetail = Dto_MainCanal
    // this.MainCanalDataModel.canalStructureDetails = Dto_MainCanalStructureDetailViewModel
    // this._MainCanalServiceProxy.mainCanalData(this.MainCanalDataModel)
  }

  onCanalDirectionChange(): void {
    const CanalDirection = this.Dto_MainCanal.isCanalDirectionLeft;

    abp.ui.setBusy('#MainCanalDiv');
    this._MainCanalServiceProxy.getMainCanalInfoByProjectIdNCanalDirection(this.projectId, this.Dto_MainCanal.isCanalDirectionLeft)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#MainCanalDiv');
          this.getStructureTypeInSelectList();
        })
      )
      .subscribe((result: MainCanalViewModel) => {
        this.Dto_MainCanal = new MainCanalViewModel();

        if (result.id > 0) {
          this.Dto_MainCanal = result;
          this.CanalStructureDatas = result.canalStructureDetails;
        } else {
          this.CanalStructureDatas = [];
          this.Dto_MainCanal.isCanalDirectionLeft = CanalDirection;
          this.Dto_MainCanal.projectId = this.projectId;
        }

        // console.log(result);
        // this.MainCanals = result;
      },
        (error) => {
          console.log("getMainCanalInfo", error);
          abp.notify.error('Error in Getting data. Please try again');
        });

  }

  canalStructureId: number = 0;
  NoOfStructure: number = null;

  getStructureTypeInSelectList(): void {
    this.canalStructureId = 0;
    this.NoOfStructure = null;
    // this.Dto_MainCanal.canalStructureDetails

    // console.log("getStructureTypeInSelectList");
    this.CanalStructureTypesToShow = [];
    if (this.CanalStructureDatas.length > 0) {
      for (let items of this.CanalStructureTypes) {
        let Result = this.CanalStructureDatas.findIndex(x => x.mainCanalStructureTypeId == items.id);
        if (Result == -1) {
          this.CanalStructureTypesToShow.push(items);
        }
      }
    } else {
      this.CanalStructureTypesToShow = this.CanalStructureTypes;
    }
    // this.Dto_MainCanal.canalStructureDetails
    // result = firstArray.filter(o => secondArray.some(({id,name}) => o.id === id && o.name === name));
  }

  CanalStructureDatas: Dto_MainCanalStructureDetailViewModel[] = [];
  CanalStructureTypes: Dto_MainCanalStructureType[] = [];
  CanalStructureTypesToShow: Dto_MainCanalStructureType[] = [];
  // MainCanals: MainCanalViewModel[] = [];
  Dto_MainCanal: MainCanalViewModel = new MainCanalViewModel();

  isDocumentListTableLoading: boolean = false;
  UploadProjectInfoDocument() {
    let projectHelperDialog;
    projectHelperDialog = this._dialog.open(DocumentUploadComponent, {
      data: "2"
    });

    projectHelperDialog.afterClosed().subscribe(result => {
      if (result) {
        this.getDocumentsUploadedMaincanal();
      }
    });
  }
  DocumentsList: DocumentDto[] = [];
  getDocumentsUploadedMaincanal(): void {
    this.isDocumentListTableLoading = true;
    this._documentServiceProxy.getDocumentListByProjectidAndDocType(this.projectId, 2)
      .pipe(
        finalize(() => {
          this.isDocumentListTableLoading = false;
        })
      ).subscribe((result: ListResultDtoOfDocumentDto) => {
        // this.projects = result.items;
        this.DocumentsList = result.items;
        // console.log(this.DocumentsList)
      });
  }

  //headwork
  getHeadWorksInfo(): void {
    abp.ui.setBusy('#HeadWorksDiv');
    this.NewHeadWork_FormInstance();

    this._HeadWorkServiceProxy.getHeadWorksInfoByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#HeadWorksDiv');
        })
      )
      .subscribe((result: Dto_HeadWork) => {
        // console.log(result);
        if (result.id > 0) {
          this.HeadWorksFormGrp.patchValue(result);
        }
      },
        (error) => {
          console.log("getHeadWorksInfo", error);
          abp.notify.error('Error in Getting data. Please try again');
        });
  }

  onHeadWorkTypeValueChange(selectedValue: string): void {
    // console.log(selectedValue);
    const headWorksTypeOtherControl = this.HeadWorksFormGrp.get('headWorksTypeOther');
    const barrageTotalLengthControl = this.HeadWorksFormGrp.get('barrageTotalLength');
    const noOfBaysOrGatesControl = this.HeadWorksFormGrp.get('noOfBaysOrGates');
    const lengthOfEachBayOpeningControl = this.HeadWorksFormGrp.get('lengthOfEachBayOpening');
    const crestElevationControl = this.HeadWorksFormGrp.get('crestElevation');
    const noOfUndersluiceControl = this.HeadWorksFormGrp.get('noOfUndersluice');
    const noOfUndersluiceBaysOrGatesControl = this.HeadWorksFormGrp.get('noOfUndersluiceBaysOrGates');
    const undersluiceLengthOfEachBayOpeningControl = this.HeadWorksFormGrp.get('undersluiceLengthOfEachBayOpening');
    const undersluiceCrestElevationControl = this.HeadWorksFormGrp.get('undersluiceCrestElevation');
    const barrageNoOfHeadRegulatorsControl = this.HeadWorksFormGrp.get('barrageNoOfHeadRegulators');
    const barrageWidthHeadRegulatorsControl = this.HeadWorksFormGrp.get('barrageWidthHeadRegulators');
    const barrageNoOfHeadRegulatorsBaysControl = this.HeadWorksFormGrp.get('barrageNoOfHeadRegulatorsBays');
    const barrageWidthOfEachBayOpeningControl = this.HeadWorksFormGrp.get('barrageWidthOfEachBayOpening');
    const barrageCrestElevationControl = this.HeadWorksFormGrp.get('barrageCrestElevation');
    const weirTotalLengthControl = this.HeadWorksFormGrp.get('weirTotalLength');
    const weirCrestElevationControl = this.HeadWorksFormGrp.get('weirCrestElevation');
    const weirNoOfUndersluiceControl = this.HeadWorksFormGrp.get('weirNoOfUndersluice');
    const weirNoOfUndersluiceBaysOrGatesControl = this.HeadWorksFormGrp.get('weirNoOfUndersluiceBaysOrGates');
    const weirUndersluiceLengthOfEachBayOpeningControl = this.HeadWorksFormGrp.get('weirUndersluiceLengthOfEachBayOpening');
    const weirUndersluiceCrestElevationControl = this.HeadWorksFormGrp.get('weirUndersluiceCrestElevation');
    const weirNoOfHeadRegulatorsControl = this.HeadWorksFormGrp.get('weirNoOfHeadRegulators');
    const weirWidthHeadRegulatorsControl = this.HeadWorksFormGrp.get('weirWidthHeadRegulators');
    const weirNoOfHeadRegulatorsBaysControl = this.HeadWorksFormGrp.get('weirNoOfHeadRegulatorsBays');
    const weirWidthOfEachBayOpeningControl = this.HeadWorksFormGrp.get('weirWidthOfEachBayOpening');
    const weirHeadRegulatorsCrestElevationControl = this.HeadWorksFormGrp.get('weirHeadRegulatorsCrestElevation');
    const bankIntakeIsGatedControl = this.HeadWorksFormGrp.get('bankIntakeIsGated');
    const stillLevelLengthControl = this.HeadWorksFormGrp.get('stillLevelLength');
    const sizeOfOrificeWidthControl = this.HeadWorksFormGrp.get('sizeOfOrificeWidth');
    const sizeOfOrificeHeightControl = this.HeadWorksFormGrp.get('sizeOfOrificeHeight');

    headWorksTypeOtherControl.clearValidators();
    barrageTotalLengthControl.clearValidators();
    noOfBaysOrGatesControl.clearValidators();
    lengthOfEachBayOpeningControl.clearValidators();
    crestElevationControl.clearValidators();
    noOfUndersluiceControl.clearValidators();
    noOfUndersluiceBaysOrGatesControl.clearValidators();
    undersluiceLengthOfEachBayOpeningControl.clearValidators();
    undersluiceCrestElevationControl.clearValidators();
    barrageNoOfHeadRegulatorsControl.clearValidators();
    barrageWidthHeadRegulatorsControl.clearValidators();
    barrageNoOfHeadRegulatorsBaysControl.clearValidators();
    barrageWidthOfEachBayOpeningControl.clearValidators();
    barrageCrestElevationControl.clearValidators();
    weirTotalLengthControl.clearValidators();
    weirCrestElevationControl.clearValidators();
    weirNoOfUndersluiceControl.clearValidators();
    weirNoOfUndersluiceBaysOrGatesControl.clearValidators();
    weirUndersluiceLengthOfEachBayOpeningControl.clearValidators();
    weirUndersluiceCrestElevationControl.clearValidators();
    weirNoOfHeadRegulatorsControl.clearValidators();
    weirWidthHeadRegulatorsControl.clearValidators();
    weirNoOfHeadRegulatorsBaysControl.clearValidators();
    weirWidthOfEachBayOpeningControl.clearValidators();
    weirHeadRegulatorsCrestElevationControl.clearValidators();
    bankIntakeIsGatedControl.clearValidators();
    stillLevelLengthControl.clearValidators();
    sizeOfOrificeWidthControl.clearValidators();
    sizeOfOrificeHeightControl.clearValidators();

    if (selectedValue == 'Barrage') {
      barrageTotalLengthControl.setValidators([Validators.required, Validators.min(0)]);
      noOfBaysOrGatesControl.setValidators([Validators.required, Validators.min(0)]);
      lengthOfEachBayOpeningControl.setValidators([Validators.required, Validators.min(0)]);
      crestElevationControl.setValidators([Validators.required, Validators.min(0)]);
      noOfUndersluiceControl.setValidators([Validators.required, Validators.min(0)]);
      noOfUndersluiceBaysOrGatesControl.setValidators([Validators.required, Validators.min(0)]);
      undersluiceLengthOfEachBayOpeningControl.setValidators([Validators.required, Validators.min(0)]);
      undersluiceCrestElevationControl.setValidators([Validators.required, Validators.min(0)]);
      barrageNoOfHeadRegulatorsControl.setValidators([Validators.required, Validators.min(0)]);
      barrageWidthHeadRegulatorsControl.setValidators([Validators.required, Validators.min(0)]);
      barrageNoOfHeadRegulatorsBaysControl.setValidators([Validators.required, Validators.min(0)]);
      barrageWidthOfEachBayOpeningControl.setValidators([Validators.required, Validators.min(0)]);
      barrageCrestElevationControl.setValidators([Validators.required, Validators.min(0)]);

    } else if (selectedValue == 'Wier') {
      weirTotalLengthControl.setValidators([Validators.required, Validators.min(0)]);
      weirCrestElevationControl.setValidators([Validators.required, Validators.min(0)]);
      weirNoOfUndersluiceControl.setValidators([Validators.required, Validators.min(0)]);
      weirNoOfUndersluiceBaysOrGatesControl.setValidators([Validators.required, Validators.min(0)]);
      weirUndersluiceLengthOfEachBayOpeningControl.setValidators([Validators.required, Validators.min(0)]);
      weirUndersluiceCrestElevationControl.setValidators([Validators.required, Validators.min(0)]);
      weirNoOfHeadRegulatorsControl.setValidators([Validators.required, Validators.min(0)]);
      weirWidthHeadRegulatorsControl.setValidators([Validators.required, Validators.min(0)]);
      weirNoOfHeadRegulatorsBaysControl.setValidators([Validators.required, Validators.min(0)]);
      weirWidthOfEachBayOpeningControl.setValidators([Validators.required, Validators.min(0)]);
      weirHeadRegulatorsCrestElevationControl.setValidators([Validators.required, Validators.min(0)]);
    } else if (selectedValue == 'BankIntake') {
      bankIntakeIsGatedControl.setValidators([Validators.required]);
      stillLevelLengthControl.setValidators([Validators.required, Validators.min(0)]);
      sizeOfOrificeWidthControl.setValidators([Validators.required, Validators.min(0)]);
      sizeOfOrificeHeightControl.setValidators([Validators.required, Validators.min(0)]);
    } else if (selectedValue == 'Others') {
      headWorksTypeOtherControl.setValidators([Validators.required, Validators.minLength(1)]);
    }

    headWorksTypeOtherControl.updateValueAndValidity();
    barrageTotalLengthControl.updateValueAndValidity();
    noOfBaysOrGatesControl.updateValueAndValidity();
    lengthOfEachBayOpeningControl.updateValueAndValidity();
    crestElevationControl.updateValueAndValidity();
    noOfUndersluiceControl.updateValueAndValidity();
    noOfUndersluiceBaysOrGatesControl.updateValueAndValidity();
    undersluiceLengthOfEachBayOpeningControl.updateValueAndValidity();
    undersluiceCrestElevationControl.updateValueAndValidity();
    barrageNoOfHeadRegulatorsControl.updateValueAndValidity();
    barrageWidthHeadRegulatorsControl.updateValueAndValidity();
    barrageNoOfHeadRegulatorsBaysControl.updateValueAndValidity();
    barrageWidthOfEachBayOpeningControl.updateValueAndValidity();
    barrageCrestElevationControl.updateValueAndValidity();
    weirTotalLengthControl.updateValueAndValidity();
    weirCrestElevationControl.updateValueAndValidity();
    weirNoOfUndersluiceControl.updateValueAndValidity();
    weirNoOfUndersluiceBaysOrGatesControl.updateValueAndValidity();
    weirUndersluiceLengthOfEachBayOpeningControl.updateValueAndValidity();
    weirUndersluiceCrestElevationControl.updateValueAndValidity();
    weirNoOfHeadRegulatorsControl.updateValueAndValidity();
    weirWidthHeadRegulatorsControl.updateValueAndValidity();
    weirNoOfHeadRegulatorsBaysControl.updateValueAndValidity();
    weirWidthOfEachBayOpeningControl.updateValueAndValidity();
    weirHeadRegulatorsCrestElevationControl.updateValueAndValidity();
    bankIntakeIsGatedControl.updateValueAndValidity();
    stillLevelLengthControl.updateValueAndValidity();
    sizeOfOrificeWidthControl.updateValueAndValidity();
    sizeOfOrificeHeightControl.updateValueAndValidity();

  }

  HeadWorksFormGrp: FormGroup;
  Saving_HeadWorksFormGrp: boolean = false;
  NewHeadWork_FormInstance() {
    this.HeadWorksFormGrp = this.fb.group({
      headWorksType: ['', Validators.required],
      headWorksTypeOther: [''],

      barrageTotalLength: [''],
      noOfBaysOrGates: [''],
      lengthOfEachBayOpening: [''],
      crestElevation: [''],
      noOfUndersluice: [''],
      noOfUndersluiceBaysOrGates: [''],
      undersluiceLengthOfEachBayOpening: [''],
      undersluiceCrestElevation: [''],
      barrageNoOfHeadRegulators: [''],
      barrageWidthHeadRegulators: [''],
      barrageNoOfHeadRegulatorsBays: [''],
      barrageWidthOfEachBayOpening: [''],
      barrageCrestElevation: [''],

      weirTotalLength: [''],
      weirCrestElevation: [''],
      weirNoOfUndersluice: [''],
      weirNoOfUndersluiceBaysOrGates: [''],
      weirUndersluiceLengthOfEachBayOpening: [''],
      weirUndersluiceCrestElevation: [''],
      weirNoOfHeadRegulators: [''],
      weirWidthHeadRegulators: [''],
      weirNoOfHeadRegulatorsBays: [''],
      weirWidthOfEachBayOpening: [''],
      weirHeadRegulatorsCrestElevation: [''],

      bankIntakeIsGated: [''],
      stillLevelLength: [''],
      sizeOfOrificeWidth: [''],
      sizeOfOrificeHeight: [''],
      projectId: [this.projectId],
      id: [0],
    });
  }

  Dto_HeadWork: Dto_HeadWork = new Dto_HeadWork();
  onSubmitHeadWorkForm(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {

          this.Dto_HeadWork = new Dto_HeadWork();
          const DataModel: Dto_HeadWork = Object.assign(
            {},
            this.Dto_HeadWork,
            this.HeadWorksFormGrp.value
          );
          DataModel.projectId = this.projectId;

          if (DataModel.id > 0) {
            this._HeadWorkServiceProxy.update(DataModel)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#HeadWorksDiv');
                })
              )
              .subscribe((result: Dto_HeadWork) => {
                abp.notify.success('Head Works Info successfully Updated');
              },
                (error) => {
                  console.log("onSubmitHeadWorkForm - update", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          } else {
            this._HeadWorkServiceProxy.create(DataModel)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#HeadWorksDiv');
                })
              )
              .subscribe((result: Dto_HeadWork) => {
                this.HeadWorksFormGrp.patchValue({ id: result.id });
                abp.notify.success('Head Works Info successfully Added');
              },
                (error) => {
                  console.log("onSubmitHeadWorkForm", error);
                  abp.notify.error('Error in Saving data. Please try again');
                });
          }
        }
      });
  }
  //river hydrology
  saveRiverHydrology(): void {
    abp.message.confirm(" Please Click Cancel for Editing", "Do you want to submit ?",
      (result: boolean) => {
        if (result) {
          abp.ui.setBusy('#RiverHydrologyDiv');
          if (this.RiverHydrologyDto.id > 0) {
            this._RiverHydrologyServiceProxy.update(this.RiverHydrologyDto)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#RiverHydrologyDiv');
                })
              )
              .subscribe((result: Dto_RiverHydrology) => {
                this.RiverHydrologyDto.id = result.id;
                abp.notify.success('River Hydrology Info successfully updated');
              },
                (error) => {
                  console.log("getRiverHydrologyInfo", error);
                  abp.notify.error('Error in getting data. Please try again');
                });
          } else {
            this._RiverHydrologyServiceProxy.create(this.RiverHydrologyDto)
              .pipe(
                finalize(() => {
                  abp.ui.clearBusy('#RiverHydrologyDiv');
                })
              )
              .subscribe((result: Dto_RiverHydrology) => {
                this.RiverHydrologyDto.id = result.id;
                abp.notify.success('River Hydrology Info successfully added');
              },
                (error) => {
                  console.log("getRiverHydrologyInfo", error);
                  abp.notify.error('Error in getting data. Please try again');
                });
          }
        }
      });

  }

  RiverBasin: string = "";
  RiverSource: string = "";

  RiverHydrologyDto: Dto_RiverHydrology = new Dto_RiverHydrology();
  getRiverHydrologyInfo(): void {
    abp.ui.setBusy('#RiverHydrologyDiv');
    this._RiverHydrologyServiceProxy.getRiverHydrologyInfoByProjectId(this.projectId)
      .pipe(
        finalize(() => {
          abp.ui.clearBusy('#RiverHydrologyDiv');
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

  openModal(templateRef) {
    let dialogRef = this._dialog.open(templateRef, {
      // width: '250px',
      data: "name: this.name, animal: this.animal"
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}