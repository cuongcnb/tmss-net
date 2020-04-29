import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      ownerName: [undefined, Validators.required],
      address: [undefined, Validators.required],
      phone: [undefined, Validators.required],
      province: [undefined, Validators.required],
      district: [undefined, Validators.required]
    });
  }

}
