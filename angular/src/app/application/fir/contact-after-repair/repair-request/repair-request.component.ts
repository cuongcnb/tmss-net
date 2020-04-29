import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-request',
  templateUrl: './repair-request.component.html',
  styleUrls: ['./repair-request.component.scss']
})
export class RepairRequestComponent implements OnInit {
  @Input() selectedData;
  form: FormGroup;
  constructor(
    private formbuider: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.form = this.formbuider.group({ comment: [undefined], });
  }
}
