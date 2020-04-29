import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {LoadingService} from '../../../shared/loading/loading.service';
import {RepairOrderApi} from '../../../api/quotation/repair-order.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'quotation-account',
  templateUrl: './quotation-account.component.html',
  styleUrls: ['./quotation-account.component.scss']
})
export class QuotationAccountComponent implements OnInit {
  form: FormGroup;
  fieldGrid;
  params;
  selectedData;
  paginationTotalsData: number;
  data;
  paginationParams;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private repairOrderApi: RepairOrderApi,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private toastrService: ToastrService
  ) {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checked',
        width: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'registerno'},
      {headerName: 'VIN', headerTooltip: 'VIN', field: 'vinno'},
      {headerName: 'RO', headerTooltip: 'RO', field: 'repairorderno'},
      {
        headerName: 'Ngày đóng lệnh', headerTooltip: 'Ngày đóng lệnh', field: 'closeroDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Loại RO', headerTooltip: 'Loại RO', field: 'rotype',
        valueFormatter: params => {
          switch (params.value) {
            case '1':
              return 'BP';
            case '2':
              return 'GJ';
            default:
              return '';
          }
        }
      },
      {headerName: 'PDS', headerTooltip: 'PDS', field: 'pds'}
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
  }

  search() {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.searchQA(this.form.value, this.paginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.data = res.list;
      this.paginationTotalsData = res.total;
      this.params.api.setRowData(res.list);
    });
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  changePaginationParams(paginationParams) {
    this.paginationParams = paginationParams;
    this.search();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerNo: [undefined],
      vinNo: [undefined],
      ro: [undefined]
    });
  }

  printQuotation() {
    const listSelect = this.params.api.getSelectedRows();
    if (listSelect.length < 1) {
      this.toastrService.warning('Chưa có bản ghi nào được chọn', 'Cảnh báo');
      return;
    }
    const listRegisterNo = [...new Set(listSelect.map(val => val.registerno))];
    if (listRegisterNo.length > 1) {
      this.toastrService.warning('Chỉ được chọn các bản ghi cùng biển số', 'Cảnh báo');
      return;
    }
    const obj = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listSelect.length; i++) {
      obj.push({
          customersId: listSelect[i].cusId,
          vehiclesId: listSelect[i].vhcId,
          roId: listSelect[i].roId,
          cusvsId: listSelect[i].cusvsId,
          rotype: listSelect[i].rotype,
          registerNo: listSelect[i].registerno
        }
      );
    }
    this.loadingService.setDisplay(true);
    this.serviceReportApi.printMultiQuotation(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  printSettlement() {
    const listSelect = this.params.api.getSelectedRows();
    if (listSelect.length < 1) {
      this.toastrService.warning('Chưa có bản ghi nào được chọn', 'Cảnh báo');
      return;
    }
    const listRegisterNo = [...new Set(listSelect.map(val => val.registerno))];
    if (listRegisterNo.length > 1) {
      this.toastrService.warning('Chỉ được chọn các bản ghi cùng biển số', 'Cảnh báo');
      return;
    }
    const obj = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listSelect.length; i++) {
      obj.push({
          customersId: listSelect[i].cusId,
          vehiclesId: listSelect[i].vhcId,
          roId: listSelect[i].roId,
          cusvsId: listSelect[i].cusvsId,
          rotype: listSelect[i].rotype,
          registerNo: listSelect[i].registerno
        }
      );
    }
    this.loadingService.setDisplay(true);
    this.serviceReportApi.printMultiSettlement(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }
}
