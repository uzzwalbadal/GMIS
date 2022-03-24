import { ProjectServiceProxy } from '@shared/service-proxies/service-proxies';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable()
export class ProjectDataGuardService implements CanActivate {

    constructor(
        private _router: Router,
        private _projectServiceProxy: ProjectServiceProxy) {}

    canActivate(): boolean {
        let projectId = sessionStorage.getItem("projectId");
        let projectName = sessionStorage.getItem("projectName");

        if (projectId == null || projectId === undefined || projectName == null || projectName == "" || projectName === undefined ) {
            this._router.navigate(['/gmis/dashboard']);
            return false;
        } else {
            this._projectServiceProxy.validateUserAndProjectId(projectId)
                .subscribe((result: boolean) => {
                    // console.log("Hello From Route Gurad" ,result)

                    if (!(result)) {
                        abp.notify.error("Project Id Not Found");
                        this._router.navigate(['/gmis/dashboard']);
                        return false;
                    }
                    // abp.notify.error("Project Id Found");
                    return true;
                });
                return true;
        }
        // this._router.navigate(['/gmis/dashboard']);
        // return false;
    }

}