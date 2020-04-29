import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-vehicle-registration',
  templateUrl: './vehicle-registration.component.html',
  styleUrls: ['./vehicle-registration.component.scss']
})
export class VehicleRegistrationComponent implements OnInit {

  screenHeight;
  form: FormGroup;
  firstFocus;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  onResize() {
    this.screenHeight = window.innerHeight - 150;
  }

  search() {

  }

  clear() {

  }

  KeyUpEnter() {

  }

  verifyRegisterNo(form) {

  }

  onFocus() {

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      vinno: [undefined],
      modelCode: [undefined],
      isNotSoldYetVehicle: [undefined],
      isInternalWarranty: [undefined]
    });
  }
}
