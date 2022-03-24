import { Component, OnInit, Injector, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { finalize } from 'rxjs/operators';
import {
    Dto_Project, ProjectServiceProxy, GraphDataServiceProxy, Dto_GraphData,
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'graphdata-dialog.component.html',
    styles: [
        `
        mat-form-field {
          width: 100%;
        }
        mat-checkbox {
          padding-bottom: 5px;
        }
      `
    ]
})

export class GraphDataDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    Dto_GraphData: Dto_GraphData = new Dto_GraphData();

    constructor(
        injector: Injector,
        private _GraphDataService: GraphDataServiceProxy,
        private _dialogRef: MatDialogRef<GraphDataDialogComponent>,

        @Inject(MAT_DIALOG_DATA)
        public GraphDatas: Dto_GraphData
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // console.log(this.GraphDatas);
        this.Dto_GraphData = this.GraphDatas;
    }

    save(): void {
        this.saving = true;

        if (this.Dto_GraphData.id > 0) {
            this._GraphDataService.update(this.Dto_GraphData)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                )
                .subscribe((result) => {
                    this.notify.info("Updated Successfully");
                    this.close(result.iType);
                });
        } else {
            this._GraphDataService.create(this.Dto_GraphData)
                .pipe(
                    finalize(() => {
                        this.saving = false;
                    })
                )
                .subscribe((result) => {
                    this.notify.info("Added Successfully");
                    this.close(result.iType);
                });
        }

    }

    close(result: number): void {
        this._dialogRef.close(result);
    }
}