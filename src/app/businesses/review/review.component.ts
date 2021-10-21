import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    private reviewService: ReviewService
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
    console.log(body);
    this.reviewService.postReview(body, this.business.bid);
  }

  rate(score: number, index: number) {
    this.ratings[index] = score;
    console.log(this.ratings);
  }
}