import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'relative-info',
  templateUrl: './relative-info.component.html',
  styleUrls: ['./relative-info.component.scss']
})
export class RelativeInfoComponent implements OnInit {

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
      relationship: [undefined, Validators.required]
    });
  }

}
