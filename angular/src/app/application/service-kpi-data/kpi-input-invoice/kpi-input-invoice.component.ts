import { Component, OnInit } from '@angular/core';
import { ServiceKpiDataModel } from '../../../core/models/service-kpi-data/service-kpi-data.model';
import { PartImportedModel } from '../../../core/models/parts-management/parts-info-management.model';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../api/parts-management/parts-info-management.api';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'kpi-input-invoice',
  templateUrl: './kpi-input-invoice.component.html',
  styleUrls: ['./kpi-input-invoice.component.scss']
})
export class KpiInputInvoiceComponent implements OnInit {

  processingInfo: Array<string> = [];
  fieldGrid;
  gridParams;
  selectedRowGrid: ServiceKpiDataModel;
  uploadedData: Array<PartImportedModel>;


  constructor(
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private gridTableService: GridTableService,
    private partsInfoManagementApi: PartsInfoManagementApi,
  ) {
    this.fieldGrid = [
      {headerName: 'Trạng thái Import', headerTooltip: 'Trạng thái Import', field: 'importStatus'},
      {headerName: 'Lệnh sửa chữa', headerTooltip: 'Lệnh sửa chữa', field: 'isRepair'},
      {headerName: 'Số hóa đơn', headerTooltip: 'Số hóa đơn', field: 'invoiceNumber'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote'},
    ];
  }

  ngOnInit() {
  }

  apiCallUpload(val) {
    return this.partsInfoManagementApi.importPartsInfo(val);
  }

  uploadSuccess(response) {
    this.uploadedData = response.Success;
    this.gridParams.api.setRowData(this.gridTableService.addSttToData(this.uploadedData));
    this.processingInfo = ['Import dữ liệu thành công'];
  }

  uploadFail(error) {
    this.processingInfo = error;
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }
}
