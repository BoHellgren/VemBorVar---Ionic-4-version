import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ShowFloorPage } from './show-floor/show-floor.page';

 const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'show-floor', loadChildren: './show-floor/show-floor.module#ShowFloorPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
