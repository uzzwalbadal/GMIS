import { AbpSessionService } from '@abp/session/abp-session.service';
import { Dto_UserProjectViewModel, PagedResultDtoOfDto_UserProjectViewModel } from './../../shared/service-proxies/service-proxies';
import { Component, Injector } from '@angular/core';
import { ProjectServiceProxy, Dto_Project, PagedResultDtoOfDto_ProjectUserCount, ListResultDtoOfDto_UserProjectViewModel } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent extends PagedListingComponentBase<Dto_Project> {
  // projects: Dto_Project[] = [];
  projects: Dto_UserProjectViewModel[] = [];

  pagedProjectRequestDto : PagedProjectUserResultRequestDto = new PagedProjectUserResultRequestDto();


  keyword = "";
  constructor(
    injector: Injector,
    private _router: Router,
    private _projectService: ProjectServiceProxy
  ) { 
    super(injector);
  }
  list(
    request: PagedProjectUserResultRequestDto, pageNumber: number, finishedCallback: Function
    ): void {
      request.keyword = this.keyword;
          var tken = sessionStorage.getItem("accesstoken");
          
      this._projectService.getProjectsInDasboard(request.maxResultCount, request.skipCount, )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: PagedResultDtoOfDto_UserProjectViewModel) => {
        let r = result.items;
        this.projects = result.items;
        // console.log(this.projects);
        this.showPaging(result, pageNumber);
      });
  }

  // ngOnInit(){
  // }

  viewProject(dtoProject: Dto_UserProjectViewModel): void{
    // console.log("asdfasd");
    sessionStorage.setItem("projectId",dtoProject.projectId);
    sessionStorage.setItem("projectName",dtoProject.projectName);
    this._router.navigate(['/gmis/information']);
    // console.log("Done");
  }


  protected delete(entity: Dto_Project): void {
    //
  }

  //sd
}
class PagedProjectUserResultRequestDto extends PagedRequestDto {
  keyword: string;
}