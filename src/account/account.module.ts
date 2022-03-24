import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap';

import { AbpModule } from '@abp/abp.module';

import { AccountRoutingModule } from './account-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { SharedModule } from '@shared/shared.module';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountLanguagesComponent } from './layout/account-languages.component';

import { LoginService } from './login/login.service';

// tenants
import { TenantChangeComponent } from './tenant/tenant-change.component';
import { TenantChangeDialogComponent } from './tenant/tenant-change-dialog.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { ChartsModule } from 'ng2-charts';
import { BarChartTestComponentComponent } from './bar-chart-test-component/bar-chart-test-component.component';
import { PmapComponent } from './pmap/pmap.component';
import { GeoJsonService } from './pmap/geoJSON.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        JsonpModule,
        AbpModule,
        SharedModule,
        LeafletModule,
        ServiceProxyModule,
        AccountRoutingModule,
        ChartsModule,

        
        ModalModule.forRoot()
    ],
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        AccountLanguagesComponent,
        
        // tenant
        TenantChangeComponent,
        TenantChangeDialogComponent,
        PmapComponent,
        BarChartTestComponentComponent,
    
    ],
    providers: [
        LoginService,GeoJsonService
    ],
    entryComponents: [
        // tenant
        TenantChangeDialogComponent
    ]
})
export class AccountModule {

}
