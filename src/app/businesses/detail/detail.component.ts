import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../business';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  business!: Business;
  prompList!: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.parent!.data
      .subscribe(data => {
        const business: Business = data.business;
        this.business = business;
      });

    
  }

  gotoReview() {
    const businessId = this.business ? this.business.bid : null;
    // Pass along the crisis id if available
    // so that the CrisisListComponent can select that crisis.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises
    console.log(businessId);
    this.router.navigate(['/business', businessId, 'review']);
  }

  gotoEdit() {
    const businessId = this.business ? this.business.bid : null;
    // Pass along the crisis id if available
    // so that the CrisisListComponent can select that crisis.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises
    this.router.navigate(['/business', businessId, 'edit']);
  }

  gotoClaim() {
    const businessId = this.business ? this.business.bid : null;
    // Pass along the crisis id if available
    // so that the CrisisListComponent can select that crisis.
    // Add a totally useless `foo` parameter for kicks.
    // Relative navigation back to the crises
    this.router.navigate(['/business', businessId, 'claim']);
  }
}
