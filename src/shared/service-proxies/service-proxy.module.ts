import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,

        ApiServiceProxies.ProjectServiceProxy,
        ApiServiceProxies.UserProjectServiceProxy,
        ApiServiceProxies.DocumentServiceProxy,
        //project Information Proxy Services
        ApiServiceProxies.ProjectInformationServiceProxy,
        ApiServiceProxies.ProjectStatusServiceProxy,
        ApiServiceProxies.ProgramTypeServiceProxy,
        ApiServiceProxies.ProgramInfoServiceProxy,

        //location
        ApiServiceProxies.ProjectLocationInfoServiceProxy,
        ApiServiceProxies.LocationWardRelationServiceProxy,   
        ApiServiceProxies.LocalBodynameServiceProxy,   
        ApiServiceProxies.LocalBodyTypeServiceProxy,
        ApiServiceProxies.DistrictServiceProxy,
        ApiServiceProxies.ProvienceServiceProxy,
        
        //social
        ApiServiceProxies.SocialInformationServiceProxy,
        ApiServiceProxies.EthicInformationServiceProxy,

        //agriculture
        ApiServiceProxies.AgricultreInfoServiceProxy,
        ApiServiceProxies.AgricultureDetailServiceProxy,

        //economic
        ApiServiceProxies.EconomicInformationServiceProxy,

        //ground water
        ApiServiceProxies.GroundWaterServiceProxy,

        //implementation
        ApiServiceProxies.ContractManagementServiceProxy,
        ApiServiceProxies.WUAInfoServiceProxy,
        ApiServiceProxies.WUATrainingsServiceProxy,

        //engineering
        ApiServiceProxies.MainCanalServiceProxy,
        ApiServiceProxies.RiverHydrologyServiceProxy,
        ApiServiceProxies.MainCanalStructureTypeServiceProxy,
        ApiServiceProxies.HeadWorkServiceProxy,
        ApiServiceProxies.BranchCanalServiceProxy,
        ApiServiceProxies.SecondaryCanalServiceProxy,
        ApiServiceProxies.TertiaryCanalServiceProxy,

        ApiServiceProxies.WaterInducedDisasterModelServiceProxy,
        ApiServiceProxies.SpurServiceProxy,
        ApiServiceProxies.EmbankmentServiceProxy,

        //graph
        ApiServiceProxies.GraphDataServiceProxy,

        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
