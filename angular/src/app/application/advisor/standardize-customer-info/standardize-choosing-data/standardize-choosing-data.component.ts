import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'standardize-choosing-data',
  templateUrl: './standardize-choosing-data.component.html',
  styleUrls: ['./standardize-choosing-data.component.scss']
})
export class StandardizeChoosingDataComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  fieldGrid;
  params;
  selectedData;
  listData: Array<any>;
  fieldName: string;

  constructor(
    private setModalHeightSrv: SetModalHeightService
  ) {
  }

  ngOnInit() {
  }

  open(fieldName, listData) {
    this.fieldName = fieldName;
    this.listData = listData ?
      listData.filter(data => data)
        .map(data => Object.assign({}, {[fieldName]: data}))
      : [];
    this.fieldGrid = [{headerName: '', headerTooltip: '', field: fieldName}];
    this.modal.show();
  }

  callBackGrid(params) {
    params.api.setRowData(this.listData);
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  confirm() {
    this.close.emit({
      fieldName: this.fieldName,
      data: this.selectedData[this.fieldName]
    });
    this.modal.hide();
  }

  reset() {
    this.selectedData = undefined;
    this.listData = undefined;
    this.fieldName = undefined;
    this.fieldGrid = undefined;
  }

  onResize() {
    this.modalHeight = this.setModalHeightSrv.onResize();
  }
}
