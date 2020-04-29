import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {state} from '../../../../../core/constains/ro-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-refer',
  templateUrl: './customer-refer.component.html',
  styleUrls: ['./customer-refer.component.scss']
})
export class CustomerReferComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() data;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  disabledCustomerRefer = [state.lsc, state.working, state.stopWork, state.complete, state.settlement, state.cancel];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
    if (this.data) {
      this.checkForm();
      if ((!this.data.cusVisit || Number(this.data.cusVisit.cusstate) !== 1)) {
        this.disable();
      }
    }
  }

  ngOnInit() {
    this.checkForm();
  }

  ngAfterViewInit(): void {

  }

  removeCustomerReferInfo() {
    this.form.patchValue({
      name: null,
      tel: null,
      address: null,
      email: null
    });
  }

  checkForm() {
    const formControls = ['name', 'tel', 'address', 'email'];
    this.form.get('type').valueChanges.subscribe(val => {
      if (this.data && this.data.repairOrder && this.disabledCustomerRefer.includes(this.data.repairOrder.rostate)
        && (!this.data.cusVisit || Number(this.data.cusVisit.cusstate) !== 1) && this.data.repairOrder.cusvsId === this.data.cusVisit.id) {
        formControls.forEach(ctrl => this.form.get(ctrl).disable());
      } else {
        if (val && val !== '1') {
          formControls.forEach(ctrl => this.form.get(ctrl).enable());
        } else {
          formControls.forEach(ctrl => {
            this.form.controls[ctrl].disable();
            this.form.controls[ctrl].setValue('');
          });
        }
      }
    });
  }

  disable() {
    const formControls = ['name', 'tel', 'address', 'email'];
    if (this.data && this.data.repairOrder && this.disabledCustomerRefer.includes(this.data.repairOrder.rostate)) {
      formControls.forEach(ctrl => this.form.get(ctrl).disable());
      return;
    }
    if (this.data && !this.data.vehicle) {
      formControls.forEach(ctrl => this.form.get(ctrl).disable());
    }
  }

}
