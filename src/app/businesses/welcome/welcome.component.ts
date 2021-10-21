import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../auth/token-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isLoggedIn = false;
  title = 'Welcome to NOvid';
  headerText = 'Looking for a safe place to dine?';
  text = 'NOvid provides ratings and reviews about how well restaurants \
    are adhering to COVID-safe practices. You can leave reviews \
    about how well you think restaurants are following COVID-safety guidelines.';

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  ngOnInit(): void {
  }

  gotoSignIn() {
    this.router.navigate(['/sign-in']);
  }

  gotoSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
