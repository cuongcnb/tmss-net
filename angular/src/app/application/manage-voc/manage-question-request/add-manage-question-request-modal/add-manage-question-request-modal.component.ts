import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { ManageQuestionRequestModel } from '../../../../core/models/manage-voc/manage-question-request.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-manage-question-request-modal',
  templateUrl: './add-manage-question-request-modal.component.html',
  styleUrls: ['./add-manage-question-request-modal.component.scss']
})
export class AddManageQuestionRequestModalComponent implements OnInit {

  @ViewChild('questionRequestModal', {static: false}) questionRequestModal;
  @ViewChild('chooseSupplierModal', {static: false}) chooseSupplierModal;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  vin = true;
  licensePlate = true;
  modalHeight: number;
  editModal: boolean;
  fieldGrid;
  gridParams;
  displayedData: Array<ManageQuestionRequestModel> = [];
  selectedData: ManageQuestionRequestModel;
  selectedRowData: ManageQuestionRequestModel;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private gridTableService: GridTableService,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.fieldGrid = [
      {headerName: 'Nội dung thắc mắc - yêu cầu', headerTooltip: 'Nội dung thắc mắc - yêu cầu', field: 'contentQuestionRequest', editable: true},
      {headerName: 'Nội dung trả lời', headerTooltip: 'Nội dung trả lời', field: 'contentAnswer', editable: true},
      {headerName: 'Lĩnh vực thắc mắc', headerTooltip: 'Lĩnh vực thắc mắc', field: 'questionField'},
      {headerName: 'Vấn đề thắc mắc', headerTooltip: 'Vấn đề thắc mắc', field: 'questionProblem'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  callbackGrid(params) {
    this.gridParams = params;
  }

  openCSLPModal() {
    this.chooseSupplierModal.open(true);
  }

  openCSVModal() {
    this.chooseSupplierModal.open(false);
  }

  open(selectedData?, editModal?) {
    this.selectedData = selectedData;
    this.editModal = editModal;
    this.buildForm();
    this.modal.show();
  }

  addData(data) {
    this.form.patchValue(data);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  clickQuestionField(params) {
    if (params.colDef.field === 'questionField') {
      this.questionRequestModal.open(params.data, true);
    }
    if (params.colDef.field === 'questionProblem') {
      this.questionRequestModal.open(params.data, false);
    }
  }

  outputQuestionData(data) {
    const index = this.displayedData.indexOf(this.selectedData);
    const val = Object.assign(data, {
      contentQuestionRequest: data.contentQuestionRequest,
      contentAnswer: data.contentAnswer,
      questionField: data.questionField,
      questionProblem: data.nameProblem,
    });
    this.displayedData[index] = val;
    this.gridParams.api.setRowData(this.gridTableService.addSttToData(this.displayedData));
    this.getDisplayedData();
  }

  onAddRow() {
    const blankQuestion = {
      contentQuestionRequest: undefined,
      contentAnswer: undefined,
      questionField: undefined,
      questionProblem: undefined,
    };
    this.gridParams.api.updateRowData({add: [blankQuestion]});
    this.getDisplayedData();
    this.gridTableService.setFocusCell(this.gridParams, 'contentQuestionRequest', this.displayedData);
  }

  onDeleteRow() {
    const selectedRowDel = this.gridParams.api.getSelectedRows();
    if (selectedRowDel) {
      this.selectedRowData = selectedRowDel[0];
    }
    (!this.selectedRowData)
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: selectedRowDel});
      });
  }

  save() {

  }

  getDisplayedData() {
    const displayedData = [];
    this.gridParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplierReception: [{value: 1, disabled: true}],
      dateReception: [undefined],
      timeReception: [undefined],
      status: [undefined],
      stt: [{value: undefined, disable: true}],
      dateCreate: [{value: undefined, disabled: true}],
      dateFinish: [undefined],
      timeFinish: [undefined],
      sourceReception: [undefined],
      approachMeans: [undefined],
      requestTMV: [{value: undefined, disabled: true}],
      dateSendToTMV: [{value: undefined, disabled: true}],
      // thông tin khách hàng
      customerName: [undefined],
      customerAddress: [undefined],
      customerPhone: [undefined],
      // thông tin xe
      carType: [undefined],
      licensePlate: [undefined],
      vin: [undefined],
      dateBuy: [undefined],
      supplierSell: [undefined],
      km: [undefined],
      supplierService: [undefined],
      // thời gian giải quyết
      firstCall: [undefined],
      inFourHours: [undefined],
      inFourHoursTime: [{value: undefined, disabled: true}],
      another: [undefined],
      anotherTime: [{value: undefined, disabled: true}],
      hardQuestion: [undefined],
      transferToRelaventDepartment: [undefined],
    });

    this.form.get('inFourHours').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('inFourHoursTime').enable();
      } else {
        this.form.get('inFourHoursTime').disable();
      }
    });

    this.form.get('another').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('anotherTime').enable();
      } else {
        this.form.get('anotherTime').disable();
      }
    });

    this.form.get('firstCall').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('inFourHours').patchValue(false);
        this.form.get('another').patchValue(false);
      }
    });

    this.form.get('inFourHours').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('firstCall').patchValue(false);
        this.form.get('another').patchValue(false);
      }
    });

    this.form.get('another').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('inFourHours').patchValue(false);
        this.form.get('firstCall').patchValue(false);
      }
    });
  }
}
