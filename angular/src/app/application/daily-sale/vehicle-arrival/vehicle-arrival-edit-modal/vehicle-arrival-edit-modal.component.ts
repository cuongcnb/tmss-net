import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isEqual} from 'lodash';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GradeListService} from '../../../../api/master-data/grade-list.service';
import {DealerAddressDeliveryService} from '../../../../api/master-data/dealer-address-delivery.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {VehicleArrivalDatepicker} from '../../../../core/constains/daily-sale-vehicle-arrival-datepicker';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {VehicleArrivalService} from '../../../../api/daily-sale/vehicle-arrival.service';
import {ColorAssignmentService} from '../../../../api/master-data/color-assignment.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-arrival-edit-modal',
  templateUrl: './vehicle-arrival-edit-modal.component.html',
  styleUrls: ['./vehicle-arrival-edit-modal.component.scss']
})
export class VehicleArrivalEditModalComponent implements OnInit {
  @ViewChild('vehicleArrivalDatePickerModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  fieldName: string;
  headerName: string;
  selectedVehicleArrival;
  colorList;
  selectedGrade;
  deliveryAtArr = [];
  currentUser;
  vehicleArrivalDatepicker = VehicleArrivalDatepicker;
  month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  selfDrivingTripRequestArr = [
    {id: 0, value: ''},
    {id: 1, value: '1'},
    {id: 2, value: '2'},
    {id: 3, value: '3'},
    {id: 4, value: '4'},
    {id: 5, value: '5'},
    {id: 6, value: '6'},
    {id: 7, value: '7'},
    {id: 8, value: '8'},
    {id: 9, value: '9'},
    {id: 10, value: '10'},
    {id: 11, value: '11'},
    {id: 12, value: '12'},
    {id: 13, value: '13'},
    {id: 14, value: '14'},
    {id: 15, value: '15'},
    {id: 16, value: '16'},
    {id: 17, value: '17'},
    {id: 18, value: '18'},
    {id: 19, value: '19'},
    {id: 20, value: '20'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private gradeListService: GradeListService,
    private dealerAddressDeliveryService: DealerAddressDeliveryService,
    private formStoringService: FormStoringService,
    private vehicleArrivalService: VehicleArrivalService,
    private colorAssignmentService: ColorAssignmentService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  open(selectedVehicleArrival, fieldName: string, headerName: string) {
    this.selectedVehicleArrival = selectedVehicleArrival;
    this.fieldName = fieldName;
    this.headerName = headerName;
    if (this.fieldName === 'dealerRequestColor') {
      this.selectedVehicleArrival.gradeProductId ? this.getGradeProductColor() : this.getGradeColors();
    }
    if (this.fieldName === VehicleArrivalDatepicker.dlrDeliveryAt.fieldName) {
      this.checkChooseDeliveryAt();
      this.getDeliveryAddress();
    }
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  getGradeColors() {
    this.loadingService.setDisplay(true);
    this.gradeListService.getGrades().subscribe(gradeList => {
      this.selectedGrade = gradeList.find(grade => grade.marketingCode === this.selectedVehicleArrival.grade);
      this.gradeListService.getGradeColor(this.selectedGrade.id, true).subscribe(colorList => {
        this.colorList = colorList;
        this.loadingService.setDisplay(false);
      });
    });
  }

  getGradeProductColor() {
    this.loadingService.setDisplay(true);
    this.colorAssignmentService.getColors(this.selectedVehicleArrival.gradeProductId, true).subscribe(colorList => {
      this.colorList = colorList;
      this.loadingService.setDisplay(false);
    });
  }

  getDeliveryAddress() {
    this.loadingService.setDisplay(true);
    this.dealerAddressDeliveryService.getAvailableList(this.currentUser.dealerId).subscribe(deliveryAtArr => {
      this.deliveryAtArr = deliveryAtArr;
      this.loadingService.setDisplay(false);
    });
  }

  checkChooseDeliveryAt() {
    this.loadingService.setDisplay(true);
    this.vehicleArrivalService.checkChooseDeliveryAt(this.selectedVehicleArrival.id).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.show();
    }, err => {
      this.loadingService.setDisplay(false);
      if (err) {
        this.swalAlertService.openFailModal(err.error);
      }
      this.modal.show();
    });
  }

  delete() {
    this.form.get('date').setValue(null);
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    let val;
    if (isEqual(Object.values(this.form.value)[0], new Date(this.selectedVehicleArrival[this.fieldName]))) {
      this.swalAlertService.openFailModal('Your input is not changed. If you do not want to change value, click "Cancel"', 'Same Input');
      return;
    }
    const rowData = this.selectedVehicleArrival;
    if (this.fieldName.indexOf('Date') >= 0) {
      val = Object.values(this.form.value)[0];
    } else if (this.fieldName.indexOf('Time') >= 0) {
      if (!this.form.value.hours && !this.form.value.minutes) {
        val = undefined;
      } else {
        val = this.form.value.hours * 3600 + this.form.value.minutes * 60;
      }
    } else {
      val = Object.values(this.form.value)[0];
    }

    // VALIDATE INVOICE REQUEST DATE
    // if (this.fieldName === VehicleArrivalDatepicker.invoiceRequestDate.fieldName) {
    //   const invoiceRequestDateArr = val.split('-');
    //   const invoiceMonth = invoiceRequestDateArr[1];
    //   const invoiceYear = invoiceRequestDateArr[2];
    //
    //   const assAlloDateArr = this.selectedVehicleArrival.assAlloMonth.split('-');
    //   const alloMonth = assAlloDateArr[1];
    //   const alloYear = assAlloDateArr[2];
    //
    //   // Invoice Request Date > Allo Month
    //   const firstDayAlloMonth = new FirefoxDate('01'.concat(`-${alloMonth}-${alloYear}`)).getTime();
    //   const lastDayAlloMonth = new Date(2018, this.month.indexOf(alloMonth) + 1, 0).getTime();
    //   const invoiceRequestMonth = new FirefoxDate('01'.concat(`-${invoiceMonth}-${invoiceYear}`)).getTime();
    //   if ((lastDayAlloMonth < invoiceRequestMonth) || (firstDayAlloMonth > invoiceRequestMonth)) {
    //     this.swalAlertService.openFailModal('Tháng xuất hóa đơn phải >= Ngày đầu tháng allocation month và  Tháng xuất hóa đơn phải =< Ngày cuối tháng allocation month');
    //     return;
    //   }
    //
    //   // Validate CBU/CKD & LOD/CBU_DOCUMENT_DATE
    //   if (this.selectedVehicleArrival.cbuCkd !== 'N') {
    //     if (new Date(val) < new Date(this.selectedVehicleArrival.cbuDocDelivery)) {
    //       this.swalAlertService.openFailModal('CBU Vehicle - Your input date is less than CBU Document');
    //       return;
    //     }
    //   } else {
    //     if (new Date(val) < new Date(this.selectedVehicleArrival.lineOffDate)) {
    //       this.swalAlertService.openFailModal('CKD Vehicle - Your input is less than Line Of Date');
    //       return;
    //     }
    //   }
    //
    //   // Validate - current time
    //   const halfPastTen = 10 * 3600 + 30 * 60;
    //   const currentDaySecond = (new Date().getHours()) * 3600 + (new Date()).getMinutes() * 60;
    //   if (new Date(val) < new Date()) {
    //     this.swalAlertService.openFailModal('Invoice Request Date must be greater than or equal to Today');
    //     return;
    //   }
    //   if (currentDaySecond > halfPastTen) {
    //     if (new Date(val) <= new Date()) {
    //       this.swalAlertService.openFailModal('Invoice Request Date must be greater than Today');
    //       return;
    //     }
    //   }
    // }

    if (this.fieldName === VehicleArrivalDatepicker.dealerRequestColor.fieldName) {
      rowData.dealerRequestColorId = val;
      rowData.dealerRequestColor = this.colorList.find(color => color.id === val) ? this.colorList.find(color => color.id === val).code : null;
    } else {
      rowData[this.fieldName] = val;
    }
    this.saveData(rowData, val);
  }

  saveData(rowData, val) {
    this.loadingService.setDisplay(true);
    this.vehicleArrivalService.updateVehicleArrival(rowData).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      // res.message.toLowerCase() === 'success'
      //   ? this.swalAlertService.openSuccessModal()
      //   : this.swalAlertService.openWarningModal(res.message);
      this.close.emit({value: rowData, fieldName: this.fieldName, fieldValue: val});
      this.reset();
      this.modal.hide();
    }, (err) => {
      if (err.status === 522) {
        this.confirmationService.openConfirmModal('Bản ghi đang được sử dụng', 'Bạn phải reload lại dữ liệu trước khi update. Bạn có đồng ý reload lại dữ liệu không?')
          .subscribe(() => {
            this.modal.hide();
            this.close.emit();
          }, () => {
          });
      }
    });
  }

  private buildForm() {
    let fieldValue;
    let minutes;
    const selfDrivingTripRequest = this.selectedVehicleArrival.selfDrivingTripRequest;
    const dlrRemark = this.selectedVehicleArrival.dlrRemark;
    const documentArrivalRemark = this.selectedVehicleArrival.documentArrivalRemark;
    if (this.fieldName.indexOf('Date') >= 0) {
      fieldValue = this.selectedVehicleArrival[this.fieldName];
    } else if (this.fieldName.indexOf('Time') >= 0) {
      fieldValue = Math.floor(this.selectedVehicleArrival[this.fieldName] / 3600);
      minutes = Math.floor((this.selectedVehicleArrival[this.fieldName] % 3600) / 60);
    } else {
      if (this.fieldName === VehicleArrivalDatepicker.dealerRequestColor.fieldName) {
        fieldValue = this.selectedVehicleArrival.dealerRequestColorId;
      } else {
        fieldValue = this.selectedVehicleArrival[this.fieldName];
      }
    }
    const dlrDeliveryAtId = this.selectedVehicleArrival.dlrDeliveryAtId;
    this.form = this.formBuilder.group({
      date: [{value: fieldValue, disabled: this.fieldName.indexOf('Date') < 0}],
      hours: [{
        value: fieldValue,
        disabled: this.fieldName.indexOf('Time') < 0
      }, Validators.compose([GlobalValidator.numberFormat, Validators.max(23)])],
      minutes: [{
        value: minutes,
        disabled: this.fieldName.indexOf('Time') < 0
      }, Validators.compose([GlobalValidator.numberFormat, Validators.max(59)])],

      colorRequest: [{
        value: fieldValue,
        disabled: this.fieldName !== VehicleArrivalDatepicker.dealerRequestColor.fieldName
      }],
      paymentBy: [{value: fieldValue, disabled: this.fieldName !== VehicleArrivalDatepicker.paymentBy.fieldName}],
      dlrDeliveryAt: [{
        value: dlrDeliveryAtId,
        disabled: this.fieldName !== VehicleArrivalDatepicker.dlrDeliveryAt.fieldName
      }],
      selfDrivingTripRequest: [{
        value: selfDrivingTripRequest,
        disabled: this.fieldName !== VehicleArrivalDatepicker.selfDrivingTripRequest.fieldName
      }],
      dlrRemark: [{value: dlrRemark, disabled: this.fieldName !== VehicleArrivalDatepicker.dlrRemark.fieldName}],
      documentArrivalRemark: [{
        value: documentArrivalRemark,
        disabled: this.fieldName !== VehicleArrivalDatepicker.documentArrivalRemark.fieldName
      }]
    });

    if (this.form.get('paymentBy')) {
      this.form.get('paymentBy').valueChanges.subscribe(val => {
        if (val === 'TFS') {
          this.vehicleArrivalService.paymentTypeTFS(this.selectedVehicleArrival.id).subscribe(amount => {
            this.selectedVehicleArrival.tfsAmount = amount;
          });
        } else {
          this.selectedVehicleArrival.tfsAmount = null;
        }
      });
    }
  }

}
