import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { DetailComponent } from './detail/detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReviewComponent } from './review/review.component';
import { EditComponent } from './edit/edit.component';
import { OwnerComponent } from './owner/owner.component';
import { DetailResolverService } from './detail-resolver.service';

const routes: Routes = [
  { path: 'business',
    component: HomeComponent,
    children: [

      {
        path: ':id',
        component: ContentComponent,
        resolve: {
          business: DetailResolverService
        },
        children: [
          {
            path: 'detail',
            component: DetailComponent,
          },
          {
            path: 'review',
            component: ReviewComponent,
          },
          {
            path: 'claim',
            component: OwnerComponent,
          },
          {
            path: 'edit',
            component: EditComponent,
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
