import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ManageDocumentSupportModel } from '../../../../core/models/manage-voc/manage-document-support.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-document-detail-modal',
  templateUrl: './add-document-detail-modal.component.html',
  styleUrls: ['./add-document-detail-modal.component.scss'],
})
export class AddDocumentDetailModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  editDetailModal;
  modalHeight: number;
  selectedRowData: ManageDocumentSupportModel;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open(selectedData?, editDetailModal?) {
    this.buildForm();
    this.modal.show();
    this.selectedRowData = selectedData;
    this.editDetailModal = editDetailModal;
  }

  refresh() {
    this.form.reset();
  }

  save() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      document: [undefined],
      documentTitle: [undefined],
      documentKeyWord: [undefined],
      status: [undefined],
      documentContent: [undefined],
    });
  }
}
