import { TestBed } from '@angular/core/testing';

import { ReviewGuard } from './review.guard';

describe('ReviewGuard', () => {
  let guard: ReviewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReviewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
