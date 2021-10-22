import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReviewComponent } from './review/review.component';
import { EditComponent } from './edit/edit.component';
import { OwnerComponent } from './owner/owner.component';
import { DetailResolverService } from './detail-resolver.service';
import { ClaimGuard } from '../auth/claim.guard';
import { ReviewGuard } from '../auth/review.guard';

import { AuthGuard } from '../auth/auth.guard';
import { OwnerGuard } from '../auth/owner.guard';

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
            canActivate: [ReviewGuard],
          },
          {
            path: 'claim',
            component: OwnerComponent,
            canActivate: [ClaimGuard],
          },
          {
            path: 'edit',
            component: EditComponent,
            canActivate: [OwnerGuard],
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
