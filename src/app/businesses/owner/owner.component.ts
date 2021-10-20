import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../business';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  hide = true;
  business!: Business;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.parent!.data
    .subscribe(data => {
      const business: Business = data.business;
      this.business = business;
    });
  }

  submit() {

  }

  cancel() {
    const businessId = this.business ? this.business.bid : null;
    this.router.navigate(['/business', businessId, 'detail']);
  }
}
