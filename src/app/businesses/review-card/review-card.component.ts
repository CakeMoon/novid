import { Component, OnInit, Input } from '@angular/core';
import { Review } from '../review';
import { Prompt } from '../prompt';
import { Observable } from 'rxjs';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit {
  @Input() review!: Review;
  promptList$!: Observable<Prompt[]>;

  constructor(
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.promptList$ = this.reviewService.getReivewPrompts(this.review.reviewID);
  }

}
