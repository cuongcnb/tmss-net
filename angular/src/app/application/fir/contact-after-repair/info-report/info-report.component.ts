import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-report',
  templateUrl: './info-report.component.html',
  styleUrls: ['./info-report.component.scss']
})
export class InfoReportComponent implements OnInit {
  sumRepair;
  form: FormGroup ;
  selectedData: ContactCustomModel;
  constructor(
    private formBuider: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.sumRepair = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', field: ''},
      {headerName: 'Ngày vào', headerTooltip: 'Ngày vào', field: 'dayCome'},
      {headerName: 'Ngày ra', headerTooltip: 'Ngày ra', field: 'dayOut'}
    ];
  }
  private buildForm() {
    this.form = this.formBuider.group({
      contactPerson: [undefined],
      hourContact: [undefined],
      contacted: [undefined],
      contactResult: [undefined],
      dayContact: [undefined],
      sources: [undefined],
      reason: [undefined],
    });
    this.form.get('contactResult').valueChanges.subscribe(value => {
      if (value === 'fail' || value === 'notContact') {
        this.form.get('reason').enable();
      }
      if (value === 'success') {
        this.form.get('reason').disable();
      }
    });
  }
  onSubmit() {}

}
