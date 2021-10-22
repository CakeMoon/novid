import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';

import { BusinessesRoutingModule } from './businesses-routing.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';

import { DetailComponent } from './detail/detail.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { EditComponent } from './edit/edit.component';
import { OwnerComponent } from './owner/owner.component';
import { ReviewComponent } from './review/review.component';
import { CardComponent } from './card/card.component';
import { RatingComponent } from './rating/rating.component';
import { ReadOnlyRatingComponent } from './read-only-rating/read-only-rating.component';
import { ReviewCardComponent } from './review-card/review-card.component';


@NgModule({
  declarations: [
    HomeComponent,
    DetailComponent,
    WelcomeComponent,
    EditComponent,
    OwnerComponent,
    ReviewComponent,
    CardComponent,
    RatingComponent,
    ReadOnlyRatingComponent,
    ReviewCardComponent,
  ],
  imports: [
    CommonModule,
    BusinessesRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatSidenavModule,
  ]
})
export class BusinessesModule { }
