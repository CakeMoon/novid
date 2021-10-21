import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReviewService } from '../review.service';
import { Prompt } from '../prompt';
import { Business } from '../business';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  business!: Business;
  text: string = '';
  hide = true;
  ratings = [0, 0, 0, 0];
  vcode = '';
  prompts: Prompt[] = [];
  subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.route.parent!.data
    .subscribe(data => {
      const business: Business = data.business;
      this.business = business;
    });

    this.subscription = this.reviewService.prompts$.subscribe(newList => {
      this.prompts = newList;
    });
  }

  submit() {
    const ratingList = [];
    for (let i = 1; i <= this.ratings.length; i++) {
        ratingList.push({promptID: i, response: this.ratings[i-1]})
    }
    const body = { reviewText: this.text, ratings: ratingList, vcode: this.vcode}; 
    this.reviewService.postReview(body, this.business.bid).subscribe(
      data => {
        this._snackBar.open(data.message, '', { duration: 1000 });
        setTimeout(() => {
          this.gotoDetail();
        }, 1000);
      },
      err => {
        console.log(err);
        this._snackBar.open(err.error.message, 'Got it', { duration: 1000 });
      }
    );
  }

  gotoDetail() {
    const businessId = this.business ? this.business.bid : null;
    console.log(businessId);
    this.router.navigate(['/business', businessId, 'detail']);
  }

  rate(score: number, index: number) {
    this.ratings[index] = score;
    console.log(this.ratings);
  }
}