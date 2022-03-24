import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { GraphDataServiceProxy, PagedResultDtoOfDto_GraphData, Dto_GraphData, GraphData_Dto_ProcedureCall } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';

@Component({
  selector: 'app-bar-chart-test-component',
  templateUrl: './bar-chart-test-component.component.html',
  styleUrls: ['./bar-chart-test-component.component.css']
})
export class BarChartTestComponentComponent implements OnInit {

  constructor(
    private _GraphDataService: GraphDataServiceProxy,
  ) { }

  ngOnInit() {
    this.getallGraphData();
  }

  public AgricultureIrrigationIrrigatedChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: 'कुल सिंचित क्षेत्र ( लाख हेक्टर )',
      display: true,
      fontSize: 20,
      fullWidth: true,
    },
    // We use these empty structures as placeholders for dynamic theming.
    // scales: { xAxes: [{}], yAxes: [{}] },
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            min: 0,
            max: 100,
            stepSize: 10,
          },
          // scaleLabel: {
          //   display: true,
          //   labelString: 'probability'
          // }
        }],

    },
  };
  public AgricultureIrrigationIrrigatedChartData: ChartDataSets[] = [
    { data: [] },
  ];
  public AgricultureIrrigationIrrigatedChartDataLabels: Label[] = [];
  GraphDatas: Dto_GraphData[] = [];
  getallGraphData(): void {
    this._GraphDataService.getAll(1000, 0)
      .pipe(
        finalize(() => {
          // this.isTableLoading = false;
          this.NoOfProjectChartDetail();
        })
      )
      .subscribe((result: PagedResultDtoOfDto_GraphData) => {
        this.GraphDatas = result.items;
        if (this.GraphDatas.length > 0) {
          this.AgricultureIrrigationIrrigatedChart();
        }
      });
  }

  AgricultureIrrigationIrrigatedChart(): void {
    let datas = this.GraphDatas.filter(x => x.iType == 1);
    let maxValue = 0;
    if (datas.length > 0) {
      let values = datas.map(x => x.dataValues);
      let labels = datas.map(x => x.displayName);
      maxValue = values.reduce((a, b) => Math.max(a, b));
      maxValue = maxValue / 10;
      maxValue = Math.round(maxValue);
      maxValue = (maxValue + 1) * 10;
      this.AgricultureIrrigationIrrigatedChartData[0].data = values;
      this.AgricultureIrrigationIrrigatedChartDataLabels = labels;
    }

    this.AgricultureIrrigationIrrigatedChartOptions = {
      responsive: true,
      title: {
        text: 'कृषि योग्य, सिंचाई योग्य, सिंचित क्षेत्र ( लाख हेक्टर )',
        display: true,
        fontSize: 20,
      },
      scales: {

        yAxes: [
          {
            display: true,
            ticks: {
              min: 0,
              max: maxValue,
              stepSize: 10,
            },
            //  scaleLabel: {
            // display: true,
            // labelString: 'probability'
            // }
          }],

      },
      // scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          font: {
            size: 20,
          }
        }
      },
      // animation: {
      //   onComplete: function () {
      //     var chartInstance = this.chart,
      //       ctx = chartInstance.ctx;
      //     ctx.textAlign = 'center';
      //     ctx.textBaseline = 'bottom';
      //     this.data.datasets.forEach(function (dataset, i) {
      //       var meta = chartInstance.controller.getDatasetMeta(i);
      //       meta.data.forEach(function (bar, index) {
      //         var data = dataset.data[index];
      //         if (data > 0) {
      //           ctx.fillText(data, bar._model.x, bar._model.y - 5);
      //         }
      //       });
      //     });
      //   }
      // }
    };

    this.TotalIrrigatedLandDetail();
    this.IrrigatedLandDetail();
  }


  //pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    title: {
      text: 'कुल सिंचित क्षेत्र ( लाख हेक्टर ) ',
      display: true,
      fontSize: 20,
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];

          let sum = 0;
          let dataArr = this.pieChartData;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          // return label + ' ' +percentage;
          // return percentage;
          return value;
        },
        color: '#fff',
      }
    }
  };
  public pieChartLabels: Label[] = ['First', 'Second', 'Third', 'Fourth'];
  public pieChartData: number[] = [300, 500, 100, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [ChartDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ["#4b77a9",
        "#5f255f",
        "#d21243",
        "#B27200"],
    },
  ];

  TotalIrrigatedLandDetail(): void {
    let datas = this.GraphDatas.filter(x => x.iType == 2);
    // console.log(data);
    // let datas = data.sort((left, right): number => {
    //   if (left.displayOrder < right.displayOrder) return 1;
    //   if (left.displayOrder > right.displayOrder) return -1;
    //   return 0;
    // }); 
    // console.log("data ",data);
    // console.log("s" ,datas);
    this.pieChartData = [];
    this.pieChartLabels = [];

    if (datas.length > 0) {
      let values = datas.map(x => x.dataValues);
      let labels = datas.map(x => x.displayName);
      let maxValue = values.reduce((a, b) => Math.max(a, b));
      maxValue = maxValue / 10;
      maxValue = Math.round(maxValue);
      maxValue = (maxValue + 1) * 10;

      this.pieChartData = values;
      this.pieChartLabels = labels;
    }

  }


  // सिचित क्षेत्रको बिस्तार 
// tslint:disable-next-line: member-ordering
  public IrrigatedLandDetailChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: ' सिंचित क्षेत्रको बिस्तार ( लाख हेक्टर )',
      display: true,
      fontSize: 20,
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'कुल सिंचित क्षेत्र',
            fontSize: 20,
          },
          ticks: {
            min: 0,
            stepSize: 10,
          }
        }],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 12,
        }
      }
    },
  };
  public IrrigatedLandDetailChartData: ChartDataSets[] = [
    { data: [] },
  ];
  public IrrigatedLandDetailChartDataLabels: Label[] = [];

  IrrigatedLandDetail(): void {
    let datas = this.GraphDatas.filter(x => x.iType == 3);
    // console.log(data);
    // let datas = data.sort((left, right): number => {
    //   if (left.displayOrder < right.displayOrder) return 1;
    //   if (left.displayOrder > right.displayOrder) return -1;
    //   return 0;
    // }); 
    // console.log("data ",data);
    // console.log("s" ,datas);
    this.IrrigatedLandDetailChartData[0].data = [];
    this.IrrigatedLandDetailChartDataLabels = [];

    if (datas.length > 0) {
      let values = datas.map(x => x.dataValues);
      let labels = datas.map(x => x.displayName);
      let maxValue = values.reduce((a, b) => Math.max(a, b));
      maxValue = maxValue / 10;
      maxValue = Math.round(maxValue);
      maxValue = (maxValue + 1) * 10;
      this.IrrigatedLandDetailChartData[0].data = values.reverse();
      this.IrrigatedLandDetailChartDataLabels = labels.reverse();
      
    }



  }

  // No Of Projects
  public NoOfProjectsChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: ' Number Of Projects ',
      display: true,
      fontSize: 20,
    },
    scales: {
      yAxes: [
        {
          display: true,
           scaleLabel: {
            display: true,
            labelString: ' सिंचित क्षेत्र',
            fontSize:20,
          },
          ticks: {
            min: 0,
            stepSize: 20,
          },
        }],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 12,
        }
      }
    },
  };
  public NoOfDetailChartData: ChartDataSets[] = [
    { data: [] },
  ];
  public NoOfDetailChartDataLabels: Label[] = [];

  NoOfProjectChartDetail(): void {
    this._GraphDataService.getProjectCountByProgramType()
      .pipe(
        finalize(() => {
          // this.isTableLoading = false;
          this.GCAChartDetail();
        })
      )
      .subscribe((result: GraphData_Dto_ProcedureCall[]) => {
        this.NoOfDetailChartData[0].data = [];
        this.NoOfDetailChartDataLabels = [];
        if (result.length > 0) {
          let das = result.map(x => x.values);
          this.NoOfDetailChartData[0].data = das;
          let Sas = result.map(x => x.displayName);
          this.NoOfDetailChartDataLabels = Sas;
        }
      }, (err) => {
        abp.notify.error("Error Please report us");
        console.log("create ", err);
      });
  }

  //GCA
  public GCAChartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: 'Total GCA (ha) ',
      display: true,
      fontSize: 20,
    },
    scales: {
      yAxes: [
        {
          display: true,
           ticks: {
            min: 0,
            stepSize: 5000,
          },
        }],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 12,
        }
      }
    },
  };
  public GCAChartData: ChartDataSets[] = [
    { data: [] },
  ];
  public GCAChartDataLabels: Label[] = [];

  GCAChartDetail(): void {
    this._GraphDataService.getSumGCACountGroupByProgramTypeAsync()
      .pipe(
        finalize(() => {
          // this.isTableLoading = false;
          // this.AgricultureIrrigationIrrigatedChart();
        })
      )
      .subscribe((result: GraphData_Dto_ProcedureCall[]) => {
        this.GCAChartData[0].data = [];
        this.GCAChartDataLabels = [];
        if (result.length > 0) {
          let das = result.map(x => x.values);
          this.GCAChartData[0].data = das;
          let Sas = result.map(x => x.displayName);
          this.GCAChartDataLabels = Sas;

          // this.GCAChartOptions.scales.ticks.max=100;
          // this.GCAChartOptions.scales.ticks.min=10;
          // this.GCAChartOptions.scales.ticks.stepSize=20;

        }
      }, (err) => {
        abp.notify.error("Error Please report us");
        console.log("create ", err);
      });
  }
}
