import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DlrFloorModel } from '../../../../../core/models/catalog-declaration/dlr-floor.model';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-info',
  templateUrl: './add-info.component.html',
  styleUrls: ['./add-info.component.scss'],
})
export class AddInfoComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: DlrFloorModel;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formbuider: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  refresh() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formbuider.group({
      day: [undefined],
      content: [undefined],
    });
  }

}
