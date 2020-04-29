import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'crm-action',
  templateUrl: './crm-action.component.html',
  styleUrls: ['./crm-action.component.scss'],
})
export class CrmActionComponent implements OnInit {
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
      maintainDate: [{value: undefined, disabled: true}],
      isMaintain: [{value: undefined, disabled: true}],
      callingDate: [{value: undefined, disabled: true}],
      mailingDate1: [{value: undefined, disabled: true}],
      maintainContent: [{value: undefined, disabled: true}],
      mailingDate2: [{value: undefined, disabled: true}],
      campaignContent: [{value: undefined, disabled: true}],
    });
  }

}
