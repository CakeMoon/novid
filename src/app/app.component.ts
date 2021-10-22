import { Component } from '@angular/core';
import { TokenStorageService } from './auth/token-storage.service';
import { AuthService } from './auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'novid';
  isLoggedIn = false;
  username = '';

  constructor(
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.username$.subscribe(username => {
      this.username = username;
    });
  }

  signOut(): void {
    this.tokenStorageService.signOut();
    this.authService.isLoggedIn$.next(false);
    this.authService.username$.next('');
    this._snackBar.open('Bye！', '', { duration: 1000 });
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
}
