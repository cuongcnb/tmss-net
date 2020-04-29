import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FirCategoryModel} from '../../../../core/models/fir-category/fir-category.model';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'not-contact-modal',
  templateUrl: './not-contact-modal.component.html',
  styleUrls: ['./not-contact-modal.component.scss']
})


export class NotContactModalComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: FirCategoryModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.modal.hide();
    this.close.emit(this.form.value);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      isNotContact: [undefined],
      isValue: [undefined],
      isSerial: [undefined],
      isStatus: [undefined],
      isNote: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
