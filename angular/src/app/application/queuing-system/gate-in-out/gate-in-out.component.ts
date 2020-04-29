import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {concatMapTo, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {ShortcutEventOutput, ShortcutInput} from 'ng-keyboard-shortcuts';

import {CurrentUser} from '../../../home/home.component';
import {GateInOutModel} from '../../../core/models/queuing-system/gate-in-out.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {QueuingApi} from '../../../api/queuing-system/queuing.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {AgInCellButtonComponent} from '../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import {CommonFunctionsService} from '../common-functions.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gate-in-out',
  templateUrl: './gate-in-out.component.html',
  styleUrls: ['./gate-in-out.component.scss']
})
export class GateInOutComponent implements AfterViewInit, OnInit {
  @ViewChild('vehicleInOut', { static: false }) vehicleInOut;
  @ViewChild('reportTypeModal', { static: false }) reportTypeModal;
  @Output() shortcuts = new EventEmitter<Array<ShortcutInput>>();
  form: FormGroup;
  currentUser = CurrentUser;
  selectedData: GateInOutModel;
  gateInOutList: Array<GateInOutModel>;
  params;
  fieldGrid;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;
  exportParams;
  rowClassRules;
  frameworkComponents;
  excelStyles;
  keyboardShortcuts: Array<ShortcutInput> = [];
  shortcutsMoldal;

  constructor(
    private downloadService: DownloadService, private formBuilder: FormBuilder, private confirmService: ConfirmService, private swalAlertService: ToastService,
    private loadingService: LoadingService, private queuingApi: QueuingApi, private dataFormatService: DataFormatService, private gridTableService: GridTableService,
    private commonFunctionsService: CommonFunctionsService) {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 40,
        cellClass: ['excelContent']
      },
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'registerNo',
        width: 100,
        cellClass: ['excelContent']
      },
      {
        headerName: 'Giờ vào',
        headerTooltip: 'Giờ vào',
        field: 'inDate',
        cellClass: ['text-center', 'cell-border', 'excelDateTimeType'],
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        cellRenderer: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'Giờ ra',
        headerTooltip: 'Giờ ra',
        field: 'outDate',
        cellClass: ['text-center', 'cell-border', 'excelDateTimeType'],
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        cellRenderer: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'Xe DV',
        headerTooltip: 'Xe dịch vụ',
        field: 'isService',
        width: 80,
        cellClass: ['text-center', 'cell-border', 'excelContent'],
        cellRenderer: params => `${params.value === 'Y' ? 'Có' : 'Không'}`
      },
      {
        headerName: 'Loại KH',
        headerTooltip: 'Loại khách hàng',
        field: 'customerType',
        width: 100,
        cellClass: ['text-center', 'cell-border', 'excelContent'],
        cellRenderer: params => this.commonFunctionsService.getTypeOfCustomer(params.data)
      },
      {
        headerName: 'Loại công việc',
        headerTooltip: 'Loại công việc',
        field: 'jobType',
        width: 100,
        cellClass: ['text-center', 'cell-border', 'excelContent'],
        cellRenderer: params => this.commonFunctionsService.getCarJobs(params.data)
      },
      {
        headerName: 'Tầng tiếp nhận',
        headerTooltip: 'Tầng tiếp nhận',
        field: 'floorName',
        width: 120,
        cellClass: ['text-center', 'cell-border', 'excelContent']
      },
      {
        headerName: 'CVDV',
        field: 'empName',
        hide: true,
      },
      {
        headerName: 'Hành động',
        headerTooltip: 'Hành động',
        width: 100,
        field: 'action',
        cellRenderer: 'agInCellButtonComponent',
        cellClass: ['text-center', 'cell-border'],
        buttonDef: {
          text: 'Xe ra',
          useRowData: true,
          function: this.onBtnClick.bind(this)
        }
      }
    ];
    this.setColorForCustomer();
    this.frameworkComponents = { agInCellButtonComponent: AgInCellButtonComponent };
    this.excelStyles = [
      {
        id: 'header',
        alignment: {
          horizontal: 'Center', vertical: 'Center'
        },
        font: {
          bold: true,
          size: 13,
          fontName: 'Calibri'
        },
        interior: {
          color: '#FFFFFF',
          pattern: 'Solid'
        },
        borders: {
          borderBottom: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderLeft: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderRight: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderTop: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          }
        }
      },
      {
        id: 'excelDateTimeType',
        alignment: {
          horizontal: 'Automatic', vertical: 'Bottom'
        },
        font: {
          size: 12,
          fontName: 'Calibri'
        },
        borders: {
          borderBottom: {
            color: '#000000',
            lineStyle: 'Dot',
            weight: 1
          },
          borderLeft: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderRight: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderTop: {
            color: '#000000',
            lineStyle: 'Dot',
            weight: 1
          }
        },
        dataType: 'dateTime',
        numberFormat: {
          format: 'dd/mm/yyyy hh:mm;@'
        }
      },
      {
        id: 'excelContent',
        alignment: {
          horizontal: 'Automatic', vertical: 'Bottom'
        },
        font: {
          size: 12,
          fontName: 'Calibri'
        },
        borders: {
          borderBottom: {
            color: '#000000',
            lineStyle: 'Dot',
            weight: 1
          },
          borderLeft: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderRight: {
            color: '#000000',
            lineStyle: 'Continuous',
            weight: 1
          },
          borderTop: {
            color: '#000000',
            lineStyle: 'Dot',
            weight: 1
          }
        }
      }
    ];
  }

  private setColorForCustomer() {
    this.rowClassRules = {
      firtInColor: params => params.data.isFirstIn === 'Y'
    };
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.keyboardShortcuts = [
      {
        key: ['ctrl + x', 'ctrl + X'],
        label: 'Bảo vệ',
        description: 'Xe ra',
        command: (e: ShortcutEventOutput) => this.setVehicleOut(this.selectedData),
        preventDefault: true
      },
      {
        key: ['ctrl + d', 'ctrl + D'],
        label: 'Bảo vệ',
        description: 'Thêm xe mới',
        command: (e: ShortcutEventOutput) => this.vehicleInOut.open(),
        preventDefault: true
      },
      {
        key: ['ctrl + u', 'ctrl + U'],
        label: 'Bảo vệ',
        description: 'Cập nhật thông tin xe',
        command: (e: ShortcutEventOutput) => this.updateInfo(),
        preventDefault: true
      },
      {
        key: ['ctrl + r', 'ctrl + R'],
        label: 'Bảo vệ',
        description: 'Xóa xe',
        command: (e: ShortcutEventOutput) => this.deleteData(),
        preventDefault: true
      },
      {
        key: ['ctrl + h', 'ctrl + H'],
        label: 'Bảo vệ',
        description: 'Hủy xe ra',
        command: (e: ShortcutEventOutput) => this.removeVehicleOut(),
        preventDefault: true
      },
      {
        key: ['ctrl + p', 'ctrl + P'],
        label: 'Bảo vệ',
        description: 'In phiếu',
        command: (e: ShortcutEventOutput) => this.reportTypeModal.open(1),
        preventDefault: true
      },
      {
        key: ['ctrl + e', 'ctrl + E'],
        label: 'Bảo vệ',
        description: 'Xuất Excel',
        command: (e: ShortcutEventOutput) => this.exportExcel(),
        preventDefault: true
      }
    ];
    this.keyboardShortcuts = [...this.keyboardShortcuts, ...this.shortcutsMoldal];
    this.shortcuts.emit(this.keyboardShortcuts);
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.gateInOutList) {
      return;
    }

    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    if (moment(this.form.value.fromDate).isAfter(this.form.value.toDate, 'day')) {
      this.swalAlertService.openFailToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }
    let { status } = this.form.value;
    const { fromDate, toDate, registerNo } = this.form.value;
    status = this.form.get('status').value.toString().toUpperCase() === 'ALL' ? null : status;

    this.loadingService.setDisplay(true);
    if (!!this.form.controls.registerNo.value) {
      this.queuingApi.search({ fromDate, toDate, registerNo, status })
        .subscribe(res => {
          this.loadingService.setDisplay(false);

          if (res) {
            this.gateInOutList = res.gateInOutList;
            this.paginationTotalsData = res.total;
            this.params.api.setRowData(this.gridTableService.addSttToData(res.gateInOutList, this.paginationParams));
          }
        });
    } else {
      this.queuingApi.search({ fromDate, toDate, registerNo, status }, this.paginationParams)
        .subscribe(res => {
          this.loadingService.setDisplay(false);

          if (res) {
            this.gateInOutList = res.gateInOutList;
            this.paginationTotalsData = res.total;
            this.params.api.setRowData(this.gridTableService.addSttToData(res.gateInOutList, this.paginationParams));
          }
        });
    }
  }

  callbackGrid(params) {
    this.params = params;
    this.resetPaginationParams();
    this.search();
  }

  getParams(event) {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  updateInfo() {
    (!this.selectedData) ? this.swalAlertService.openFailToast('Cần chọn 1 bản ghi') : this.vehicleInOut.open(this.selectedData);
  }

  deleteData() {
    if (!this.selectedData) {
      this.swalAlertService.openFailToast('Cần chọn 1 bản ghi');
    } else {
      this.confirmService.openConfirmModal('Xác nhận', 'Bạn có muốn xóa thông tin xe?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.queuingApi.remove(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessToast('cho xe ra thành công');
          this.refresh();
        });
      }, () => {
      });
    }
  }

  refresh() {
    this.resetPaginationParams();
    this.search();
    this.selectedData = undefined;
  }

  removeVehicleOut() {
    if (!this.selectedData) {
      this.swalAlertService.openFailToast('Cần chọn 1 bản ghi');
    } else {
      this.confirmService.openConfirmModal('Xác nhận', 'Bạn có muốn hủy thông tin xe ra?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.queuingApi.manageInOut(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.refresh();
        });
      }, () => {
      });
    }
  }

  printGateInOut(params) {
    this.loadingService.setDisplay(true);
    if (!this.selectedData) {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openFailToast('Cần chọn 1 bản ghi');
      return;
    }

    this.queuingApi.printGateInOut(this.selectedData.id).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  exportExcel() {
    const paramsExport = {
      fileName: 'Xe-ra-vao',
      sheetName: 'Xe ra vào',
      columnGroups: true,
      columnKeys: ['stt', 'registerNo', 'inDate', 'outDate', 'isService', 'customerType', 'jobType', 'empName', 'floorName'],
      processHeaderCallback: params => params.column.getColDef().headerName,
      processCellCallback: params => {
        const field = params.column.getColDef().field;
        switch (field) {
          case 'isService':
            return `${params.value === 'Y' ? 'Có' : 'Không'}`;
          case 'inDate':
          case 'outDate':
            return !!params.value ? moment(params.value).format(moment.HTML5_FMT.DATETIME_LOCAL_MS) : '';
          case 'customerType':
            return this.commonFunctionsService.getTypeOfCustomer(params.node.data);
          case 'jobType':
            return this.commonFunctionsService.getCarJobs(params.node.data);
          default:
            return params.value;
        }
      }
    };
    this.params.api.exportDataAsExcel(paramsExport);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
      status: ['IN'],
      dlrId: [{ value: this.currentUser.dealerId, disabled: true }],
      registerNo: [undefined]
    });
  }


  onBtnClick(event) {
    this.setVehicleOut(event.data);
  }

  setVehicleOut(data) {
    if (data) {
      this.confirmService.openConfirmModal('Xác nhận', `Bạn có muốn cho xe ${data.registerNo} ra?`)
        .pipe(
          tap(() => this.loadingService.setDisplay(true)),
          concatMapTo(this.queuingApi.outGate(data.registerNo))
        )
        .subscribe(() => {
          this.loadingService.setDisplay(false);
          this.refresh();
          this.swalAlertService.openSuccessToast('Cho xe ra thành công!');
        });
    }
  }
}
