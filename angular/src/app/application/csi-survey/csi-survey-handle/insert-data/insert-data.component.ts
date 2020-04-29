import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CsiSurveyModel } from '../../../../core/models/csi-survey/csi.model';
import { ModalDirective } from 'ngx-bootstrap';
import { RemoveReasonCsi } from '../../../../core/constains/remove-reason';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insert-data',
  templateUrl: './insert-data.component.html',
  styleUrls: ['./insert-data.component.scss']
})
export class InsertDataComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  removeReason = RemoveReasonCsi;
  reasonField;
  gridParams;
  selectRowData;
  selectedData: CsiSurveyModel;
  data;
  modalHeight: number;

  constructor(
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.reasonField = [
      {headerName: 'lý do loại bỏ', headerTooltip: 'lý do loại bỏ', field: 'name'},
    ];
  }
  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(data) {
    this.modal.show();
    this.data = data;
  }

  reset() {
  }

  saveReason() {
    this.close.emit({removeReason: this.selectRowData.name});
    this.modal.hide();
  }

  callBackGridInsertData(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.removeReason);
  }

  getParamsInsertData() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowData = selectedData[0];
    }
  }

}
