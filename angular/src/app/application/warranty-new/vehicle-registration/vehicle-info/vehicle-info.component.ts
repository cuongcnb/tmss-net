import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.scss']
})
export class VehicleInfoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  searchVehicle() {

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      vinno: [undefined, Validators.required],
      dlrAbbreviation: [undefined, Validators.required],
      colorNo: [undefined, Validators.required],
      engineNo: [undefined, Validators.required],
      lineOffDate: [undefined, Validators.required],
      deliveryDate: [undefined],
      saleDate: [undefined],
      pdsDate: [undefined]
    });
  }

}
