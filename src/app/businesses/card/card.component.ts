import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() event = new EventEmitter<string>();
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
    this.event.emit('modified');
  }

  deleteFavorite() {
    this.businessService.deleteFavorite(this.business.bid);
    this.isFavorite = false;
    this.event.emit('modified');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
