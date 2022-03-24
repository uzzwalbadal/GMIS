import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/gmis/dashboard', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: 'account/account.module#AccountModule', // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'app',
        loadChildren: 'app/app.module#AppModule', // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'gmis',
        loadChildren: 'gmis/gmis.module#GmisModule', // Lazy load account module
        data: { preload: true }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    // imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule {
}
