import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-fleet-schemes',
  templateUrl: './modify-fleet-schemes.component.html',
  styleUrls: ['./modify-fleet-schemes.component.scss']
})
export class ModifyFleetSchemesComponent implements OnInit {
  @ViewChild('modifyFleetSchemes', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    // const apiCall = !this.selectedData ?
    //   this.bankService.createNewBank(this.form.value) : this.bankService.updateBank(this.form.value);
    // apiCall.subscribe(() => {
    //   this.close.emit();
    //   this.modal.hide();
    // }, () => {
    // })
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      min: ['', [Validators.min(0), GlobalValidator.required]],
      max: ['', [Validators.min(0), GlobalValidator.required]],
      available: ['', [Validators.min(0), GlobalValidator.required]],
      fwsp: ['', [Validators.min(0), GlobalValidator.required]],
      frsp: ['', [Validators.min(0), GlobalValidator.required]],
      holdbackAmount: ['', Validators.min(0)],
      discount: ['', Validators.min(0)],
      marginPercent: ['', Validators.min(0)],
      margin: ['', Validators.min(0)],
      description: ['', Validators.min(0)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
