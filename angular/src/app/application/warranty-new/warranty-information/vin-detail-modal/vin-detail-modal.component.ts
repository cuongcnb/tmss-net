import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { VehicleInfoApi } from '../../../../api/warranty/vehicle-info.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ProvinceApi } from '../../../../api/sales-api/province/province.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vin-detail-modal',
  templateUrl: './vin-detail-modal.component.html',
  styleUrls: ['./vin-detail-modal.component.scss'],
})
export class VinDetailModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  selectedVin;
  vinForm;
  modalHeight;
  provincesList;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private vehicleInfoApi: VehicleInfoApi,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private provinceApi: ProvinceApi
  ) {
  }

  ngOnInit() {
    this.getProvinces();
  }

  open(selectedVin?) {
    this.selectedVin = selectedVin;
    this.buildForm();
    this.modal.show();

  }

  reset() {
    this.vinForm = null;
    this.selectedVin = null;
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getProvinces() {
    this.loadingService.setDisplay(true);
    this.provinceApi.getAllAvailableProvinceOrder().subscribe(provinces => {
      this.provincesList = provinces || [];
      this.loadingService.setDisplay(false);
    });
  }

  compareSalesdate() {
    return (control: FormControl) => {
      const group = control.parent;
      if (!group) {
        return null;
      }
      const salesdate = group.get('salesdate');

      if (control && control.value && salesdate && salesdate.value && control.value < salesdate.value) {
        return { notLessSalesdate: true };
      }
      return null;
    };
  }

  save() {
    if (this.vinForm.invalid) {
      return;
    }
    let dataUpdate: object;
    let message: string;
    if (this.selectedVin) {
      dataUpdate = Object.assign({}, this.selectedVin, this.vinForm.getRawValue());
      message = 'Cập nhật thông tin thành công';
    } else {
      dataUpdate = this.vinForm.getRawValue();
      message = 'Tạo mới thông tin thành công';
    }

    this.loadingService.setDisplay(true);
    this.vehicleInfoApi.updateVehicleInfo(dataUpdate).subscribe((val) => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast(message);
      this.close.emit(val);
      this.modal.hide();
    });
  }

  private buildForm() {
    if (this.selectedVin) {
      this.vinForm = this.formBuilder.group({
        vin: [{ value: undefined, disabled: true }],
        dealercode: [{ value: undefined, disabled: true }],
        color: [{ value: undefined, disabled: true }],
        engine: [{ value: undefined, disabled: true }],
        lineoffdate: [{ value: undefined, disabled: true }],
        deliverdate: [undefined, this.compareSalesdate()],
        salesdate: [{ value: undefined, disabled: true }],
        pdsdate: [{ value: undefined, disabled: true }],
        sfx: [{ value: undefined, disabled: true }],
        vhenamecode: [{ value: undefined, disabled: true }],
        model: [{ value: undefined, disabled: true }],
        // customer info
        carOwnerName: [{ value: undefined, disabled: true }],
        carOwnerAdd: [{ value: undefined, disabled: true }],
        carOwnerTell: [{ value: undefined, disabled: true }],
        provinceName: [{ value: undefined, disabled: true }],
        districtName: [{ value: undefined, disabled: true }],
        // relation info
        relativesName: [undefined],
        relativesAddess: [undefined],
        relativesPhone: [undefined, GlobalValidator.phoneFormat],
        relativeProvince: [undefined],
        relationship: [undefined],
        updatecount: [undefined],
      });
      this.vinForm.patchValue(this.selectedVin);
    } else {
      this.vinForm = this.formBuilder.group({
        vin: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(17)])],
        dealercode: [undefined],
        color: [undefined],
        engine: [undefined],
        lineoffdate: [undefined],
        deliverdate: [undefined, this.compareSalesdate()],
        salesdate: [undefined],
        pdsdate: [undefined],
        sfx: [undefined],
        vhenamecode: [undefined],
        model: [undefined, GlobalValidator.required],
      });
    }
    // this.vinForm.get('updatecount').valueChanges.subscribe(val => {
    //   if (val && Number(val) > 1) {
    //     this.vinForm.get('deliverdate').disable()
    //   } else {
    //     this.vinForm.get('deliverdate').enable()
    //   }
    // })
  }
}
