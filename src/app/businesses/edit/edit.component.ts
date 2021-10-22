import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business, Operation } from '../business';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Info } from '../info';
import { BusinessService } from '../business.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  business!: Business;
  form!: FormGroup;
  businessSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private businessService: BusinessService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    // // Resolve
    // this.route.parent!.data
    // .subscribe(data => {
    //   const business: Business = data.business;
    //   this.business = business;

    //   const operations = this.business.operations.reduce((acc, curr) => {
    //     console.log(acc);
    //     return {...acc, [curr.label]: curr.value === 1}
    //   }, {});

    //   this.form = this.fb.group({
    //     vcode: '',
    //     operations: this.fb.group(operations),
    //   });
    // });

    this.businessSubscription = this.businessService.business$
      .subscribe(newBusiness =>{
        this.business = newBusiness;
      });

    console.log(this.business);

    const operations = this.business.operations.reduce((acc, curr) => {
      console.log(acc);
      return {...acc, [curr.label]: curr.value === 1}
    }, {});

    this.form = this.fb.group({
      vcode: '',
      operations: this.fb.group(operations),
    });
  }

  save() {

    console.log(this.business);

    const data = {
      vcode: this.form.get('vcode')?.value,
      delivery: this.form.get(['operations', 'delivery'])?.value ? 1 : 0,
      takeout: this.form.get(['operations', 'takeout'])?.value ? 1 : 0,
      indoor: this.form.get(['operations', 'indoor'])?.value ? 1 : 0,
      outdoor: this.form.get(['operations', 'outdoor'])?.value ? 1 : 0,
    } as Info;
    
    // this.business = {
    //   bid: this.business.bid,
    //   name: this.business.name,
    //   address: this.business.address,
    //   operations: [
    //     { label: 'delivery',
    //       value: data.delivery, } as Operation,
    //     { label: 'takeout',
    //       value: data.takeout, } as Operation,
    //     { label: 'outdoor',
    //       value: data.outdoor, } as Operation,
    //     { label: 'indoor',
    //       value: data.indoor, } as Operation,
    //   ],
    //   rating: this.business.rating,
    //   numReviews: this.business.numReviews,
    // } as Business;

    this.businessService.editBusinesses(data, this.business.bid).subscribe(
      data => {
        this.business.operations[0].value = data.delivery;
        this.business.operations[1].value = data.takeout;
        this.business.operations[2].value = data.indoor;
        this.business.operations[3].value = data.outdoor;

        this._snackBar.open(data.message, '', { duration: 1000 });
        setTimeout(() => {
          this.gotoDetail();
        }, 1000);
      },
      err => {
        console.log(err);
        this._snackBar.open(err.error.message, 'Got it', { duration: 1000 });
      }
    )
  }

  gotoDetail() {
    const businessId = this.business ? this.business.bid : null;
    console.log(businessId);
    this.router.navigate(['/business', businessId, 'detail']);
  }

  cancel() {
    this.form.controls['vcode'].setValue('');
    this.business.operations.forEach(operation =>{
      this.form.get(['operations', operation.label])!.setValue(operation.value);
    });
    const businessId = this.business ? this.business.bid : null;
    this.router.navigate(['/business', businessId]);
  }
}
