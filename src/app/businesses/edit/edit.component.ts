import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../business';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  business!: Business;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.parent!.data
    .subscribe(data => {
      const business: Business = data.business;
      this.business = business;

      const operations = this.business.operations.reduce((acc, curr) => {
        console.log(acc);
        return {...acc, [curr.label]: curr.value === 1}
      }, {});

      this.form = this.fb.group({
        vcode: '',
        operations: this.fb.group(operations),
      });
    });
  }

  save() {

  }

  cancel() {
    this.form.controls['vcode'].setValue('');
    this.business.operations.forEach(operation =>{
      this.form.get(['operations', operation.label])!.setValue(operation.value);
    });
    const businessId = this.business ? this.business.bid : null;
    this.router.navigate(['/business', businessId, 'detail']);
  }
}
