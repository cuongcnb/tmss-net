import {Component, OnInit} from '@angular/core';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsCancelTrackingApi} from '../../../api/parts-management/parts-cancel-tracking.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {PartsCancelTrackingModel} from '../../../core/models/parts-management/parts-cancel-tracking.model';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {AgInCellButtonComponent} from '../../../shared/ag-in-cell-button/ag-in-cell-button.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-cancel-tracking',
  templateUrl: './parts-cancel-tracking.component.html',
  styleUrls: ['./parts-cancel-tracking.component.scss']
})
export class PartsCancelTrackingComponent implements OnInit {
  searchForm: FormGroup;

  fieldPartsList;
  partsParams;
  partsList: PartsCancelTrackingModel[];
  selectedPartsNode;


  paginationParams: PaginationParamsModel;
  paginationTotalsData;

  fieldGridExport;
  exportParams;
  partListForExport: PartsCancelTrackingModel[] = [];

  rowClassRules;
  frameworkComponents;

  constructor(
    private dataFormatService: DataFormatService,
    private swalAlertSerivce: ToastService,
    private partsCancelTrackingApi: PartsCancelTrackingApi,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private gridTableService: GridTableService,
    private formBuilder: FormBuilder,
    private validateBeforeSearchService: ValidateBeforeSearchService
  ) {
    this.fieldPartsList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 50
      },
      {
        headerName: 'Số LSC/Bán lẻ/Hẹn',
        headerTooltip: 'Số LSC/Bán lẻ/Hẹn',
        field: 'pwnNo'
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'reqState',
        width: 120
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partscode',
        width: 150
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsnamevn'
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        width: 50,
        cellClass: ['text-right', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'Thông tin đơn hàng',
        headerTooltip: 'Thông tin đơn hàng',
        field: 'orderStr',
        width: 300
      },
      {
        headerName: 'Ngày YCPT',
        headerTooltip: 'Ngày YCPT',
        field: 'issuesDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: '',
        headerTooltip: '',
        cellRenderer: 'agInCellButtonComponent',
        cellClass: 'p-0',
        buttonDef: {
          text: 'Đánh dấu',
          disabled: (params) => params.data.status === '1',
          iconName: 'fa fa-pencil',
          message: 'Status = 1 - Đã đánh dấu, không thể đánh dấu lại',
          function: this.mark.bind(this)
        },
        width: 120
      },
      {
        headerName: '',
        headerTooltip: '',
        cellRenderer: 'agInCellButtonComponent',
        cellClass: 'p-0',
        buttonDef: {
          text: 'Duyệt',
          iconName: 'fa fa-check-square-o',
          function: this.approve.bind(this)
        },
        width: 120
      }
    ];
    this.fieldGridExport = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 40
      },
      {
        headerName: 'Số LSC/Bán lẻ/Hẹn',
        headerTooltip: 'Số LSC/Bán lẻ/Hẹn',
        field: 'pwnNo',
        width: 150
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'reqState',
        width: 100
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partscode',
        width: 100,
        cellClass: 'excelStringType'
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsnamevn',
        width: 100
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        width: 40
      },
      {
        headerName: 'Thông tin đơn hàng',
        headerTooltip: 'Thông tin đơn hàng',
        field: 'orderStr',
        width: 200
      },
      {
        headerName: 'Ngày YCPT',
        headerTooltip: 'Ngày YCPT',
        field: 'issuesDate',
        width: 120,
        cellClass: 'excelDateTimeType'
      }
    ];
    this.rowClassRules = {
      'row-marked': 'data.status==="1"'
    };
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
      agInCellButtonComponent: AgInCellButtonComponent
    };
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      // User this for task #19873
      // pwnNo: [undefined], // Số LSC/Bán lẻ/Hẹn
      // reqState: [undefined], // Trạng thái
      // partscode: [undefined], // Mã phụ tùng
      // partsnamevn: [undefined], // Tên phụ tùng
      // qty: [undefined], // SL
      // orderStr: [undefined], // Thông tin đơn hàng

      fromDate: [moment(new Date().setHours(0, 0, 0)).subtract(1, 'months').format()],
      toDate: [new Date().setHours(0, 0, 0)],
      pwnNo: [undefined], // Số lệnh
      partCode: [undefined], // Mã PT
      orderNum: [undefined] // Số đơn hàng
    });
  }

  callbackParts(params) {
    this.partsParams = params;
    // this.checkedData = {};
    // this.search()
  }

  getParamsParts() {
    const selectedPartsNode = this.partsParams.api.getSelectedNodes();
    const selectedParts = this.partsParams.api.getSelectedRows();
    this.partListForExport = [];
    if (selectedPartsNode) {
      selectedParts.forEach(it => this.partListForExport.push(it));
      this.selectedPartsNode = selectedPartsNode[0];
    }
  }

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.searchForm.value.fromDate, this.searchForm.value.toDate)) {
      return;
    }
    const formValue = Object.assign({}, this.searchForm.value, {
      orderNum: this.searchForm.value.orderNum ? this.searchForm.value.orderNum : '',
      partCode: this.searchForm.value.partCode ? this.searchForm.value.partCode : '',
      pwnNo: this.searchForm.value.pwnNo ? this.searchForm.value.pwnNo : ''
    });
    this.selectedPartsNode = undefined;
    this.loadingService.setDisplay(true);
    this.partsCancelTrackingApi.search(formValue, this.paginationParams).subscribe((val: { total: any, vSrvBPartswarnings: PartsCancelTrackingModel[] }) => {
      this.partListForExport = [];
      if (val.vSrvBPartswarnings) {
        this.partsList = val.vSrvBPartswarnings;
        this.paginationTotalsData = val.total;
        this.partsList = this.gridTableService.addSttToData(this.partsList, this.paginationParams);
        // this.gridTableService.addCheckedToData(this.partsList, this.checkedData, 'id');
        this.partsParams.api.setRowData(this.partsList);
      }
      this.loadingService.setDisplay(false);
    });
  }

  cellValueChanged(params) {
    // const allData = this.gridTableService.getAllData(this.partsParams);
    // if (params.colDef.field === 'checkForExport') {
    //   this.partListForExport = allData.filter(item => item.checkForExport);
    // }
    // const field = params.colDef.field;
    // if (field === 'checkForExport') {
    //   if (params.data[field]) {
    //     this.partListForExport.push(params.data);
    //   } else if (this.partListForExport.length) {
    //     remove(this.partListForExport, params.data);
    //   }
    // }
  }

  mark(params) {
    if (!this.selectedPartsNode) {
      this.swalAlertSerivce.openWarningToast('Bạn chưa chọn dữ liệu');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsCancelTrackingApi.mark(params.data).subscribe(() => {
      // this.partsList[this.selectedPartsNode.rowIndex].status = '1';
      // this.partsParams.api.setRowData(this.partsList);
      // this.loadingService.setDisplay(false);
      // this.swalAlertSerivce.openSuccessToast('Đánh dấu thành công')
      this.search();
    });
  }

  approve(params) {
    this.confirmService.openConfirmModal('Bạn có chắc chắn muốn duyệt bản ghi này?').subscribe(() => {
      this.partsCancelTrackingApi.approve(params.data).subscribe(() => {
        // if (this.checkedData[this.selectedPartsNode.data['id']]) {
        //   delete this.checkedData[this.selectedPartsNode.data['id']];
        // }
        this.search();
      });
    }, () => {
    });
  }

  resetPaginationParams() {
    // this.checkedData = {};
    this.selectedPartsNode = undefined;
    this.partsList = undefined;
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  export() {
    // this.exportParams.api.setRowData(Object.values(this.checkedData).sort((a, b) => (a['stt'] > b['stt']) ? 1 : ((b['stt'] > a['stt']) ? -1 : 0)));
    this.exportParams.api.setRowData(this.partListForExport);
    this.gridTableService.export(this.exportParams, 'TheoDoiTinhTrangHuyPhuTung', 'TheoDoiTinhTrangHuyPhuTung');
  }

  changePaginationParams(paginationParams) {
    if (!this.partsList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }
}
