import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { SrvModel } from '../../../../core/models/srv-lexus/srv-model';
import { MasterLexusApi } from '../../../../api/srv-master-lexus/master-lexus.api';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'import-price-modal',
  templateUrl: './import-price-modal.component.html',
  styleUrls: ['./import-price-modal.component.scss'],
})
export class ImportPriceModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;

  fieldGrid;
  gridParams;
  importedData: Array<SrvModel> = [];

  constructor(
    private setModalHeightService: SetModalHeightService,
    private masterLexusApi: MasterLexusApi,
    private swalAlert: ToastService,
    private dataFormatService: DataFormatService,
  ) {
    this.fieldGrid = [
      { headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode' },
      { headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        } },
      {
        headerName: 'Giá bán',
        headerTooltip: 'Giá bán',
        field: 'dlrPrice',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
    ];
  }

  ngOnInit() {
  }

  callBackGrid(params) {
    this.gridParams = params;

  }

  open() {
    this.modal.show();
    this.onResize();
  }

  reset() {
    this.importedData = [];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  apiCallUpload(val) {
    return this.masterLexusApi.uploadLexusPriceData(val);
  }

  uploadSuccess(response: { Success: Array<SrvModel> }) {
    this.importedData = response ? response.Success : [];
    if (this.gridParams) {
      this.gridParams.api.setRowData(this.importedData);
    }
  }

  uploadFail(error) {
    this.swalAlert.openFailToast(error.message, 'Lỗi nhập tài liệu');
  }
}
