import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Business } from '../business';
import { BusinessService } from '../business.service';
import { TokenStorageService } from '../../auth/token-storage.service';
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

  constructor(
    private businessService: BusinessService,
    private tokenStorageService: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.businessService.businessList$.subscribe(newList => {
      this.businessList = newList;
    })

    this.toggle.valueChanges
    .subscribe(toggle => {
      if (toggle === 'all') {
        this.businessService.getBusinessList();
      } 
      if (toggle === 'favorite') {
        this.businessService.getFavoriteList();
      }
      this.searchedName.setValue('', { emitEvent: false });
    })

    this.searchedName.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe(name => {
      if (name.length === 0) {
        if (this.toggle.value === 'all') {
          this.businessService.getBusinessList();
        }
        if (this.toggle.value === 'favorite') {
          this.businessService.getFavoriteList();
        }
      } else {
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

  addFavorite(bid: number) {

  }

  deleteFavorite(bid: number) {
    
  }

  showFavorites() {

  }

  showAll() {

  }
}
