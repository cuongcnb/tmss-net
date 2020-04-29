import { Component, EventEmitter , OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'voc-code',
  templateUrl: './voc-code.component.html',
  styleUrls: ['./voc-code.component.scss']
})
export class VocCodeComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: ContactCustomModel;
  form: FormGroup;
  fieldGrid;
  gridParams;
  tabs: Array<any>;
  selectedTab;
  experience: Array<any>;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService ,
    private swalAlertSevice: ToastService ,
  ) {

  }

  ngOnInit() {
    this.initTabs();
    this.selectedTab = this.tabs[0];
    this.fieldGrid = [
      {headerName: 'No', headerTooltip: 'No', field: 'no'},
      {headerName: 'Ngày', headerTooltip: 'Ngày', field: 'day'},
      {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'content'},
    ];
    this.experience = [
      {headerName: 'Nội dung không hài lòng/khiếu nại', headerTooltip: 'Nội dung không hài lòng/khiếu nại', field: 'requestContent'},
      {headerName: 'Yêu cầu của khách hàng', headerTooltip: 'Yêu cầu của khách hàng', field: 'requestCustomer'},
      {headerName: 'Lĩnh vực không hài lòng/khiếu nại', headerTooltip: 'Lĩnh vực không hài lòng/khiếu nại', field: 'requestField'},
      {headerName: 'Vấn đề không hài lòng/khiếu nại', headerTooltip: 'Vấn đề không hài lòng/khiếu nại', field: 'requestProblem'},
      {headerName: 'Bộ phận hư hỏng/quy trình', headerTooltip: 'Bộ phận hư hỏng/quy trình', field: 'partDamaged'},
      {headerName: 'Hiện tượng hư hỏng/quy trình phụ', headerTooltip: 'Hiện tượng hư hỏng/quy trình phụ', field: 'phenomenaDamaged'},
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  refresh() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
    this.onResize();
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private initTabs() {
    this.tabs = ['Thông tin khiếu nại'];
  }

  onSubmit() {
  }
  save(data) {
    // this.gridParams = data;
    this.gridParams.push(data);
    this.close.emit();
    this.swalAlertSevice.openSuccessToast();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      nameContact: [{value: undefined, disabled: true}],
      carownerName: [{value: undefined, disabled: true}],
      phoneNumber: [{value: undefined, disabled: true}],
      companyName: [{value: undefined, disabled: true}],
      email: [{value: undefined, disabled: true}],
      address: [{value: undefined, disabled: true}],
      typeCar: [{value: undefined, disabled: true}],
      sumKm: [{value: undefined, disabled: true}],
      vinNo: [{value: undefined, disabled: true}],
      licensePlate: [{value: undefined, disabled: true}],
      serviceAdvisor: [{value: undefined, disabled: true}],
      techniciansName: [{value: undefined, disabled: true}],
      dayCreate: [undefined],
      agency: [undefined],
      check: [undefined],
      dayReceive: [undefined],
      daySend: [undefined],
      sourceReceipt: [undefined],
      status: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
