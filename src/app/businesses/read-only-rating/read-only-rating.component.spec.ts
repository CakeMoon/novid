import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyRatingComponent } from './read-only-rating.component';

describe('ReadOnlyRatingComponent', () => {
  let component: ReadOnlyRatingComponent;
  let fixture: ComponentFixture<ReadOnlyRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadOnlyRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
