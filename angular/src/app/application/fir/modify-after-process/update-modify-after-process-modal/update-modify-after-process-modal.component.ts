import { Component, OnInit, ViewChild } from '@angular/core';
import { ModifyAfterProcessModel } from '../../../../core/models/fir/modify-after-process.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { of } from 'rxjs';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-modify-after-process-modal',
  templateUrl: './update-modify-after-process-modal.component.html',
  styleUrls: ['./update-modify-after-process-modal.component.scss'],
})
export class UpdateModifyAfterProcessModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  data: Array<any> = [];
  form: FormGroup;
  selectedData: ModifyAfterProcessModel;
  selectedErrorCode;
  modalHeight: number;
  fieldGrid;
  fieldGridSearchDataGrid;
  addGridParams;
  getFormData;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
    private modalHeightService: SetModalHeightService,
  ) {
    this.fieldGrid = [
      {headerName: 'Mã lỗi', headerTooltip: 'Mã lỗi', field: 'errorCode'},
      {headerName: 'Bộ phận gây lỗi', headerTooltip: 'Bộ phận gây lỗi', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {headerName: 'Nguyên nhân cốt lõi', headerTooltip: 'Nguyên nhân cốt lõi', field: 'coreReason'},
      {headerName: 'Biện pháp chống tái diễn', headerTooltip: 'Biện pháp chống tái diễn', field: 'preventiveMeasures'},
      {headerName: 'Biện pháp xử lý', headerTooltip: 'Biện pháp xử lý', field: 'processMeasures'},
    ];

    this.fieldGridSearchDataGrid = [
      {headerName: 'Mã lỗi', headerTooltip: 'Mã lỗi', field: 'errorCode'},
      {headerName: 'Bộ phận gây lỗi', headerTooltip: 'Bộ phận gây lỗi', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {headerName: 'Nguyên nhân cốt lõi', headerTooltip: 'Nguyên nhân cốt lõi', field: 'coreReason'},
      {headerName: 'Biện pháp chống tái diễn', headerTooltip: 'Biện pháp chống tái diễn', field: 'preventiveMeasures'},
      {headerName: 'Biện pháp xử lý', headerTooltip: 'Biện pháp xử lý', field: 'processMeasures'},
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  save() {
    this.getFormData = this.form.getRawValue();
  }

  add(selectedData) {
    const formValue = selectedData;
    this.form.patchValue(formValue);
    this.data.push(formValue);
    this.refreshGridUpdate();
  }

  update(selectedData) {
    this.data = this.data.map(data => {
      return data === this.selectedErrorCode ? selectedData : data;
    });
    this.refreshGridUpdate();
  }

  openEditModal() {
    this.selectedErrorCode
      ? this.searchDataGridModal.open()
      : this.swalAlert.openWarningToast('ban phai chon 1 dong');
  }

  callbackGrid(params) {
    this.addGridParams = params;
    this.addGridParams.api.setRowData(this.data);
  }

  getParams() {
    const selected = this.addGridParams.api.getSelectedRows();
    if (selected) {
      this.selectedErrorCode = selected[0];
    }
  }

  del() {
    if (this.selectedErrorCode) {
      this.confirm.openConfirmModal('Question?', 'Ban co muon xoa ko?').subscribe(() => {
        this.data = this.data.filter(data => data !== this.selectedErrorCode);
        this.refreshGridUpdate();
      });
    } else {
      this.swalAlert.openWarningToast('Ban phai chon 1 dong');
    }
  }

  apiCall() {
    return of([{
      errorCode: 'Hưng',
      partsName: '123',
      coreReason: 'doan xem',
      preventiveMeasures: 'ạdhkasdjk',
      processMeasures: 'ádsadsa',
    }, {
      errorCode: 'Hoang',
      partsName: '456',
      coreReason: 'chiu',
      preventiveMeasures: '22561',
      processMeasures: '77451',
    },
    ]);
  }

  private refreshGridUpdate() {
    this.selectedErrorCode = undefined;
    this.addGridParams.api.setRowData(this.data);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      // Top Group
      code: [{value: undefined, disabled: true}],
      licensePlate: [{value: undefined, disabled: true}],
      driverName: [{value: undefined, disabled: true}],
      serviceAdvisor: [{value: undefined, disabled: true}],
      dateIn: [{value: undefined, disabled: true}],
      dateOut: [{value: undefined, disabled: true}],
      lscType: [{value: undefined, disabled: true}],
      lsc: [{value: undefined, disabled: true}],

      customerResponse: [undefined],
      feedbackPerson: [undefined],
      group: [undefined],
      floor: [undefined],
      department: [undefined],
      feedbackDate: [undefined],

      // Tinh trang lien he voi khach hang
      statusContactCustomer: ['N'],
      reasonNotContact: [undefined],
      dateContactCustomer: [undefined], // date contact customer
      timeContactCustomer: [undefined], // time contact customer

      // Xac nhan No Q1
      q1: [undefined],
      q2: [undefined],
      q3: [undefined],

      hailong: [undefined], // hai long
      agreeBack: [undefined],
      dateBack: [{value: undefined, disabled: true}],
      timeBack: [{value: undefined, disabled: true}],

      notBack: [undefined],
      reasonNotBack: [{value: undefined, disabled: true}],

      infoNonFIR: [{value: undefined, disabled: true}], // info non fir

      // Xac nhan cua bo phan sua chua
      customerComeBack: [undefined],
      customerNotComeBack: [undefined], // customer not come back
      dateCustomerBack: [undefined],

      // Xac nhan thong tin tu phong dich vu
      sLSC: [undefined],
      nameResolve: [undefined],
      repairContent: [undefined],
      statusSettlement: [false],
      statusSettlement1: [false],

      // Code thừa
      // supplier: [undefined],
      // status: [undefined],
      // lslh: [undefined],
      // explainMisapprehend: [undefined],
      // apologizeCustomer: [undefined],
      // satisfied: [undefined],
      //
      // errorCode: [undefined],
      // coreReason: [undefined],
      // preventiveMeasures: [undefined],
      // processMeasures: [undefined],
      //
    });

    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

    this.form.get('statusContactCustomer').valueChanges.subscribe(val => {
      if (val === 'notContact') {
        this.form.get('timeContactCustomer').disable();
        this.form.get('dateContactCustomer').disable();
      }
      if (val === 'contact') {
        this.form.get('timeContactCustomer').enable();
        this.form.get('dateContactCustomer').enable();
      }
    });

    this.form.get('customerComeBack').valueChanges.subscribe(() => {
      this.form.get('q1').patchValue({});
    });

    this.form.get('statusSettlement').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('statusSettlement1').patchValue(false);
      }
    });

    this.form.get('statusSettlement1').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('statusSettlement').patchValue(false);
      }
    });

    this.form.get('customerComeBack').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('customerNotComeBack').patchValue(false);
      }
    });

    this.form.get('customerNotComeBack').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('customerComeBack').patchValue(false);
      }
    });

    this.form.get('agreeBack').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('dateBack').enable();
        this.form.get('timeBack').enable();
      } else {
        this.form.get('dateBack').disable();
        this.form.get('timeBack').disable();
      }
    });

    this.form.get('customerNotComeBack').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('sLSC').disable();
        this.form.get('nameResolve').disable();
        this.form.get('repairContent').disable();
      } else {
        this.form.get('sLSC').enable();
        this.form.get('nameResolve').enable();
        this.form.get('repairContent').enable();
      }
    });

    this.form.get('notBack').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('reasonNotBack').enable();
      } else {
        this.form.get('reasonNotBack').disable();
      }
    });

    this.form.get('agreeBack').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('notBack').patchValue(false);
      }
    });

    this.form.get('notBack').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('agreeBack').patchValue(false);
      }
    });

    this.form.get('q1').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('infoNonFIR').enable();
      } else {
        this.form.get('infoNonFIR').disable();
      }
    });
  }

}
