import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Business } from '../business';
import { BusinessService } from '../business.service';
import { TokenStorageService } from '../../auth/token-storage.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  businessList: Business[] = [];
  selectedId = 0;
  searchedName = new FormControl('');
  toggle = new FormControl('all');
  subscription!: Subscription;

  constructor(
    private businessService: BusinessService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.businessService.businessList$.subscribe(newList => {
      this.businessList = newList;
    })

    this.toggle.valueChanges
    .subscribe(toggle => {
      if (toggle === 'all') {
        this.subscription.unsubscribe();
        this.subscription = this.businessService.businessList$.subscribe(newList => {
          this.businessList = newList;
        })
      } 
      if (toggle === 'favorite') {
        this.subscription.unsubscribe();
        this.subscription = this.businessService.favoriteList$.subscribe(newList => {
          this.businessList = newList;
        })
      }
      this.searchedName.setValue('', { emitEvent: false });
    })

    this.searchedName.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe(name => {
      if (name.length !== 0) {
        if (this.toggle.value === 'all') {
          this.businessService.search(name);
        }
        if (this.toggle.value === 'favorite') {
          this.businessService.searchFavorites(name);
        }
      }
    })
  }

  search() {
    const name = this.searchedName.value;
    if (name.length === 0) {
      this.businessService.getBusinessList();
    } else {
      this.businessService.search(name);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
