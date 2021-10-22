import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReviewComponent } from './review/review.component';
import { EditComponent } from './edit/edit.component';
import { OwnerComponent } from './owner/owner.component';
import { DetailResolverService } from './detail-resolver.service';

import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'business',
    component: HomeComponent,
    children: [

      {
        path: ':id',
        // resolve: {
        //   business: DetailResolverService
        // },
        // runGuardsAndResolvers: "always",
        children: [
          {
            path: '',
            redirectTo: 'detail',
            pathMatch: 'full'
          },
          {
            path: 'detail',
            component: DetailComponent,
          },
          {
            path: 'review',
            component: ReviewComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'claim',
            component: OwnerComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit',
            component: EditComponent,
            canActivate: [AuthGuard],
          },
        ]
      },

      {
        path: '',
        component: WelcomeComponent,
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessesRoutingModule { }
