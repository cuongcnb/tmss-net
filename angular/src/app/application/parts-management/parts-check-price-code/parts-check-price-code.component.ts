import {Component, OnInit, ViewChild, Injector} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {InquiryPriceCodeModel, PartsOfInquiryModel} from '../../../core/models/parts-management/parts-check-price-code.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {CurrentUserModel, PaginationParamsModel} from '../../../core/models/base.model';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {PartsCheckPriceCodeApi} from '../../../api/parts-management/parts-check-price-code.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {remove} from 'lodash';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-check-price-code',
  templateUrl: './parts-check-price-code.component.html',
  styleUrls: ['./parts-check-price-code.component.scss']
})
export class PartsCheckPriceCodeComponent extends AppComponentBase implements OnInit {
  @ViewChild('newCheckPriceCodeModal', {static: false}) newCheckPriceCodeModal;
  form: FormGroup;
  // currentUser: CurrentUserModel = CurrentUser;
  dealerList: DealerModel[] = [];

  fieldGridInquiry;
  inquiryParams;
  inquiryData: InquiryPriceCodeModel[] = [];
  partListForExport: Array<InquiryPriceCodeModel> = [];
  selectedInquiry: InquiryPriceCodeModel;
  selectedInquiries: Array<InquiryPriceCodeModel> = [];

  fieldGridPart;
  partParams;
  partsOfInquiry: PartsOfInquiryModel[] = [];
  selectedPart: PartsOfInquiryModel;

  frameworkComponents;
  year = new Date().getFullYear();
  month = new Date().getMonth();
  date = new Date().getDate();
  paginationTotalsData;
  paginationParams: PaginationParamsModel;
  statusCodes1 = [
    {key: '0', value: 'Bản nháp'},
    {key: '1', value: 'Chưa xử lý'},
    {key: '2', value: 'Đã xử lý'},
    {key: '3', value: 'Từ chối'}
  ];
  loadScreen;
  statusCodes2 = [
    {key: '1', value: 'Chưa đăng ký'},
    {key: '4', value: 'Đã đăng ký'},
    {key: '2', value: 'Chờ hỏi'},
    {key: '3', value: 'Từ chối'}
  ];

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dealerApi: DealerApi,
    private dataFormatService: DataFormatService,
    private partsCheckPriceCodeApi: PartsCheckPriceCodeApi,
    private gridTableService: GridTableService,
    private downloadService: DownloadService,
    private validateBeforeSearchService: ValidateBeforeSearchService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadScreen = true;
    this.fieldGridInquiry = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        width: 25
      },
      {
        headerName: 'Mã ĐL',
        headerTooltip: 'Mã đại lý',
        field: 'dlrCode',
        width: 30
      },
      {
        headerName: 'Số phiếu hỏi',
        headerTooltip: 'Số phiếu hỏi',
        field: 'inquiryno',
        width: 70,
        editable: this.currentUser.isAdmin
      },
      {
        headerName: 'Full Model Code',
        headerTooltip: 'Full Model Code',
        field: 'fullmodelcode',
        width: 60,
        editable: this.currentUser.isAdmin
      },
      {
        headerName: 'Vinno/Frameno',
        headerTooltip: 'Vinno/Frameno',
        field: 'vinnoFrameno',
        width: 60,
        editable: this.currentUser.isAdmin
      },

      {
        headerName: 'Ngày hỏi',
        headerTooltip: 'Ngày hỏi',
        field: 'createDate',
        width: 50,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Người hỏi',
        headerTooltip: 'Người hỏi',
        field: 'personQuery',
        width: 50
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        width: 50,
        valueFormatter: params => {
          const matched = this.statusCodes1.find(status => params.value === status.key);
          if (matched) {
            return matched.value;
          }
        }
      },
      {
        headerName: 'Ghi chú DLR',
        headerTooltip: 'Ghi chú DLR',
        field: 'remark',
        width: 50
      },
      {
        headerName: 'Ghi chú TMV',
        headerTooltip: 'Ghi chú TMV',
        field: 'remarkTmv',
        width: 50
      },
      {
        headerName: 'Hỏi Mã',
        headerTooltip: 'Hỏi Mã',
        field: 'queryCode',
        width: 30
      },
      {
        headerName: 'Hỏi Giá',
        headerTooltip: 'Hỏi Giá',
        field: 'queryPrice',
        width: 30
      }
    ];
    this.fieldGridPart = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partscode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsname'
      },
      {
        headerName: 'PNC',
        headerTooltip: 'PNC',
        field: 'pnc'
      },
      {
        headerName: 'PT Thay thế',
        headerTooltip: 'PT Thay thế',
        field: 'substitutionpartno'
      },
      {
        headerName: 'Ghi chú DLR',
        headerTooltip: 'Ghi chú DLR',
        field: 'remark'
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        valueFormatter: params => {
          const matched = this.statusCodes2.find(status => params.value === status.key);
          if (matched) {
            return matched.value;
          }
        }
      },
      {
        headerName: 'Ngày hẹn trả lời',
        headerTooltip: 'Ngày hẹn trả lời',
        field: 'respondDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Ghi chú TMV',
        headerTooltip: 'Ghi chú TMV',
        field: 'remarkTmv'
      }
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.getDealerList();
    this.buildForm();
  }

  getDealerList() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(dealerList => {
      this.loadingService.setDisplay(false);
      this.dealerList = dealerList;
      this.search();
    });
  }

  modifyInquiry() {
    if (!this.selectedInquiry) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn yêu cầu', 'Hãy chọn một yêu cầu để cập nhật');
      return;
    }
    if (!this.currentUser.isAdmin && this.selectedInquiry && this.selectedInquiry.status !== '0') {
      this.swalAlertService.openWarningToast('Chỉ được sửa bản nháp', 'Cảnh báo');
      return;
    }
    this.newCheckPriceCodeModal.open(this.selectedInquiry, this.partsOfInquiry);
  }

  // =====**** INQUIRY GRID ****=====
  callbackInquiry(params) {
    this.inquiryParams = params;
  }

  getParamsInquiry() {
    this.selectedInquiries = this.inquiryParams.api.getSelectedRows();
    if (this.selectedInquiries.length) {
      this.selectedInquiry = this.selectedInquiries[0];
      this.getPartsOfInquiry();
    } else {
      return;
    }
    this.partListForExport = [...this.selectedInquiries];
  }

  changePaginationParams(paginationParams) {
    if (!this.inquiryData) {
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

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate, false)) {
      return;
    }
    this.loadingService.setDisplay(true);
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.partsCheckPriceCodeApi.searchInquiry(formValue, this.paginationParams).subscribe(inquiry => {
      this.loadingService.setDisplay(false);
      this.inquiryData = inquiry.srvBQueryPricecodes;
      this.paginationTotalsData = inquiry.total;
      this.partListForExport = [];
      if (this.inquiryData && !this.inquiryData.length) {
        this.partsOfInquiry = [];
        this.selectedPart = undefined;
        this.inquiryParams.api.setRowData(this.inquiryData);
        this.partParams.api.setRowData(this.partsOfInquiry);
        return;
      }
      this.inquiryParams.api.setRowData(this.addDlrCodeToInquiry(this.inquiryData));
      this.gridTableService.selectFirstRow(this.inquiryParams);
    });
    if (this.loadScreen) {
      if ([-2, -1].includes(this.currentUser.dealerId)) {
        this.form.patchValue({
          fromDate: new Date(this.year, this.month, this.date - 7).getTime(),
          toDate: new Date(this.year, this.month, this.date, 23, 59, 59).getTime()
        });
      }
      this.loadScreen = !this.loadScreen;
    }
  }

  // add dealer code for each inquiry
  addDlrCodeToInquiry(inquiryData: InquiryPriceCodeModel[]) {
    inquiryData.forEach(data => {
      const matchedDealer = this.dealerList.find(dealer => data.dlrId === dealer.id);
      if (matchedDealer) {
        data.dlrCode = matchedDealer.code;
      }
    });
    return this.gridTableService.addSttToData(inquiryData);
  }

  refreshAfterEdit(updatedValue) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();

    let fromDate = null;
    let toDate = null;

    if (!this.currentUser.isAdmin) {
      fromDate = new Date(year, month, date - 7).getTime();
      toDate = new Date(year, month, date, 23, 59, 59).getTime();
    }

    this.form.reset();
    this.search();
  }

  cellValueChanged(params) {
    const field = params.colDef.field;
    if (field === 'checkForExport') {
      if (params.data[field]) {
        this.partListForExport.push(params.data);
      } else if (this.partListForExport.length) {
        remove(this.partListForExport, params.data);
      }
    }
  }

  // =====**** PART OF FEEDBACK GRID ****=====
  callbackPart(params) {
    this.partParams = params;
  }

  getPartsOfInquiry() {
    if (!!this.selectedInquiry && !!this.selectedInquiry.id) {
      this.loadingService.setDisplay(true);
      this.partsCheckPriceCodeApi.getPartsOfInquiry(this.selectedInquiry.id)
        .subscribe(partsOfInquiry => {
          this.loadingService.setDisplay(false);
          this.partsOfInquiry = partsOfInquiry.srvBQueryPcResponds;
          this.partParams.api.setRowData(this.gridTableService.addSttToData(this.partsOfInquiry));
        });
    } else {
      return;
    }
  }

  exportExcel() {
    if (!this.partListForExport.length) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn ít nhất một đơn hàng để xuất dữ liệu', 'Cảnh báo');
      return;
    }
    const idArr = [];
    this.partListForExport.forEach(data => idArr.push(data.id));
    this.loadingService.setDisplay(true);
    this.partsCheckPriceCodeApi.exportExcel(idArr)
      .subscribe(res => {
        this.loadingService.setDisplay(false);
        this.downloadService.downloadFile(res);
      });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    let fromDate = null;
    let toDate = null;

    if (!this.currentUser.isAdmin) {
      fromDate = new Date(year, month, date - 7).getTime();
      toDate = new Date(year, month, date, 23, 59, 59).getTime();
    }

    this.form = this.formBuilder.group({
      dlrId: [!this.currentUser.isAdmin ? this.currentUser.dealerId : null],
      fromDate: [fromDate],
      toDate: [toDate],
      inquiryNo: [undefined],
      inquiryType: [0],
      partCode: [undefined],
      partName: [undefined],
      status: [[-2, -1].includes(this.currentUser.dealerId) ? 1 : 5],
      statusDetail: [5]
    });
  }
}
