import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';

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
    private router: Router,
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
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.data);
        this.authService.isLoggedIn$.next(true);
        this.authService.username$.next(user.username);
        this._snackBar.open('Welcome!', '', { duration: 1000 });
        setTimeout(() => {
          this.router.navigate(['/business']);
        }, 1000);
      },
      err => {
        console.log(err);
        this._snackBar.open(err.error.message, 'Got it', { duration: 1000 });
      }
    );
    
  }

  reloadPage(): void {
    window.location.reload();
  }
}
