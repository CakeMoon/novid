import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';


@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
  ]
})
export class AuthModule { }
