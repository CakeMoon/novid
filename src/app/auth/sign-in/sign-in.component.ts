import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from '../token-storage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private tokenStorage: TokenStorageService,
  ) {
    this.form = this.fb.group({
      username: '',
      password: '',
    });
  }

  ngOnInit(): void { }

  submit(): void {
    const user = {
      username: this.form.get('username')!.value,
      password: this.form.get('password')!.value,
    }
    this.authService.login(user).subscribe(
      data => {
        console.log(data.data);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.data);
        this.reloadPage();
      },
      err => {
        console.log(err.error.message);
        this._snackBar.open(err.error.message, 'Got it');
      }
    );
    
  }

  reloadPage(): void {
    window.location.reload();
  }
}
