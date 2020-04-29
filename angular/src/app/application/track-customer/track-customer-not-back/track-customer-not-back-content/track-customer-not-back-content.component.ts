import { Component, OnInit } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LodashStubTrue } from 'lodash/fp';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'track-customer-not-back-content',
  templateUrl: './track-customer-not-back-content.component.html',
  styleUrls: ['./track-customer-not-back-content.component.scss'],
})
export class TrackCustomerNotBackContentComponent implements OnInit {

  fieldGrid;
  modalHeight: number;
  form: FormGroup;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'TT liên hệ', headerTooltip: 'TT liên hệ', field: 'infoContact'},
      {headerName: 'Liên hệ', headerTooltip: 'Liên hệ', field: 'contact'},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
      {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'km'},
      {headerName: 'Ngày dự kiến', headerTooltip: 'Ngày dự kiến', field: 'estimatedDay'},
      {headerName: 'TT đặt hẹn', headerTooltip: 'TT đặt hẹn', field: 'infoAppointment'},
      {headerName: 'Ngày hẹn', headerTooltip: 'Ngày hẹn', field: 'dateAppointment'},
      {headerName: 'Giờ hẹn', headerTooltip: 'Giờ hẹn', field: 'timeAppointment'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'cvdv'},
      {headerName: 'ND gọi', headerTooltip: 'ND gọi', field: 'contentCall'},
      {headerName: 'Lý do không thành công', headerTooltip: 'Lý do không thành công', field: 'reasonFail'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'note'},
      {headerName: 'Lý do khách hàng không quay lại', headerTooltip: 'Lý do khách hàng không quay lại', field: 'reasonCustomerNotBack'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'note1'},
      {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contacterName'},
      {headerName: 'Ngày liên hệ', headerTooltip: 'Ngày liên hệ', field: 'dateContact'},
      {headerName: 'Giờ liên hệ', headerTooltip: 'Giờ liên hệ', field: 'timeContact'},
    ];
    this.onResize();
    this.buildForm();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  check() {
  }

  callbackGrid() {

  }

  onSubmit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      // Thông tin xe
      licensePlate: [undefined],
      model: [undefined],
      vin: [undefined],
      // Thông tin khách hàng
      driversName: [undefined],
      driversAddress: [undefined],
      driversPhone: [undefined],
      driversEmail: [undefined],
      companyName: [undefined],
      companyAddress: [undefined],
      conpanyPhone: [undefined],
      carrierName: [undefined],
      carrierAddress: [undefined],
      carrierPhone: [undefined],
      carrierEmail: [undefined],
      // Cập nhật thông tin (Thông tin người liên hệ)
      contacterName: [undefined],
      contacterAddress: [undefined],
      contacterPhone: [undefined],
      contacterEmail: [undefined],
      // nội dung lần dịch vụ gần nhất
      dateIn: [undefined],
      cvdv: [undefined],
      km: [undefined],
      contentSC: [undefined],
      // nội dung lần dịch vụ gần nhất tại đại lý khác
      dateInK: [undefined],
      cvdvK: [undefined],
      supplier: [undefined],
      kmK: [undefined],
      contentSCK: [undefined],
      // liên hệ thành công
      checkboxContactTrue: [false],
      // thông tin phân loại (lý do)
      sellCar: [undefined],
      inconvenient: [undefined],
      transferWork: [undefined],
      notHaveTime: [undefined],
      doYourself: [undefined],
      complainPrice: [undefined],
      serviceOutWorkshop: [undefined],
      complainQuality: [undefined],
      serviceOutSupplier: [undefined],
      afterMarketNotGood: [undefined],
      goLess: [undefined],
      reasonTTPL: [undefined],
      reasonTTPLContent: [{value: undefined, disabled: true}],
      // thông tin liên hệ
      kmUpdate: [undefined],
      missKm: [undefined],
      note: [undefined],
      nextLevelBD: [undefined],
      nextDateBD: [undefined],
      dateAppointment: [undefined],
      timeAppointment: [undefined],
      // cvdv ttlh
      cvdvTTLH: [undefined],
      customerComplain: [undefined],
      customerComplainContent: [undefined],

      // liên hệ không thành công
      checkboxContactFalse: [false],
      // có nhấc máy
      anotherPickUp: [undefined],
      callLater: [undefined],
      anotherPhoneNumber: [undefined],
      messageLater: [undefined],
      notCallAgain: [undefined],
      reasonCNM: [undefined],
      reasonCNMContent: [{value: undefined, disabled: true}],
      // không nhấc máy
      busy: [undefined],
      notPickUp: [undefined],
      wrongNumberPhone: [undefined],
      cantContact: [undefined],
      reasonKNM: [undefined],
      reasonKNMContent: [{value: undefined, disabled: true}],
      // Ngày hẹn gọi lại cho KH
      dateAppointmentToCall: [undefined],
      timeAppointmentToCall: [undefined],
    });

    this.checkboxContact();

    this.checkboxInCBContact();
  }

  private checkboxContact() {
    // check box contact true

    this.form.get('checkboxContactTrue').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('checkboxContactFalse').patchValue(false);
      }
    });

    this.form.get('checkboxContactTrue').valueChanges.subscribe(val => {
      if (val === false) {
        this.form.get('sellCar').disable();
        this.form.get('inconvenient').disable();
        this.form.get('transferWork').disable();
        this.form.get('notHaveTime').disable();
        this.form.get('doYourself').disable();
        this.form.get('complainPrice').disable();
        this.form.get('serviceOutWorkshop').disable();
        this.form.get('complainQuality').disable();
        this.form.get('serviceOutSupplier').disable();
        this.form.get('afterMarketNotGood').disable();
        this.form.get('goLess').disable();
        this.form.get('reasonTTPL').disable();
        this.form.get('reasonTTPL').patchValue(false);
        this.form.get('reasonTTPLContent').disable();
        this.form.get('kmUpdate').disable();
        this.form.get('missKm').disable();
        this.form.get('nextLevelBD').disable();
        this.form.get('nextDateBD').disable();
        this.form.get('dateAppointment').disable();
        this.form.get('timeAppointment').disable();
        this.form.get('cvdvTTLH').disable();
        this.form.get('customerComplain').disable();
        this.form.get('customerComplain').patchValue(false);
        this.form.get('customerComplainContent').disable();
      }
    });

    this.form.get('checkboxContactTrue').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('sellCar').enable();
        this.form.get('inconvenient').enable();
        this.form.get('transferWork').enable();
        this.form.get('notHaveTime').enable();
        this.form.get('doYourself').enable();
        this.form.get('complainPrice').enable();
        this.form.get('serviceOutWorkshop').enable();
        this.form.get('complainQuality').enable();
        this.form.get('serviceOutSupplier').enable();
        this.form.get('afterMarketNotGood').enable();
        this.form.get('goLess').enable();
        this.form.get('reasonTTPL').enable();
        this.form.get('reasonTTPLContent').disable();
        this.form.get('kmUpdate').enable();
        this.form.get('missKm').enable();
        this.form.get('nextLevelBD').enable();
        this.form.get('nextDateBD').enable();
        this.form.get('dateAppointment').enable();
        this.form.get('timeAppointment').enable();
        this.form.get('cvdvTTLH').enable();
        this.form.get('customerComplain').enable();
        this.form.get('customerComplainContent').disable();
      }
    });

    if (!this.form.value.checkboxContactTrue) {
      this.form.get('sellCar').disable();
      this.form.get('inconvenient').disable();
      this.form.get('transferWork').disable();
      this.form.get('notHaveTime').disable();
      this.form.get('doYourself').disable();
      this.form.get('complainPrice').disable();
      this.form.get('serviceOutWorkshop').disable();
      this.form.get('complainQuality').disable();
      this.form.get('serviceOutSupplier').disable();
      this.form.get('afterMarketNotGood').disable();
      this.form.get('goLess').disable();
      this.form.get('reasonTTPL').disable();
      this.form.get('reasonTTPLContent').disable();
      this.form.get('kmUpdate').disable();
      this.form.get('missKm').disable();
      this.form.get('nextLevelBD').disable();
      this.form.get('nextDateBD').disable();
      this.form.get('dateAppointment').disable();
      this.form.get('timeAppointment').disable();
      this.form.get('cvdvTTLH').disable();
      this.form.get('customerComplain').disable();
      this.form.get('customerComplainContent').disable();
    }

    // check box contact false

    this.form.get('checkboxContactFalse').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('checkboxContactTrue').patchValue(false);
      }
    });

    this.form.get('checkboxContactFalse').valueChanges.subscribe(val => {
      if (!val) {
        this.form.get('anotherPickUp').disable();
        this.form.get('callLater').disable();
        this.form.get('anotherPhoneNumber').disable();
        this.form.get('messageLater').disable();
        this.form.get('notCallAgain').disable();
        this.form.get('reasonCNM').disable();
        this.form.get('reasonCNM').patchValue(false);
        this.form.get('reasonCNMContent').disable();
        this.form.get('busy').disable();
        this.form.get('notPickUp').disable();
        this.form.get('wrongNumberPhone').disable();
        this.form.get('cantContact').disable();
        this.form.get('reasonKNM').disable();
        this.form.get('reasonKNM').patchValue(false);
        this.form.get('reasonKNMContent').disable();
      }
    });

    this.form.get('checkboxContactFalse').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('anotherPickUp').enable();
        this.form.get('callLater').enable();
        this.form.get('anotherPhoneNumber').enable();
        this.form.get('messageLater').enable();
        this.form.get('notCallAgain').enable();
        this.form.get('reasonCNM').enable();
        this.form.get('reasonCNMContent').disable();
        this.form.get('busy').enable();
        this.form.get('notPickUp').enable();
        this.form.get('wrongNumberPhone').enable();
        this.form.get('cantContact').enable();
        this.form.get('reasonKNM').enable();
        this.form.get('reasonKNMContent').disable();
      }
    });

    if (!this.form.value.checkboxContactFalse) {
      this.form.get('anotherPickUp').disable();
      this.form.get('callLater').disable();
      this.form.get('anotherPhoneNumber').disable();
      this.form.get('messageLater').disable();
      this.form.get('notCallAgain').disable();
      this.form.get('reasonCNM').disable();
      this.form.get('reasonCNMContent').disable();
      this.form.get('busy').disable();
      this.form.get('notPickUp').disable();
      this.form.get('wrongNumberPhone').disable();
      this.form.get('cantContact').disable();
      this.form.get('reasonKNM').disable();
      this.form.get('reasonKNMContent').disable();
    }
  }

  private checkboxInCBContact() {
    // Liên hệ thành công

    this.form.get('reasonTTPL').valueChanges.subscribe(val => {
      if (!val) {
        this.form.get('reasonTTPLContent').disable();
      }
    });

    this.form.get('reasonTTPL').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('reasonTTPLContent').enable();
      }
    });

    this.form.get('customerComplain').valueChanges.subscribe(val => {
      if (!val) {
        this.form.get('customerComplainContent').disable();
      }
    });

    this.form.get('customerComplain').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('customerComplainContent').enable();
      }
    });


    // Liên hệ không thành công

    this.form.get('reasonCNM').valueChanges.subscribe(val => {
      if (!val) {
        this.form.get('reasonCNMContent').disable();
      }
    });

    this.form.get('reasonCNM').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('reasonCNMContent').enable();
      }
    });

    this.form.get('reasonKNM').valueChanges.subscribe(val => {
      if (!val) {
        this.form.get('reasonKNMContent').disable();
      }
    });

    this.form.get('reasonKNM').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('reasonKNMContent').enable();
      }
    });
  }
}
