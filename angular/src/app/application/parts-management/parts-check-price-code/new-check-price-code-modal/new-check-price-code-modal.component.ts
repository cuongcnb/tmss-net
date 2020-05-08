import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import {
  InquiryPriceCodeModel,
  PartsOfInquiryModel
} from '../../../../core/models/parts-management/parts-check-price-code.model';
import { AgDatepickerRendererComponent } from '../../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { PartsCheckPriceCodeApi } from '../../../../api/parts-management/parts-check-price-code.api';
import { AgSelectRendererComponent } from '../../../../shared/ag-select-renderer/ag-select-renderer.component';
import { CurrentUserModel } from '../../../../core/models/base.model';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-check-price-code-modal',
  templateUrl: './new-check-price-code-modal.component.html',
  styleUrls: ['./new-check-price-code-modal.component.scss']
})
export class NewCheckPriceCodeModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('submitFormBtn', { static: false }) submitFormBtn: ElementRef;
  @Input() statusCodes1: { key: any, value: any }[];
  @Input() statusCodes2: { key: any, value: any }[];
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  // currentUser: CurrentUserModel = CurrentUser;
  modalHeight: number;
  form: FormGroup;
  focusCellIndex = 0;
  selectedInquiry: InquiryPriceCodeModel;
  partsOfInquiry: Array<PartsOfInquiryModel>;

  fieldGrid;
  params;
  displayedData: Array<PartsOfInquiryModel> = [];
  selectedPart: PartsOfInquiryModel;
  hiddenStatus;

  frameworkComponents;
  renderTable = true;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private partsCheckPriceCodeApi: PartsCheckPriceCodeApi
  ) {
    super(injector);
  }

  ngOnInit() {
    // inquiryStatus !== 2 => status "Da xu ly"
    this.frameworkComponents = {
      agDatepickerRendererComponent: AgDatepickerRendererComponent,
      agSelectRendererComponent: AgSelectRendererComponent
    };
  }

  editableField(params) {
    const field = params.colDef.field;
    if (this.currentUser.isAdmin) {
      if (+params.data.inquiryStatus === 2 || +params.data.inquiryStatus === 1) {
        return !!(field === 'partscode' && params.data.queryCode === 'Y');
      }
      if (+params.data.inquiryStatus === 3) {
        return false;
      }
      if (params.data && !!this.form.controls.queryCode.value) {
        return false;
      }
      if (params.data && this.form.controls.status.value === '3') {
        return false;
      }
    }
    return true;
  }

  checkFieldEnable(params) {
    if (+params.data.inquiryStatus === 3) {
      return true;
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedInquiry?, partsOfInquiry?) {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 30
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partscode',
        width: 80,
        editable: params => this.currentUser.admin && this.form.controls.status.value === '3' ? !this.editableField(params) : this.editableField(params),
        // {
        //   if (this.currentUser.admin) {
        //     if (this.form.controls.status.value !== '3') {
        //       return !this.editableField(params);
        //     } else { return this.editableField(params); }
        //   }
        // },
        cellClass: params => this.editableField(params) ? ['cell-border', 'partscode'] : ['cell-border', 'cell-readonly', 'partscode']
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsname',
        editable: params => this.editableField(params),
        cellClass: params => this.editableField(params) ? ['cell-border'] : ['cell-border', 'cell-readonly']
      },
      {
        headerName: 'PNC',
        headerTooltip: 'PNC',
        field: 'pnc',
        width: 70,
        editable: params => this.editableField(params),
        cellClass: params => this.editableField(params) ? ['cell-border'] : ['cell-border', 'cell-readonly']
      },
      {
        headerName: 'PT Thay thế',
        headerTooltip: 'PT Thay thế',
        field: 'substitutionpartno',
        width: 70,
        editable: params => this.editableField(params),
        cellClass: params => this.editableField(params) ? ['cell-border'] : ['cell-border', 'cell-readonly']
      },
      {
        headerName: 'Ghi chú DLR',
        headerTooltip: 'Ghi chú DLR',
        field: 'remark',
        width: 70,
        editable: params => this.editableField(params),
        cellClass: params => this.editableField(params) ? ['cell-border'] : ['cell-border', 'cell-readonly']
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        width: 90,
        cellRenderer: 'agSelectRendererComponent',
        disableSelect: this.currentUser.isAdmin ? (params => this.checkFieldEnable(params)) : true,
        list: this.statusCodes2,
        // cellClass: params => this.checkFieldEnable(params) ? ['p-0', 'cell-border', 'cell-readonly'] : ['p-0', 'cell-border']
        cellClass: this.currentUser.isAdmin ? (params => this.checkFieldEnable(params)
          ? ['cell-border', 'p-0', 'cell-readonly']
          : ['cell-border', 'p-0']) : ['cell-readonly', 'cell-border', 'p-0']
      },
      {
        headerName: 'Ngày hẹn trả lời',
        headerTooltip: 'Ngày hẹn trả lời',
        field: 'respondDate',
        width: 80,
        cellRenderer: 'agDatepickerRendererComponent',
        disableSelect: this.currentUser.isAdmin ? (params => this.checkFieldEnable(params)) : true,
        cellClass: this.currentUser.isAdmin ? (params => this.checkFieldEnable(params)
          ? ['cell-border', 'p-0', 'cell-readonly']
          : ['cell-border', 'p-0']) : ['cell-readonly', 'cell-border', 'p-0']
      },
      {
        headerName: 'Ghi chú TMV',
        headerTooltip: 'Ghi chú TMV',
        field: 'remarkTmv',
        width: 100,
        editable: this.currentUser.isAdmin,
        // cellClass: ['cell-border']
        cellClass: this.currentUser.isAdmin ? (params => this.checkFieldEnable(params)
          ? ['cell-border', 'p-0', 'cell-readonly']
          : ['cell-border', 'p-0']) : ['cell-readonly', 'cell-border', 'p-0']
      }
    ];
    this.buildForm();
    this.modal.show();
    this.selectedInquiry = selectedInquiry ? selectedInquiry : undefined;
    this.partsOfInquiry = partsOfInquiry ? partsOfInquiry : undefined;
    if (this.selectedInquiry) {
      this.getModifyData();
    }
  }

  getModifyData() {
    this.loadingService.setDisplay(true);
    this.partsCheckPriceCodeApi.editInquiry(this.selectedInquiry)
      .subscribe(data => {
        this.loadingService.setDisplay(false);
        this.form.patchValue(data.srvBQueryPricecode);
        if (this.currentUser.isAdmin && +data.srvBQueryPricecode.status === 1) {
          this.hiddenStatus = true;
        }
        if (this.currentUser.isAdmin && +data.srvBQueryPricecode.status === 2) {
          // this.form.controls.status.disable();
          this.fieldGrid.disableSelect = true;
          this.hiddenStatus = false;
        }
        if (this.currentUser.isAdmin && +data.srvBQueryPricecode.status === 3) {
          this.form.controls.status.disable();
        }
        // Add fields to check for validations and editable condition
        const partsData = [];
        data.srvBQueryPcResponds.forEach(part => {
          part.inquiryStatus = data.srvBQueryPricecode.status;
          part.queryCode = data.srvBQueryPricecode.queryCode;
          part.queryPrice = data.srvBQueryPricecode.queryPrice;
          partsData.push(part);
        });

        this.params.api.setRowData(this.gridTableService.addSttToData(partsData));
      });
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;

    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const KEY_TAB = 'Tab';

    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === this.displayedData.length - 1) {
        this.onAddRow();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  reset() {
    this.form = undefined;
    this.hiddenStatus = undefined;
    this.selectedInquiry = undefined;
    this.partsOfInquiry = undefined;
    this.displayedData = [];
  }

  patchData() {
    if (this.selectedInquiry && this.partsOfInquiry) {
      this.params.api.setRowData(this.partsOfInquiry);
      this.form.patchValue(this.selectedInquiry);
    }
    if (!this.currentUser.isAdmin) {
      this.form.patchValue({
        feedbackDate: new Date()
        // status: 1,
      });
    }
  }

  callbackGrid(params) {
    this.params = params;
    this.getModifyData();
    this.patchData();
    // this.onAddRow();
  }

  getParams() {
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  onAddRow() {
    const blankPart = {
      stt: this.displayedData.length + 1,
      partscode: null,
      partsname: null,
      pnc: null,
      substitutionpartno: null,
      remark: null,
      status: null,
      respondDate: null,
      remarkTmv: null
    };
    this.params.api.updateRowData({ add: [blankPart] });
    this.getDisplayedData();
    this.gridTableService.setFocusCell(this.params, 'partscode', this.displayedData);
  }

  removeSelectedRow() {
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng', 'Hãy chọn một phụ tùng để xóa');
      return;
    }
    this.gridTableService.removeSelectedRow(this.params, this.selectedPart);
    this.selectedPart = undefined;
    this.getDisplayedData();
  }

  saveDraft() {
    this.getDisplayedData();
    this.submitFormBtn.nativeElement.click();
    if (this.form.invalid) {
      return;
    }
    if (!this.form.getRawValue().queryCode && !this.form.getRawValue().queryPrice) {
      this.swalAlertService.openWarningToast('Bắt buộc chọn Hỏi mã/Hỏi giá');
      return;
    }

    const val = {
      srvBQueryPricecode: this.convertQueryTypeToYN,
      srvBQueryPcResponds: this.displayedData
    };
    this.loadingService.setDisplay(true);
    this.partsCheckPriceCodeApi.saveDraft(val).subscribe(res => {
      this.swalAlertService.openSuccessToast(`Cập nhật thành công: ${res.srvBQueryPricecode.inquiryno}`);
      this.modal.hide();
      this.close.emit(res.srvBQueryPricecode);
      this.loadingService.setDisplay(false);
    });
  }

  send() {
    this.getDisplayedData();
    this.submitFormBtn.nativeElement.click();
    if (this.form.invalid) {
      return;
    }
    if (!this.form.getRawValue().queryCode && !this.form.getRawValue().queryPrice) {
      this.swalAlertService.openWarningToast('Bắt buộc chọn Hỏi mã/Hỏi giá');
      return;
    }
    if (!this.displayedData.length) {
      this.swalAlertService.openWarningToast('Danh sách phụ tùng để hỏi mã/hỏi giá đang trống. Hãy thêm ít nhất một phụ tùng trước khi Gửi TMV');
      return;
    }
    const val = {
      srvBQueryPricecode: this.convertQueryTypeToYN,
      srvBQueryPcResponds: this.displayedData
    };

    this.loadingService.setDisplay(true);
    this.partsCheckPriceCodeApi.send(val).subscribe(res => {
      this.swalAlertService.openSuccessToast(`Phiếu hỏi gửi TMV thành công: ${res.srvBQueryPricecode.inquiryno}`);
      this.modal.hide();
      this.close.emit(res.srvBQueryPricecode);
      this.loadingService.setDisplay(false);
    });
  }

  get convertQueryTypeToYN() {
    if (!this.currentUser.admin) {
      this.form.controls.status.patchValue('0');
    }
    const val = this.form.getRawValue();
    if (val.queryPrice) {
      val.queryPrice = 'Y';
    } else if (val.queryCode) {
      val.queryCode = 'Y';
    }
    return val;
  }

  getDisplayedData() {
    this.displayedData = this.gridTableService.getAllData(this.params);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fullmodelcode: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.required],
      inquiryno: [{ value: undefined, disabled: true }],
      vinnoFrameno: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.required],
      queryCode: [{ value: 'Y', disabled: this.currentUser.isAdmin }],
      queryPrice: [{ value: undefined, disabled: this.currentUser.isAdmin }],
      personQuery: [{ value: this.currentUser.userName, disabled: this.currentUser.isAdmin }],
      createDate: [{ value: new Date().getTime(), disabled: true }],
      status: [{ value: undefined, disabled: !this.currentUser.isAdmin }],
      remark: [{ value: undefined, disabled: this.currentUser.isAdmin }],
      remarkTmv: [{ value: undefined, disabled: !this.currentUser.isAdmin }],
      telPersonQuery: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.phoneFormat],

      id: [undefined],
      createdBy: [undefined],
      deleteflag: [undefined],
      dlrId: [undefined],
      modifiedBy: [undefined],
      modifyDate: [undefined]
    });
    this.form.get('queryCode').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({ queryPrice: null });
      }
    });
    this.form.get('queryPrice').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({ queryCode: null });
      }
    });
    this.form.get('status').valueChanges.subscribe(val => {
      if (val) {
        this.renderTable = false;
        this.fieldGrid = this.fieldGrid.map(it => {
          if (val === '3') {
            if (it.hasOwnProperty('editable')) {
              it.editable = false;
            }
            if (it.hasOwnProperty('disableSelect')) {
              it.disableSelect = true;
            }
          }
          return it;
        });
      }
      this.renderTable = true;
    });
  }

  cellValueChanged(params) {
    const timeNow = new Date().getTime();
    params.api.forEachNode(node => {
      if (node.data.status !== '3' && this.form.get('status').value === '3') {
        node.setDataValue('status', '3');
      }
      if (params.colDef.field === 'status' && node.data.status !== '3') {
        this.form.get('status').patchValue('2');
      }
      if (!!node.data.respondDate && node.data.respondDate < timeNow) {
        node.setDataValue('respondDate', null);
        this.swalAlertService.openWarningToast('Ngày được chọn phải lớn hơn ngày hôm nay');
      }
    });
  }
}
