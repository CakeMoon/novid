import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-read-only-rating',
  templateUrl: './read-only-rating.component.html',
  styleUrls: ['./read-only-rating.component.scss']
})
export class ReadOnlyRatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() starCount: number = 5;

  ratingArr: number[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
