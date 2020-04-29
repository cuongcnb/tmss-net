import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'criteria-two',
  templateUrl: './criteria-two.component.html',
  styleUrls: ['./criteria-two.component.scss']
})
export class CriteriaTwoComponent implements OnInit {

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
      dateNumber: [undefined],
      typeDV: [undefined],
    });
  }
}
