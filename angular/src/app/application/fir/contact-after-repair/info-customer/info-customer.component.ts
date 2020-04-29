import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-customer',
  templateUrl: './info-customer.component.html',
  styleUrls: ['./info-customer.component.scss']
})
export class InfoCustomerComponent implements OnInit, OnChanges {
  @Input() detailData;
  form: FormGroup;
  fieldGrid;
  tabs: Array<any>;
  selectedTab;
  data;
  params;
  gridParams;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.detailData) {
      this.form.patchValue(this.detailData);
    }
    this.buildForm();
  }

  onSubmit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      carownerName: [{ value: undefined , disabled: true} ],
      phoneNumber: [{ value: undefined , disabled: true} ],
      companyName: [{ value: undefined , disabled: true} ],
      email: [{
        value: undefined,
        disabled: true
      }],
      address: [{ value: undefined , disabled: true} ],
      licensePlate: [{ value: undefined , disabled: true} ],
      moDel: [{ value: undefined , disabled: true } ],
      carName: [{ value: undefined , disabled: true} ],
      namecarCome: [{ value: undefined , disabled: true} ],
      sumKm: [{ value: undefined , disabled: true} ],
      roleName: [{ value: undefined , disabled: true} ],
      vinNo: [{ value: undefined , disabled: true} ],
    });
    if (this.detailData) {
      this.form.patchValue(this.detailData);
    }
  }
}
