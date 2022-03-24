import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, Injector } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { PagedRequestDto, PagedListingComponentBase } from "@shared/paged-listing-component-base";
import { finalize } from 'rxjs/operators';

import { 
  Dto_Project, ProjectServiceProxy,PagedResultDtoOfDto_Project,PagedResultDtoOfDto_ProjectUserCount
} from './../../../shared/service-proxies/service-proxies';
import { CreateProjectDialogComponent } from './create-project/create-project-dialog.component';
import { AddUserToProjectDialogComponent } from './user-project/user-project-dialog.component';


class PagedProjectUserResultRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
    templateUrl: "./project-view.component.html",
    animations: [appModuleAnimation()],
    styles: [
     
    ]
  })

  export class ProjectViewComponent extends PagedListingComponentBase<Dto_Project> {
    projects: Dto_Project[] = [];
    pagedProjectRequestDto : PagedProjectUserResultRequestDto = new PagedProjectUserResultRequestDto();
  
    keyword = "";

    constructor(
      injector: Injector,
      private _projectService: ProjectServiceProxy,
      private _dialog: MatDialog
    ) {
  
      super(injector);
    }

    list(
      request: PagedProjectUserResultRequestDto, pageNumber: number, finishedCallback: Function
      ): void {
        request.keyword = this.keyword;

        this._projectService.getAllWithUserCount(request.maxResultCount, request.skipCount, )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result: PagedResultDtoOfDto_ProjectUserCount) => {
          this.projects = result.items;
          // console.log(this.projects);
          this.showPaging(result, pageNumber);
        });
    }

    protected delete(entity: Dto_Project): void {
      abp.message.confirm(
        "Delete Project '" + entity.name + "'?",
        (result: boolean) => {
          if (result) {
            this._projectService.delete(entity.id)
              .subscribe(() => {
                abp.notify.info("Deleted Project: " + entity.name);
                this.refresh();
              });
          }
        }
      );
    }

    // AddUserToProjectDialogComponent
    addUserToProject(project: Dto_Project): void{
      this.addNewProjectOraddUserToProjectDialog(project);
    }

    addNewProject(): void {
      this.addNewProjectOraddUserToProjectDialog();
    }

    addNewProjectOraddUserToProjectDialog(project?: Dto_Project): void {
      let projectHelperDialog;
      if (project === undefined || project == null) {
        projectHelperDialog = this._dialog.open(CreateProjectDialogComponent);
      } else {
        projectHelperDialog = this._dialog.open(AddUserToProjectDialogComponent, {
              data: project
          });
      }

      projectHelperDialog.afterClosed().subscribe(result => {
          if (result) {
              this.refresh();
          }
      });
  }
  }