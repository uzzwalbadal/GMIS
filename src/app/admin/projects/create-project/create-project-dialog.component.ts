import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MatDialogRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { 
  Dto_Project, ProjectServiceProxy ,
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'create-project-dialog.component.html',
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

  export class CreateProjectDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  project: Dto_Project = new Dto_Project();
  
  constructor(
    injector: Injector,
    private _projectService: ProjectServiceProxy,
    private _dialogRef: MatDialogRef<CreateProjectDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this._projectService
      .create(this.project)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result) => {
        console.log("Create");
        console.log(result);
        this.notify.info(this.l('New Project Added Successfully'));
        this.close(true);
      });
  }

  close(result: any): void {
    this._dialogRef.close(result);
  }
}