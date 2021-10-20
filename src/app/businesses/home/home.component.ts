import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Business } from '../business';
import { BusinessService } from '../business.service';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  businessList$!: Observable<Business[]>;
  selectedId = 0;
  searchedName = new FormControl('');

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.businessList$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = parseInt(params.get('id')!, 10);
        return this.businessService.getBusinessList();
      })
    );
    this.searchedName.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe(name => {
      this.businessList$ = this.businessService.search(name);
    })
  }

  search() {
    this.businessList$ = this.businessService.search(this.searchedName.value);
  }
}
