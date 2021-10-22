import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserGuard } from './user.guard';

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent, canActivate: [UserGuard],},
  { path: 'sign-in', component: SignInComponent, canActivate: [UserGuard], },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
