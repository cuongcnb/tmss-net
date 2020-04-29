import { Component, OnInit, ViewChild } from '@angular/core';
import { ParameterOperationAgentModel } from '../../../core/models/catalog-declaration/parameter-operation-agent.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DlrConfigApi } from '../../../api/common-api/dlr-config.api';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parameter-operation-agent',
  templateUrl: './parameter-operation-agent.component.html',
  styleUrls: ['./parameter-operation-agent.component.scss']
})
export class ParameterOperationAgentComponent implements OnInit {
  @ViewChild('configurationParameters', {static: false}) configurationParameters;
  gridField;
  gridParams;
  selectedData: ParameterOperationAgentModel;

  fieldGridHourLabor;
  hourLabotParams;

  constructor(
    private dataFormatService: DataFormatService,
    private loading: LoadingService,
    private dlrConfigApi: DlrConfigApi,
    private confirm: ConfirmService,
    private loadingService: LoadingService,
    private swalAlert: ToastService,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.gridField = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Từ',
        headerTooltip: 'Từ',
        field: 'effDateFrom',
        tooltip: params => this.dataFormatService.parseTimestampToDateBasic(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDateBasic(params.value)
      },
      {
        headerName: 'Đến',
        headerTooltip: 'Đến',
        field: 'effDateTo',
        tooltip: params => this.dataFormatService.parseTimestampToDateBasic(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDateBasic(params.value)
      }
    ];
    this.fieldGridHourLabor = [
      {
        headerName: 'Mã Đại Lý',
        headerTooltip: 'Mã Đại Lý',
        field: 'dlrCode',
      },
      {
        headerName: 'HSPTBH',
        headerTooltip: 'HSPTBH',
        field: 'hsptbh',
      },
      {
        headerName: 'HSBDMP',
        headerTooltip: 'HSBDMP',
        field: 'hsbdmp',
      },
      {
        headerName: 'HSQLPT',
        headerTooltip: 'HSQLPT',
        field: 'hsqlpt',
      },
      {
        headerName: 'GCBH',
        headerTooltip: 'GCBH',
        field: 'gcbh',
      },
    ];
  }

  // GRID CAU HINH THAM SO HOAT DONG DAI LY
  callbackGrid(params) {
    this.gridParams = params;
    this.getDlrConfig();
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  refresh(newData?) {
    this.selectedData = Object.assign({}, this.selectedData, newData);
    this.getDlrConfig();
  }

  private getDlrConfig() {
    this.gridParams.api.setRowData();
    this.loading.setDisplay(true);
    this.dlrConfigApi.getByCurrentDealer().subscribe(data => {
      this.gridParams.api.setRowData(data);
      this.gridTableService.selectFirstRow(this.gridParams);
      this.loading.setDisplay(false);
    });
  }

  // GRID HOUR LABOR
  callbackGridLabor(params) {
    this.hourLabotParams = params;
  }

  getParamsLabor() {
  }
}
