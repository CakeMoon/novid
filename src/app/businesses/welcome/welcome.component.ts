import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  title = 'Welcome to NOvid';
  headerText ='Looking for a safe place to dine?';
  text ='NOvid provides ratings and reviews about how well restaurants \
    are adhering to COVID-safe practices. You can leave reviews \
    about how well you think restaurants are following COVID-safety guidelines.';

  constructor() { }

  ngOnInit(): void {
  }

}
