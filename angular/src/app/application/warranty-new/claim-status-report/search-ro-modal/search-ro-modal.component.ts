import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import * as moment from 'moment';
import { PaginationParamsModel } from '../../../../core/models/base.model';
import { ClaimWaitingOrderModel } from '../../../../core/models/warranty/claim-waiting-order.model';
import { ClaimStatusReportApi } from '../../../../api/warranty/claim-status-report.api';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { RcTypeApi } from '../../../../api/rc-type/rc-type.api';
import { RcTypeModel } from '../../../../core/models/advisor/rc-type.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-ro-modal',
  templateUrl: './search-ro-modal.component.html',
  styleUrls: ['./search-ro-modal.component.scss'],
})
export class SearchRoModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('repairJobHistoryModal', {static: false}) repairJobHistoryModal;
  @ViewChild('claimDetailModal', {static: false}) claimDetailModal;
  @Output() reload = new EventEmitter();
  isRefesh;
  searchForm: FormGroup;
  modalHeight;
  selectedWaitingOrder;
  sourceTable;
  claimWaitingOrderParams;
  fieldClaimWaitingOrderList;
  paginationTotalsData;
  paginationParams: PaginationParamsModel;
  claimWaitingOrderList: ClaimWaitingOrderModel[];
  rcTypes: RcTypeModel[] = [];

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private claimStatusReportApi: ClaimStatusReportApi,
    private rcTypeApi: RcTypeApi,
    // private gridTableService: GridTableService
  ) {
    this.fieldClaimWaitingOrderList = [
      {
        headerName: 'No.',
        headerTooltip: 'No.',
        width: 50,
        field: 'stt',
        cellRenderer: params => params.rowIndex + 1,
        cellClass: ['cell-border', 'cell-readonly', 'text-center'],
      },
      {
        headerName: 'Order No',
        headerTooltip: 'Order No',
        field: 'orderno',
      },
      {
        headerName: 'Claim Times',
        headerTooltip: 'Claim Times',
        field: 'claimcount',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
      },
      {
        headerName: 'Arrival Date',
        headerTooltip: 'Arrival Date',
        field: 'orderdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
  }

  ngOnInit() {
  }


  getRcTypes() {
    // Task 19728: Add search fields based on rcTypes. Filters only 3 values as below.
    const rctypenames = ['bảo hành xe', 'bh phụ tùng, phụ kiện', 'bh xe cũ'];
    this.loadingService.setDisplay(true);
    this.rcTypeApi.findAll().subscribe((res: RcTypeModel[]) => {
      this.loadingService.setDisplay(false);
      res.forEach(rcType => {
        if (rctypenames.includes(rcType.rctypename.toLowerCase())) {
        this.rcTypes.push(rcType);
        }
      });
    });
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      orderNo: [undefined],
      periodFrom: [moment(new Date().setHours(0, 0, 0)).subtract(3, 'months').format()],
      periodTo: [new Date().setHours(0, 0, 0)],
      status: [0],
      rctypeId: [undefined],
    });
  }

  open(sourceTable) {
    this.sourceTable = sourceTable;
    this.isRefesh = false;
    this.buildForm();
    this.getRcTypes();
    this.modal.show();
  }

  reset() {
    this.paginationParams = undefined;
    this.paginationTotalsData = 0;
    this.searchForm = undefined;
    this.selectedWaitingOrder = undefined;
    this.rcTypes = [];
    if (this.isRefesh) {
      this.reload.emit();
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  callbackWaitingOrder(params) {
    this.claimWaitingOrderParams = params;

  }

  getParamsWaitingOrder() {
    const selectedWaitingOrder = this.claimWaitingOrderParams.api.getSelectedRows();
    if (selectedWaitingOrder) {
      this.selectedWaitingOrder = selectedWaitingOrder[0];
    }
  }

  openRepairJobHistory() {
    if (!this.selectedWaitingOrder) {
      this.swalAlertService.openWarningToast('Chọn 1 Bản ghi để thực hiện');
    } else {
      this.repairJobHistoryModal.open({orderNo: this.selectedWaitingOrder.orderno, dealerCode: this.selectedWaitingOrder.dealercode});
    }
  }

  openNewClaim() {
    if (!this.selectedWaitingOrder) {
      this.swalAlertService.openWarningToast('Chọn 1 Bản ghi để thực hiện');
    } else {
      this.claimDetailModal.add(this.sourceTable, this.selectedWaitingOrder);
    }
  }

  search() {
    const formValue = this.searchForm.value;
    if (formValue.periodFrom > formValue.periodTo) {
      this.swalAlertService.openFailToast('Ngày bắt đầu không thể lớn hơn ngày kết thúc', 'Lỗi ngày tìm kiếm');
      return;
    }
    this.selectedWaitingOrder = undefined;
    this.loadingService.setDisplay(true);
    this.claimStatusReportApi.searchRepaireOrder(formValue, this.paginationParams).subscribe((val: { total, list }) => {
      if (val) {
        this.paginationTotalsData = val.total;
        this.claimWaitingOrderList = val.list;
        this.claimWaitingOrderParams.api.setRowData(this.claimWaitingOrderList);
      }
      this.loadingService.setDisplay(false);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.claimWaitingOrderList) {
      return;
    }

    this.paginationParams = paginationParams;
    this.search();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  refresh() {
    this.isRefesh = true;
  }

  download() {
    // this.gridTableService.export(this.claimWaitingOrderParams);

    const paramsExport = {
      fileName: 'RO-List-Report',
      sheetName: 'export',
      columnGroups: true,
      allColumns: true,
      processCellCallback: (params) => {
        if (params.column.colDef.headerName === 'No.') {
          return `${params.node.rowIndex + 1}`;
        }
        // if (params.column.colDef.headerName === 'Submit Date') {
        if (params.column.colDef.field === 'orderdate') {
          return `${moment(params.value).format('DD/MM/YYYY')}`;
        }
        return params.value;
      },
    };
    this.claimWaitingOrderParams.api.exportDataAsExcel(paramsExport);
  }
}
