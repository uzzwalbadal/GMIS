import { Component, OnInit } from '@angular/core';
import { GraphDataServiceProxy, Dto_GraphData } from '@shared/service-proxies/service-proxies';
import { MatDialog } from '@angular/material';
import { GraphDataDialogComponent } from './data-component/graphdata-dialog.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-graphdata',
  templateUrl: './graphdata.component.html',
  styleUrls: ['./graphdata.component.css']
})
export class GraphdataComponent implements OnInit {

  constructor(
    private _GraphDataService: GraphDataServiceProxy,
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  GetdataId: number = 0;
  ItypeId: number = 0;

  isTableLoading: boolean = false;
  GraphDatas: Dto_GraphData[] = [];

  getData(iType: number) {
    this.isTableLoading = true;
    this._GraphDataService.getGraphDataByIType(iType)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
          this.GetdataId = iType;
        })
      )
      .subscribe((result: Dto_GraphData[]) => {
        this.GraphDatas = result;
      });
  }

  addNewGraphData() {
    this.Dto_GraphData = new Dto_GraphData();
    this.Dto_GraphData.id = 0;
    this.CallDataComponent();
  }

  editGraphData(datas: Dto_GraphData) {
    this.Dto_GraphData = new Dto_GraphData();
    this.Dto_GraphData = Object.assign({}, datas);
    this.CallDataComponent();
  }

  Dto_GraphData: Dto_GraphData = new Dto_GraphData();
  CallDataComponent() {
    const dialogRef = this._dialog.open(GraphDataDialogComponent, {
      // width: '200%',
      data: this.Dto_GraphData
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("Result ",result)
      if (result > 0) {
        this.getData(result);
      }
    });
  }

  RemoveGraphData(Datas: Dto_GraphData) {
    abp.message.confirm("Do u want to delete data ?",
      (result: boolean) => {
        if (result) {
          this._GraphDataService.delete(Datas.id)
            .pipe(
              finalize(() => {
                this.getData(Datas.iType);
              })
            ).subscribe((result) => {

            },
              (error) => {
                console.log("getCanalStructureTypeList", error);
                abp.notify.error('Error in Delete data. Please try again');
              });
        }
      });

  }
}
