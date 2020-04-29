import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ManageDocumentSupportModel } from '../../../../core/models/manage-voc/manage-document-support.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-document-modal',
  templateUrl: './add-document-modal.component.html',
  styleUrls: ['./add-document-modal.component.scss'],
})
export class AddDocumentModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  selectedRowData: ManageDocumentSupportModel;
  modalHeight;
  editModal;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(selectedData?, editModal?) {
    this.buildForm();
    this.modal.show();
    this.selectedRowData = selectedData;
    this.editModal = editModal;
  }

  reset() {
    this.form = undefined;
  }

  refresh() {
    this.form.reset();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      documentName: [undefined],
      model: [undefined],
      status: [undefined],
      stt: [undefined],
    });
  }
}
