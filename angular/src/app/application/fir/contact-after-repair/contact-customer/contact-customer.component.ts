import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contact-customer',
  templateUrl: './contact-customer.component.html',
  styleUrls: ['./contact-customer.component.scss']
})
export class ContactCustomerComponent implements OnInit {
  conTact1: Array<any>;
  conTact2: Array<any>;
  form: FormGroup ;
  constructor(
    private formbuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.conTact1 = [
      {headerName: 'Tên câu hỏi', headerTooltip: 'Tên câu hỏi', field: 'nameQuestion'},
      {headerName: 'Có', headerTooltip: 'Có', field: 'yes'},
      {headerName: 'Không', headerTooltip: 'Không', field: 'no'},
      {headerName: 'Ý kiến khách hàng', headerTooltip: 'Ý kiến khách hàng', field: 'comment'}
    ];
    this.conTact2 = [
      {headerName: 'Tên câu hỏi', headerTooltip: 'Tên câu hỏi', field: 'nameQuestion'},
      {headerName: 'Có', headerTooltip: 'Có', field: 'yes'},
      {headerName: 'Không', headerTooltip: 'Không', field: 'no'},
      {headerName: 'Ý kiến khách hàng', headerTooltip: 'Ý kiến khách hàng', field: 'comment'}
    ];
  }
  onSubmit() {}
  private buildForm() {
    this.form = this.formbuilder.group({
      comment: [undefined],
    });
  }
}
