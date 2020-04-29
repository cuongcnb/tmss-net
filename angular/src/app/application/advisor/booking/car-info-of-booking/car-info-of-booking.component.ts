import { Component, Input, OnChanges, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VehicleColorApi } from '../../../../api/vehicle-color/vehicle-color.api';
import { EngineTypeApi } from '../../../../api/engine-type/engine-type.api';
import { CarFamilyTypes, PI } from '../../../../core/constains/car-type';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { CarModelApi } from '../../../../api/common-api/car-model.api';
import { CarFamilyApi } from '../../../../api/common-api/car-family.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-info-of-booking',
  templateUrl: './car-info-of-booking.component.html',
  styleUrls: ['./car-info-of-booking.component.scss'],
})
export class CarInfoOfBookingComponent implements OnChanges, OnInit {
  @ViewChild('submitBtn', { static: false }) submitBtn;
  @ViewChild('cmInfoModal', {static: false}) cmInfoModal;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;

  fieldGridColor;
  fieldGridEngine;
  fieldGridCm;
  carFamilyTypes = CarFamilyTypes;
  carModelList;
  cfList;

  constructor(
    private vehicleColorApi: VehicleColorApi,
    private engineTypeApi: EngineTypeApi,
    private loadingService: LoadingService,
    private carModelApi: CarModelApi,
    private carFamilyApi: CarFamilyApi
  ) {
    this.fieldGridCm = [
      {headerName: 'Mã model', headerTooltip: 'Mã model', field: 'cmCode'},
      {headerName: 'Tên model', headerTooltip: 'Tên model', field: 'cmName'},
      {headerName: 'Năm', headerTooltip: 'Năm', field: 'cmYear'},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'}
    ];
    this.fieldGridColor = [
      { headerName: 'Mã màu', headerTooltip: 'Mã màu', field: 'vcCode' },
      { headerName: 'Tên màu', headerTooltip: 'Tên màu', field: 'vcName' }
    ];
    this.fieldGridEngine = [
      {headerName: 'Loại máy', headerTooltip: 'Loại máy', field: 'engineCode'},
      {headerName: 'Tên máy', headerTooltip: 'Tên máy', field: 'engineName'}
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngOnInit() {
    this.checkForm();
  }

  ngAfterViewInit(): void {
    this.form.get('cfType').valueChanges
      .subscribe(val => {
        const field = ['doixe', 'cmCode'];
        field.forEach(it => this.form.get(it).disable());
      });
  }

  getVehicleColor(val?, paginationParams?) {
    return this.vehicleColorApi.getAllColorByDlr(val, paginationParams);
  }

  getEngineType(val?, paginationParams?) {
    return this.engineTypeApi.getAllEngineByDlr(val, paginationParams);
  }

  
  patchColorValue(val) {
    this.form.patchValue({
      vcId: val.id,
      vccode: val.vcCode
    });
  }

  patchEngineValue(val) {
    this.form.patchValue({
      enginetypeId: val.id,
      enginecode: val.engineCode
    });
  }

  patchCmValue(val) {
    this.form.patchValue({
      cmId: val.id,
      doixe: val.doixe,
      cmCode: val.cmCode,
      cmType: val.cmType
    });
  }

  changeSelectCfType() {
    const field = ['cfId', 'doixe', 'cmCode'];
    field.forEach(it => this.form.get(it).setValue(null));
  }

  cancelSelectCmInfo() {
    const field = ['doixe', 'cmCode'];
    field.forEach(it => this.form.get(it).setValue(null));
  }

  selectCarModel() {
    this.loadingService.setDisplay(true);
    const cfId = this.form.getRawValue().cfId;
    if (cfId || cfId === 0) {
      this.carModelApi.getCarModelByCarFam(cfId).subscribe(val => {
        this.loadingService.setDisplay(false);
        this.carModelList = val;
        this.cmInfoModal.open(null, this.carModelList);
      });
    }
  }

  private checkForm() {
    if (this.form.value.cfType || this.form.value.cfType === 0) {
      this.carFamilyApi.getByCFType(this.form.value.cfType).subscribe(cfList => {
        this.cfList = cfList || [];
      });
    } else {
      this.cfList = [];
    }
    this.form.get('cfType').valueChanges.subscribe(type => {
      if (type || type === 0) {
        this.carFamilyApi.getByCFType(type).subscribe(cfList => {
          this.cfList = cfList || [];
        });
      } else {
        this.cfList = [];
      }
    });
  }

}
