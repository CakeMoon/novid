import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../business';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  hide = true;
  business!: Business;
  authcode = new FormControl('');;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.route.parent!.data
    .subscribe(data => {
      const business: Business = data.business;
      this.business = business;
    });
  }

  submit() {
    this.authService.claim(this.authcode.value, this.business.bid).subscribe(
      data => {
        this._snackBar.open(data.message, '', { duration: 1000 });
        setTimeout(() => {
          this.gotoDetail();
        }, 1000);
      },
      err => {
        console.log(err);
        this._snackBar.open(err.error.message, 'Got it');
      }
    )
  }

  cancel() {
    const businessId = this.business ? this.business.bid : null;
    this.router.navigate(['/business', businessId, 'detail']);
  }

  gotoDetail() {
    const businessId = this.business ? this.business.bid : null;
    console.log(businessId);
    this.router.navigate(['/business', businessId, 'detail']);
  }
}
