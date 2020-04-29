import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'criteria-one',
  templateUrl: './criteria-one.component.html',
  styleUrls: ['./criteria-one.component.scss']
})
export class CriteriaOneComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      dateAppointment: [undefined],
      dateAppointmentTo: [undefined],
      fromDateTo: [undefined],
      fromDate: [undefined],
      typeDV: [undefined],
      dateNumber: [undefined],
      isList: [undefined],
    });
  }
}
