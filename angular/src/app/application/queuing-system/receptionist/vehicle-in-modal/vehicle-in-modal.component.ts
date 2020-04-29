import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {concatMap, switchMap, tap} from 'rxjs/operators';
import {iif} from 'rxjs';

import {GateInOutModel} from '../../../../core/models/queuing-system/gate-in-out.model';
import {DlrFloorModel} from '../../../../core/models/catalog-declaration/dlr-floor.model';
import {AllowIn, ShortcutEventOutput, ShortcutInput} from 'ng-keyboard-shortcuts';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {QueuingApi} from '../../../../api/queuing-system/queuing.api';
import {DlrFloorApi} from '../../../../api/master-data/catalog-declaration/dlr-floor.api';
import {DownloadService} from '../../../../shared/common-service/download.service';
import {CommonFunctionsService} from '../../common-functions.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ExistedRegisterNoModel} from '../../gate-in-out/existed-register-no-model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-in-modal',
  templateUrl: './vehicle-in-modal.component.html',
  styleUrls: ['./vehicle-in-modal.component.scss']
})
export class VehicleInModalComponent implements OnInit {

  @ViewChild('btnSubmit', {static: false}) btnSubmit;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('registerNo', {static: false}) registerNo: ElementRef;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();

  form: FormGroup;
  selectedData: GateInOutModel;
  modalHeight: number;
  floors: Array<DlrFloorModel> = [];
  countEnter: number;
  checkIsAppointment: string = null;
  private readonly registerNoMinLength: number = 6;
  private readonly registerNoMaxLength: number = 13;
  isFirstIn: boolean;
  typeFloor: string;
  keyboardShortcuts: Array<ShortcutInput> = [];

  constructor(
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private queuingApi: QueuingApi,
    private dlrFloorApi: DlrFloorApi,
    private downloadService: DownloadService,
    private commonFunctionsService: CommonFunctionsService
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  ngOnInit() {
    this.onResize();
    this.countEnter = 0;
    this.typeFloor = '1';
    this.keyboardShortcuts = [
      {
        key: ['ctrl + s', 'ctrl + S'],
        label: 'Bảo vệ',
        description: 'Lưu thông tin xe',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e: ShortcutEventOutput) => this.save(),
        preventDefault: true
      },
      {
        key: ['ctrl + p', 'ctrl + P'],
        label: 'Bảo vệ',
        description: 'In thông tin xe',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e: ShortcutEventOutput) => this.print(),
        preventDefault: true
      }
    ];
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    // this.typeFloor = selectedData.isBp === 'Y' ? '2' : '1';
    this.getFloors();
  }

  getFloors() {
    this.dlrFloorApi.getByCurrentDealer().subscribe(floors => {
      if (!floors.length) {
        this.swalAlertService.openWarningToast('Không có danh sách các tầng.', 'Thông báo.');
        this.modal.hide();
        return;
      }

      this.floors = floors;
      this.onResize();
      this.modal.show();
      this.buildForm();
    });
  }

  reset() {
    this.form = undefined;
    this.isFirstIn = false;
  }

  verifyRegisterNo(f: FormGroup) {
    const control = f.get('registerNo');
    control.setValue(control.value.split(/[^A-Za-z0-9]/).join('').toUpperCase());
  }


  resetForm() {
    this.buildForm();
    this.registerNo.nativeElement.focus();
    this.isFirstIn = false;
    this.form.get('registerNo').setErrors(null);
    this.checkIsAppointment = null;
  }

  handleForm() {
    if (this.form.invalid) {
      this.isFirstIn = false;
      this.loadingService.setDisplay(false);
      return;
    }
    const value = Object.assign({}, this.selectedData || {}, this.form.value, {
      customerName: this.form.value.customerName,
      isService: this.form.value.haveService ? 'Y' : 'N',
      isBp: this.form.value.isBp ? 'Y' : 'N',
      isGj: this.form.value.isGj ? 'Y' : 'N',
      isMa: this.form.value.isMa ? 'Y' : 'N',
      is1K: this.form.value.is1K ? 'Y' : 'N',
      isFirstIn: this.isFirstIn ? 'Y' : 'N',
      registerNo: this.form.value.registerNo.toUpperCase()
    });

    return !!this.selectedData ? this.queuingApi.update(value) : this.queuingApi.createNew(value, 'N');
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.handleForm()
      .subscribe((data: any) => {
        this.loadingService.setDisplay(false);
        this.close.emit();
        this.swalAlertService.openSuccessToast();
        !!this.selectedData
          ? this.form.patchValue({
            registerNo: data.registerNo,
            floorId: data.floorId,
            isBp: data.isBp === 'Y',
            isGj: data.isGj === 'Y',
            isMa: data.isMa === 'Y',
            is1K: data.is1K === 'Y',
            haveService: data.isService === 'Y',
            noService: data.isService !== 'Y',
            customerName: data.customerName
          })
          : this.resetForm();
        this.closeModal();
      });
  }

  private buildForm() {
    this.checkIsAppointment = null;
    const value = this.selectedData || {} as GateInOutModel;
    this.isFirstIn = value.isFirstIn === 'Y';
    this.checkIsAppointment = value.isAppointment ? value.isAppointment : '';
    this.typeFloor = value.isBp === 'Y' ? '2' : '1';
    this.form = this.formBuilder.group({
      registerNo: [
        value.registerNo,
        Validators.compose([
          GlobalValidator.required,
          GlobalValidator.minLength(this.registerNoMinLength),
          GlobalValidator.maxLength(this.registerNoMaxLength)
          // GlobalValidator.registerNo,
        ])
      ],
      floorId: [{value: !value.floorId ? this.floors[0].id : value.floorId, disabled: value.isService === 'N'}, GlobalValidator.required],
      isBp: [{value: value.isBp === 'Y', disabled: value.isService === 'N'}],
      isGj: [{value: value.isGj === 'Y', disabled: value.isService === 'N'}],
      isMa: [{value: value.isMa === 'Y', disabled: value.isService === 'N'}],
      is1K: [{value: value.is1K === 'Y', disabled: value.isService === 'N'}],

      haveService: [value.isService === 'Y'],
      noService: [value.isService === 'N'],
      customerName: [value.customerName]
    }, {
      validator: [
        GlobalValidator.bothFieldFalse('haveService', 'noService')
      ]
    });
    this.setFloorValue(this.typeFloor);

    this.form.get('registerNo').valueChanges
      .pipe(
        tap(txt => {
          if (txt.length < this.registerNoMinLength) {
            this.isFirstIn = false;
            this.checkIsAppointment = null;
          }
        }),
        switchMap(txt => iif(
          () => txt.length >= this.registerNoMinLength,
          this.queuingApi.checkRegisterNoExist(this.commonFunctionsService.tranformRegisterNo(txt))
        ))
      ).subscribe((registerNo: ExistedRegisterNoModel) => {
      this.isFirstIn = !!registerNo && !registerNo.existed;
      this.checkIsAppointment = registerNo.isAppointment;
    });

    if (!this.selectedData) {
      // this.form.get('isGj').patchValue(true);
      this.form.get('haveService').patchValue(true);
    }

    const fields = ['isBp', 'isGj', 'isMa', 'is1K', 'floorId'];
    // fields.forEach(field => this.form.get(field).disable());
    this.form.get('noService').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({
          haveService: false,
          isBp: undefined,
          isGj: undefined,
          isMa: undefined,
          is1K: undefined
        });
        fields.forEach(field => this.form.get(field).disable());
      }
    });
    // Xử lý chọn công việc sẽ load tầng tương ứng
    (this.form.get('isMa').valueChanges && this.form.get('isGj')).valueChanges.subscribe(val => {
      if (val) {
        this.typeFloor = '1';
        this.setFloorValue(this.typeFloor);
      }
    });
    this.form.get('isMa').valueChanges.subscribe(val => {
      if (val) {
        this.typeFloor = '1';
        this.setFloorValue(this.typeFloor);
      }
    });
    if (this.form.get('isGj').value) {
      this.typeFloor = '1';
      this.setFloorValue(this.typeFloor);
    }
    this.form.get('isBp').valueChanges.subscribe(val => {
      if (val && !this.form.get('isMa').value && !this.form.get('isGj').value) {
        this.typeFloor = '2';
        this.setFloorValue(this.typeFloor);
      } else {
        this.typeFloor = '1';
        this.setFloorValue(this.typeFloor);
      }
    });

    this.form.get('haveService').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({noService: false});
        fields.forEach(field => this.form.get(field).enable());
      } else {
        fields.forEach(field => this.form.get(field).disable());
      }
    });

    if (this.selectedData) {
      const obj = this.commonFunctionsService.getTypeByCarJobs(this.selectedData);
      this.form.patchValue(obj);
    }
  }

  setFloorValue(type: string) {
    if (!!type) {
      const foundFloor = this.floors.find(floor => floor.type === type);
      this.form.patchValue({floorId: foundFloor ? foundFloor.id : this.floors.length > 0 ? this.floors[0].id : null});
    }
  }

  KeyUpEnter(event: any) {
    this.form.get('registerNo').setValue(this.commonFunctionsService.tranformRegisterNo(event.target.value));
    // check xe da co trong danh sach hen chua nếu có đổ ra các thông tin đã hẹn
    this.queuingApi.checkRegisterNoExist(this.form.get('registerNo').value).subscribe((data: any) => {
      if (!!data && data.isAppointment === 'Y') {
        this.checkIsAppointment = data.isAppointment;
        this.form.patchValue({
          haveService: true,
          isBp: data.isBp === 'Y',
          isGj: data.isGj === 'Y',
          isMa: data.isMa === 'Y',
          customerName: !!data.customerName ? data.customerName : ''
        });
      } else {
        this.form.patchValue({haveService: true, isGj: true});
      }
      // check để load công việc và tầng tương ứng
      if (this.form.get('isMa').value || this.form.get('isGj').value || this.form.get('isBp').value) {
        this.typeFloor = '1';
        this.setFloorValue(this.typeFloor);
      }
      if (this.form.get('isBp').value && !this.form.get('isMa').value && !this.form.get('isGj').value) {
        this.typeFloor = '2';
        this.setFloorValue(this.typeFloor);
      } else {
        this.typeFloor = '1';
        this.setFloorValue(this.typeFloor);
      }
    });
  }

  print() {
    this.loadingService.setDisplay(true);
    this.handleForm()
      .pipe(
        concatMap(data => this.queuingApi.printGateInOut(data.id))
      )
      .subscribe(res => {
        this.swalAlertService.openSuccessToast();
        this.loadingService.setDisplay(false);
        this.downloadService.downloadFile(res);
        this.close.emit();
      });
  }

  closeModal() {
    this.modal.hide();
    this.resetForm();
    this.form = undefined;
  }

}
