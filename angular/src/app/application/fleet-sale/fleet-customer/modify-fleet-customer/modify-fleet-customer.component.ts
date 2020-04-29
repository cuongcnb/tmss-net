import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash';
import { FleetCustomerService} from '../../../../api/fleet-sale/fleet-customer.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-fleet-customer',
  templateUrl: './modify-fleet-customer.component.html',
  styleUrls: ['./modify-fleet-customer.component.scss']
})
export class ModifyFleetCustomerComponent implements OnInit {
  @ViewChild('modifyFleetCustomer', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fleetCustomerService: FleetCustomerService
  ) {
  }

  ngOnInit() {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid || isEqual(this.form.value, {
      id: '',
      code: '',
      name: '',
      address: '',
      phone: '',
      fax: '',
      email: '',
      contactPerson: '',
      contactPersonAddress: '',
      contactPersonPhone: ''
    })) {
      return;
    }
    const apiCall = !this.selectedData ?
      this.fleetCustomerService.createNewFleetCustomer(this.form.value) : this.fleetCustomerService.updateFleetCustomer(this.form.value);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
    }, () => {
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      code: ['', Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      name: ['', Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(100)])],
      address: ['', GlobalValidator.maxLength(2000)],
      phone: ['', GlobalValidator.phoneFormat],
      fax: ['', GlobalValidator.phoneFormat],
      email: ['', Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      contactPerson: ['', GlobalValidator.maxLength(50)],
      contactPersonAddress: ['', GlobalValidator.maxLength(2000)],
      contactPersonPhone: ['', GlobalValidator.phoneFormat],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
