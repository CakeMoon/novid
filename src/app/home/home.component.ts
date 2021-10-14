import { Component, OnInit } from '@angular/core';
import { Business } from '../interface/business';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  businessList: Business[] = [];

  constructor(private businessService: BusinessService) { }

  ngOnInit(): void {
    console.log("!!!!");
    this.businessService.businessList$.subscribe(businesses => {
      this.businessList = businesses;
    });
    console.log(this.businessList);
  }
}
