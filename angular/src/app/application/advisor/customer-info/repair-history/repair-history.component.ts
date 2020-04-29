import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AgCheckboxRendererComponent} from '../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {CustomerApi} from '../../../../api/customer/customer.api';
import {DownloadService} from '../../../../shared/common-service/download.service';
import {JobGroup} from '../../../../core/constains/job-group';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {CarTypes} from '../../../../core/constains/car-type';
import {ToastService} from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-history',
  templateUrl: './repair-history.component.html',
  styleUrls: ['./repair-history.component.scss']
})
export class RepairHistoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  modalHeight: number;
  form: FormGroup;

  fieldParts;
  partsParams;
  isCollapsedCus = true;
  isCollapsedCar = true;
  fieldRepair;
  repairParams;

  fieldHistory;
  historyParams;
  selectedHistory;

  searchForm: FormGroup;
  frameworkComponents;

  vehiclesId;
  customerId;
  roId;
  customerD;
  jobGroup = JobGroup;
  customerVisitInfo;
  isOld;
  isGetAll = false;

  constructor(
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private repairOrderApi: RepairOrderApi,
    private customerApi: CustomerApi,
    private gridTableService: GridTableService,
    private downloadService: DownloadService
  ) {
    this.fieldHistory = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'dealerCode', width: 40},
      {headerName: 'Số lệnh SC', headerTooltip: 'Số lệnh SC', field: 'repairorderno', width: 60},
      {
        headerName: 'Ngày xe đến',
        headerTooltip: 'Ngày xe đến',
        field: 'inDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        width: 60
      },
      {
        headerName: 'Ngày ra xe',
        headerTooltip: 'Ngày ra xe',
        field: 'outDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        width: 60
      },
      {
        headerName: 'Số KM',
        headerTooltip: 'Số KM',
        field: 'km',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        width: 40
      },
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'advisor', width: 90},
      {headerName: 'KTV', headerTooltip: 'KTV', field: 'techName', width: 100},
      {headerName: 'Nội dung SC', headerTooltip: 'Nội dung SC', field: 'reqdesc'}
    ];
    this.fieldParts = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 60},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', field: 'partsNameVn', width: 100},
      {headerName: 'Model', headerTooltip: 'Model', field: 'handlemodel', width: 50},
      {
        headerName: 'Loại PT', headerTooltip: 'Loại phụ tùng', field: 'genuine', width: 40,
        valueFormatter: params => params.value === 'Y' ? 'Chính hãng' : params.value === 'N' ? 'Không chính hãng' : ''
      },
      {
        headerName: 'ĐV', headerTooltip: 'Đơn vị',
        field: 'unitName',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        width: 30
      },
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice', cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        width: 50
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        width: 20
      },
      {headerName: 'Thuế (%)', headerTooltip: 'Thuế (%)', field: 'taxRate', width: 30},
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        valueGetter: params => Math.round(params.data.sellPrice * params.data.qty),
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(Math.round(params.data.sellPrice * params.data.qty)),
        valueFormatter: params => this.dataFormatService.moneyFormat(Math.round(params.data.sellPrice * params.data.qty)),
        width: 50
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'notes', width: 30},
      {
        headerName: '(%)',
        headerTooltip: 'Giảm giá (%)',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        // valueGetter: (params) => Math.round(params.data.quotationPart.discount / (params.data.part.sellPrice * params.data.quotationPart.qty) * 100) / 100,
        cellRenderer: (params) => {
          return Math.round(params.data.discount / (params.data.sellPrice * params.data.qty) * 100) / 100;
        },
        // valueFormatter: (params) => Math.round(params.data.quotationPart.discount / (params.data.part.sellPrice * params.data.quotationPart.qty) * 100) / 100,
        width: 30
      },
      {
        headerName: 'Giảm giá',
        headerTooltip: 'Giảm giá',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        field: 'discount',
        valueFormatter: params => params ? this.dataFormatService.moneyFormat(Math.round(params.value)) : 0,
        width: 40
      },
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'reFix',
        cellRenderer: 'agCheckboxRendererComponent',
        disableCheckbox: true,
        width: 20
      }
    ];
    this.fieldRepair = [
      // {
      //   headerName: 'Ngày đến',
      //   headerTooltip: 'Ngày đến',
      //   field: 'srvBQuotationJobs.createDate',
      //   width: 50,
      //   tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
      //   valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      // },
      // {
      //   headerName: 'Ngày ra',
      //   headerTooltip: 'Ngày ra',
      //   field: 'srvBQuotationJobs.modifyDate',
      //   width: 50,
      //   tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
      //   valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      // },
      {headerName: 'Mã CV', headerTooltip: 'Mã công việc', field: 'rccode', width: 60},
      {headerName: 'Tên CV', headerTooltip: 'Tên công việc', field: 'jobsname', width: 120},
      {
        headerName: 'Kiểu CV', headerTooltip: 'Kiểu công việc', field: 'jobgroup', width: 40,
        valueFormatter: params => {
          if (params.data.jobgroup != null) {
            const matchVal = this.jobGroup.find(jobGroup => jobGroup.id === params.data.jobgroup);
            return matchVal ? matchVal.name : '';
          }
        }
      },
      {
        headerName: 'GC DM',
        headerTooltip: 'Giờ công định mức',
        field: 'timework',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        width: 40
      },
      // {
      //   headerName: 'GC H/S',
      //   headerTooltip: 'Giờ công H/S',
      //   field: 'quotationJobDTO.timeworkrate',
      //   cellClass: ['cell-border', 'cell-readonly', 'text-right'],
      //   width: 20
      // },
      {
        headerName: 'GC TT',
        headerTooltip: 'Giờ công TT',
        field: 'actualtime',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        width: 40
      },
      {
        headerName: 'Thuế (%)', headerTooltip: 'Thuế (%)', field: 'taxRate',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        width: 40
      },
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'costs',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        width: 60
      },

      {
        headerName: 'Giảm giá (%)', headerTooltip: 'Giảm giá (%)', field: '',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        valueGetter: params => params.data && params.data.discount && params.data.costs
          ? Math.round((params.data.discount / params.data.costs * 100) * 100) / 100
          : 0,
        width: 40
      },

      {
        headerName: 'giảm giá',
        headerTooltip: 'Giảm giá',
        field: 'discount',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => params ? this.dataFormatService.moneyFormat(params.value) : 0,
        valueFormatter: params => params ? this.dataFormatService.moneyFormat(Math.round(params.value)) : 0,
        width: 40
      },
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'reFix',
        cellClass: ['text-center'],
        cellRenderer: 'agCheckboxRendererComponent',
        disableCheckbox: true,
        width: 20
      }
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };

  }

  ngOnInit() {
    this.buildPrintForm();
    this.onResize();
    this.isGetAll = false;
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({roType: [0]});
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(customerId, customerDId, vehiclesId, customerD) {
    this.isGetAll = false;
    this.vehiclesId = vehiclesId;
    this.customerId = customerId;
    this.buildForm();
    this.customerD = customerD;
    this.modal.show();
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  callbackHistory(params) {
    this.customerVisitInfo = [];
    this.historyParams = params;
    this.search();
  }

  getParamsHistory() {
    const selectedHistory = this.historyParams.api.getSelectedRows();
    if (selectedHistory) {
      this.selectedHistory = selectedHistory[0];
      this.isOld = this.selectedHistory.isOld;
      this.repairParams.api.setRowData([]);
      this.partsParams.api.setRowData([]);
      this.searchHistory();
      this.roId = this.selectedHistory.roId;
      this.repairOrderApi.customerVisitInfo(this.selectedHistory.repairOrderNo).subscribe(res => {
        this.customerVisitInfo = res;
      });
      setTimeout(() => {
        this.repairParams.api.sizeColumnsToFit(this.repairParams);
      }, 70);
    }
  }

  callbackRepair(params) {
    this.repairParams = params;
  }

  reset() {
    this.searchForm = null;
    this.roId = null;
  }

  search(type?) {
    this.loadingService.setDisplay(true);
    if (this.isGetAll) {
      this.repairOrderApi.searchAllRepairHistory(Object.assign({}, {
        roType: Number(type),
        registerNo: this.customerD.vehicle.registerno,
        vinNo: this.customerD.vehicle.vinno
        // customerId: this.customerD.customer ? this.customerD.customer.id : null
      }, this.searchForm.value)).subscribe((val: Array<any>) => {
        if (val) {
          this.historyParams.api.setRowData(val);
          this.gridTableService.selectFirstRow(this.historyParams);
          this.repairParams.api.setRowData([]);
          this.partsParams.api.setRowData([]);
        }
        this.loadingService.setDisplay(false);
      });
    } else {
      this.repairOrderApi.searchRepairHistory(Object.assign({}, {
        roType: Number(type),
        registerNo: this.customerD.vehicle.registerno,
        vinNo: this.customerD.vehicle.vinno
        // customerId: this.customerD.customer ? this.customerD.customer.id : null
      }, this.searchForm.value)).subscribe((val: Array<any>) => {
        if (val) {
          this.historyParams.api.setRowData(val);
          this.gridTableService.selectFirstRow(this.historyParams);
          this.repairParams.api.setRowData([]);
          this.partsParams.api.setRowData([]);
        }
        this.loadingService.setDisplay(false);
      });
    }
  }

  dropdownChange(val) {
    this.search(val);
  }

  searchHistory() {
    this.loadingService.setDisplay(true);
    console.log(this.isOld);
    if (this.isOld) {
      this.repairOrderApi.getOldRepairOrderDetails(this.selectedHistory.roId).subscribe((val: { quotationJobList: Array<any>[], quotationPartList: Array<any>[] }) => {
        if (val.quotationJobList && val.quotationJobList.length) {
          this.repairParams.api.setRowData(val.quotationJobList);
        } 
        if (val.quotationPartList && val.quotationPartList.length) {
          this.partsParams.api.setRowData(val.quotationPartList);
        }
        this.loadingService.setDisplay(false);
      });
    } else {
      this.repairOrderApi.getRepairOrderDetails(this.selectedHistory.roId).subscribe((val: { quotationJobList: Array<any>[], quotationPartList: Array<any>[] }) => {
        if (val.quotationJobList && val.quotationJobList.length) {
          this.repairParams.api.setRowData(val.quotationJobList);
        } 
        if (val.quotationPartList && val.quotationPartList.length) {
          this.partsParams.api.setRowData(val.quotationPartList);
        }
        this.loadingService.setDisplay(false);
      });
    }
  }

  print(event) {
    this.loadingService.setDisplay(true);
    if (this.isOld) {
      this.repairOrderApi.printOldRepairHistory({
        vehiclesId: this.vehiclesId,
        customersId: this.customerId,
        extension: event.extension,
        ...this.form.value
      }).subscribe(data => {
        this.loadingService.setDisplay(false);
        if (data) {
          this.downloadService.downloadFile(data);
        }
      });
    } else {
      this.repairOrderApi.printRepairHistory({
        vehiclesId: this.vehiclesId,
        customersId: this.customerId,
        extension: event.extension,
        ...this.form.value
      }).subscribe(data => {
        this.loadingService.setDisplay(false);
        if (data) {
          this.downloadService.downloadFile(data);
        }
      });
    }
  }

  getCarType(id) {
    const type = CarTypes.find(val => val.id === id);
    return type ? type.name : '';
  }

  private buildPrintForm() {
    this.form = this.formBuilder.group({
      startDate: [null],
      endDate: [new Date()]
    });
  }

  // Kiểm tra xem trường "Từ ngày" đã nhỏ hơn trường "Đến ngày" hay chưa rồi mới in
  checkDate() {
    const obj = this.form.value;
    const startDate = new Date(this.form.value.startDate).getDate();
    const endDate = new Date(this.form.value.endDate).getDate();
    if (obj.startDate >= obj.endDate && startDate !== endDate) {
      this.swalAlertService.openWarningToast(`Từ ngày phải nhỏ hơn Đến ngày`);
      return;
    }
    this.reportTypeModal.open(1);
  }
}
