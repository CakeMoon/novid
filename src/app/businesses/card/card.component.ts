import { Component, Input, OnInit } from '@angular/core';
import { Business } from '../business';
import { TokenStorageService } from '../../auth/token-storage.service';
import { BusinessService } from '../business.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() business!: Business;
  isLoggedIn: boolean = false;
  isFavorite: boolean = false;
  subscription!: Subscription;

  constructor(
    private tokenStorageService: TokenStorageService,
    private businessService: BusinessService,
    ) { 
    this.isLoggedIn = !!this.tokenStorageService.getToken();

  }

  ngOnInit(): void {
    this.subscription = this.businessService.checkFavorite(this.business.bid)
      .subscribe(isFavorite => this.isFavorite = isFavorite)
  }

  addFavorite() {
    this.businessService.addFavorite(this.business.bid);
    this.isFavorite = true;
  }

  deleteFavorite() {
    this.businessService.deleteFavorite(this.business.bid);
    this.isFavorite = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
