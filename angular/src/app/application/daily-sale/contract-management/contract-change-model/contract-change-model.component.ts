import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ContractManagementService} from '../../../../api/daily-sale/contract-management.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GradeListService} from '../../../../api/master-data/grade-list.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { GradeProductionService} from '../../../../api/master-data/grade-production.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contract-change-model',
  templateUrl: './contract-change-model.component.html',
  styleUrls: ['./contract-change-model.component.scss']
})
export class ContractChangeModelComponent implements OnInit {
  @ViewChild('contractChangeModal', {static: false}) modal: ModalDirective;
  @ViewChild('confirmRegain', {static: false}) confirmRegain;
  @ViewChild('confirmChangeOneRow', {static: false}) confirmChangeOneRow;
  @ViewChild('confirmRegainFrameNo', {static: false}) confirmRegainFrameNo;
  @ViewChild('checkColorProduct', {static: false}) checkColorProduct;
  @ViewChild('confirmChangeGrade', {static: false}) confirmChangeGrade;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  reasons: Array<LookupDataModel>;
  gradeList;
  gradeProductionList;
  selectedFollowUpId: number;
  changedType: string;
  changedValue: string;
  confirmRegainFrameNoText: string;
  vehicleToSaleList: Array<any>;

  contractChangeValue;
  blankChange = {
    gradeNewId: null,
    gradeProductionNewId: null,
    changeCustomer: null,
    changeTel: null,
    changeCustomerAddress: null,
    changeInvoiceName: null,
    changeInvoiceAddress: null,
    depositDateNew: null,
    salesDateNew: null,
    changeNewEstimatedDate: null,
    changeEstimatedReasonId: null,
    changeEstimatedReasonText: null,
    vehicleNewId: null,
    changeContractRepresentative: null,
    changeContactName: null,
    changeContactAddress: null,
    changeContactTel: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    private contractManagementService: ContractManagementService,
    private swalAlertService: ToastService,
    private gradeListService: GradeListService,
    private gradeProductionService: GradeProductionService,
    private formStoringService: FormStoringService,
    private loadingService: LoadingService,
    private lookupService: LookupService,
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  open(selectedFollowUpId) {
    this.selectedFollowUpId = selectedFollowUpId;
    this.contractManagementService.getChangeData(selectedFollowUpId).subscribe(val => {
      this.contractChangeValue = val;
      this.buildForm(val);

      if (!val.frameNo) {
        this.form.get('regainFrameNo').disable();
      }
      if (this.currentUser.isAdmin && val.regainFrameNo) {
        this.confirmRegainFrameNoText = `Đại lý đang yêu cầu lấy lại xe đã bán. FrameNo: ${val.frameNo}. Nếu TMV chấp nhận, hệ thống sẽ giải phóng trạng thái đã bán xe`;
        setTimeout(() => {
          this.confirmRegainFrameNo.show();
        }, 50);
      } else {
        this.getGradeList();
        this.lookupService.getDataByCode(LookupCodes.estimated_reason).subscribe(reasons => this.reasons = reasons);
        this.modal.show();
      }
    });
    this.getFrameNoList(selectedFollowUpId);
  }

  getGradeList() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
    });
  }

  regainFrameNo() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.regainFrameNo(this.selectedFollowUpId).subscribe(() => {
      this.loadingService.setDisplay(false);
      if (!this.checkChangesFrameNo) {
        this.modal.show();
      }
      this.close.emit();
    });
  }

  get checkChangesFrameNo() {
    // Check if is there anything else changed beside Regain Frame No
    let blank = true;
    for (const key in this.blankChange) {
      if (this.blankChange[key] !== this.contractChangeValue[key]) {
        blank = false;
        break;
      }
    }
    return blank;
  }

  getFrameNoList(selectedFollowUpId) {
    this.loadingService.setDisplay(true);
    this.contractManagementService.getSalesData(selectedFollowUpId).subscribe(val => {
      this.vehicleToSaleList = val.vehicleToSaleList;
      this.loadingService.setDisplay(false);
    });
  }

  approve() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.approveChangeContract(this.selectedFollowUpId, this.form.getRawValue()).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  reject() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.rejectChangeContract(this.selectedFollowUpId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  change(type) {
    this.changedType = type;
    this.changedValue = this.form.get(type).value;
    type === 'gradeNewId' ? this.confirmChangeGrade.show() : this.confirmChangeOneRow.show();
  }

  confirmChangeGradeAndProduct() {
    const val = {
      gradeId: this.form.getRawValue().gradeId,
      gradeProductionId: this.form.getRawValue().gradeProductionId,

      gradeNewId: this.form.getRawValue().gradeNewId,
      gradeProductionNewId: this.form.getRawValue().gradeProductionNewId
    };
    this.loadingService.setDisplay(true);
    this.contractManagementService.approveChangeGrade(this.selectedFollowUpId, val).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.close.emit();
    });
  }

  confirmChangeOneField() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.approveOneChangeContract(this.selectedFollowUpId, this.changedType, this.changedValue).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    if (formValue.changeNewEstimatedDate && (!formValue.changeEstimatedReasonId || !formValue.changeEstimatedReasonText) ||
      formValue.changeEstimatedReasonId && (!formValue.changeNewEstimatedDate || !formValue.changeEstimatedReasonText) ||
      formValue.changeEstimatedReasonText && (!formValue.changeEstimatedReasonId || !formValue.changeNewEstimatedDate)) {
      this.swalAlertService.openFailModal('Phải nhập vào lý do thay đổi ngày dự kiến giao xe');
      return;
    }

    if (this.form.value.gradeNewId && !this.form.value.gradeProductionNewId) {
      this.swalAlertService.openFailModal('Vui lòng chọn Grade Production theo Grade mới');
      return;
    }

    if (!this.form.value.gradeProductionNewId) {
      this.confirmChangeColorProduct();
      return;
    }

    this.loadingService.setDisplay(true);
    this.contractManagementService.checkColorProduct(this.selectedFollowUpId, this.form.value.gradeProductionNewId).subscribe(res => {
      this.loadingService.setDisplay(false);
      res ? this.checkColorProduct.show() : this.confirmChangeColorProduct();
    });
  }

  confirmChangeColorProduct() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.changeContractData(this.selectedFollowUpId, this.form.value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm(val) {
    this.form = this.formBuilder.group({
      // old
      grade: [{ value: undefined, disabled: true }],
      gradeId: [{ value: undefined, disabled: true }],
      gradeProduction: [{ value: undefined, disabled: true }],
      gradeProductionId: [{ value: undefined, disabled: true }],
      customerName: [{ value: undefined, disabled: true }],
      tel: [{ value: undefined, disabled: true }],
      customerAddress: [{ value: undefined, disabled: true }],
      invoiceName: [{ value: undefined, disabled: true }],
      invoiceAddress: [{ value: undefined, disabled: true }],
      depositDate: [{ value: undefined, disabled: true }],
      salesDate: [{ value: undefined, disabled: true }],
      newEstimatedDate: [{ value: undefined, disabled: true }],
      estimatedReasonType: [{ value: undefined, disabled: true }],
      estimatedReasonText: [{ value: undefined, disabled: true }],
      frameNo: [{ value: undefined, disabled: true }],
      contractRepresentative: [{ value: undefined, disabled: true }],
      contactName: [{ value: undefined, disabled: true }],
      contactAddress: [{ value: undefined, disabled: true }],
      contactTel: [{ value: undefined, disabled: true }],
      // new
      id: [undefined],
      gradeNewId: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      gradeProductionNewId: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeCustomer: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeTel: [{
        value: undefined,
        disabled: this.currentUser.isAdmin
      }, Validators.compose([GlobalValidator.blank, GlobalValidator.phoneFormat])],
      changeCustomerAddress: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeInvoiceName: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeInvoiceAddress: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      depositDateNew: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      salesDateNew: [{ value: undefined, disabled: this.currentUser.isAdmin || !val.salesDate }, GlobalValidator.blank],
      changeNewEstimatedDate: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeEstimatedReasonId: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeEstimatedReasonText: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      vehicleNewId: [{ value: undefined, disabled: this.currentUser.isAdmin || !val.frameNo }, GlobalValidator.blank],
      changeContractRepresentative: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeContactName: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeContactAddress: [{ value: undefined, disabled: this.currentUser.isAdmin }, GlobalValidator.blank],
      changeContactTel: [{
        value: undefined,
        disabled: this.currentUser.isAdmin
      }, Validators.compose([GlobalValidator.blank, GlobalValidator.phoneFormat])],
      //
      dlrRemarkForSale: [{
        value: undefined,
        disabled: this.currentUser.isAdmin
      }, Validators.compose([GlobalValidator.maxLength(255), GlobalValidator.blank])],
      tmvRemark: [{
        value: undefined,
        disabled: !this.currentUser.isAdmin
      }, Validators.compose([GlobalValidator.maxLength(255), GlobalValidator.blank])],
      regainFrameNo: [false],
    });

    if (val) {
      this.form.patchValue(val);
      if (val.gradeNewId) {
        this.loadingService.setDisplay(true);
        this.gradeProductionService.getGradeProductionTable(val.gradeNewId, true).subscribe(gradeProductionList => {
          this.gradeProductionList = gradeProductionList;
          this.loadingService.setDisplay(false);
        });
      }
    }
    this.watchFormValueChanges();
  }

  private watchFormValueChanges() {
    this.form.get('regainFrameNo').valueChanges.subscribe(val => {
      if (val) {
        this.confirmRegain.show();
      } else {
        if (this.form.value.frameNo) {
          this.form.get('newFrameNo').enable();
        }
      }
    });

    this.form.get('gradeNewId').valueChanges.subscribe(val => {
      if (val) {
        this.loadingService.setDisplay(true);
        this.gradeProductionService.getGradeProductionTable(val, true).subscribe(gradeProductionList => {
          this.gradeProductionList = gradeProductionList;
          this.loadingService.setDisplay(false);
        });
      } else {
        this.gradeProductionList = [];
      }
      this.form.patchValue({
        gradeProductionNewId: [undefined]
      });
    });
  }
}
