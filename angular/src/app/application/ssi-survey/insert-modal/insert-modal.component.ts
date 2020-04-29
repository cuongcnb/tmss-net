import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RemoveReason } from '../../../core/constains/remove-reason';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insert-modal',
  templateUrl: './insert-modal.component.html',
  styleUrls: ['./insert-modal.component.scss']
})
export class InsertModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectRowGrid;
  reasonField;
  gridParams;
  data;
  removeReason = RemoveReason;

  constructor() {
  }

  ngOnInit() {
    this.reasonField = [
      {
        headerName: 'Lý do loại bỏ',
        headerTooltip: 'Lý do loại bỏ',
        field: 'name'
      },
    ];
  }

  open(data) {
    this.modal.show();
    this.data = data;
  }

  saveReason() {
    this.close.emit({removeReason: this.selectRowGrid.name});
    this.modal.hide();
  }

  reset() {
  }

  getParamsReason() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }

  callBackGridReason(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.removeReason);
  }

}
