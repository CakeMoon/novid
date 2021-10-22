import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../business';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { BusinessService } from '../business.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  hide = true;
  business!: Business;
  authcode = new FormControl('');
  businessSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private businessService: BusinessService,
  ) {
  }

  ngOnInit(): void {
    // // For resolver
    // this.route.parent!.data
    // .subscribe(data => {
    //   const business: Business = data.business;
    //   this.business = business;
    // });
    this.businessSubscription = this.businessService.business$
      .subscribe(newBusiness =>{
        this.business = newBusiness;
      });

  }

  submit() {
    this.authService.claim(this.authcode.value, this.business.bid).subscribe(
      data => {
        this._snackBar.open(data.message, '', { duration: 1000 });
        setTimeout(() => {
          this.businessService.getBusiness(this.business.bid);
          this.gotoDetail();
        }, 1000);
      },
      err => {
        console.log(err);
        this._snackBar.open(err.error.message, 'Got it', { duration: 1000 });
      }
    )
  }

  cancel() {
    const businessId = this.business ? this.business.bid : null;
    this.router.navigate(['/business', businessId, 'detail']);
  }

  gotoDetail() {
    const businessId = this.business ? this.business.bid : null;
    setTimeout(() => {
      this.router.navigate(['/business', businessId, 'detail']);
    }, 1000);
  }
}
