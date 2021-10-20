import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      username: '',
      password: '',
    });
  }

  ngOnInit(): void {
  }

  submit():void {
    const user = {
      username: this.form.get('username')!.value,
      password: this.form.get('password')!.value,
    }
    this.authService.register(user).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err.error.message);
        this._snackBar.open(err.error.message, 'Got it');
      }
    );
  }
}
