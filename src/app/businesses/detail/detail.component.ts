import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../business';
import { Subscription } from 'rxjs';
import { ReviewService } from '../review.service';
import { BusinessService } from '../business.service';
import { Prompt } from '../prompt';
import { Review } from '../review';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  business!: Business;
  promptList: Prompt[] = [];
  reviewList: Review[] = [];
  promptsSubscription!: Subscription;
  reviewsSubscription!: Subscription;
  businessSubscription!: Subscription;
  owned = false;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private businessService: BusinessService,
  ) { }

  ngOnInit(): void {
    // // Resolve
    // this.route.parent!.data
    //   .subscribe(data => {
    //     console.log(data);
    //     const business: Business = data.business;
    //     this.business = business;
    //   });

    this.businessSubscription = this.businessService.business$
      .subscribe(newBusiness =>{
        this.business = newBusiness;
      });
      
    this.promptsSubscription = this.reviewService.prompts$.subscribe(newList => {
      this.promptList = newList;
    });

    console.log(this.business.bid);
    this.reviewService.getPrompts(this.business.bid);

    this.promptsSubscription = this.reviewService.reviews$.subscribe(newList => {
      this.reviewList = newList;
    });

    this.reviewService.getReviews(this.business.bid);
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
