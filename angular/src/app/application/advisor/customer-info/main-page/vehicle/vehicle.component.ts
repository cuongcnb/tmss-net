import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CustomerApi} from '../../../../../api/customer/customer.api';
import {EngineTypeApi} from '../../../../../api/engine-type/engine-type.api';
import {VehicleColorApi} from '../../../../../api/vehicle-color/vehicle-color.api';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {CarFamilyTypes, PI} from '../../../../../core/constains/car-type';
import {CarFamilyApi} from '../../../../../api/common-api/car-family.api';
import {CarModelApi} from '../../../../../api/common-api/car-model.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements AfterViewInit, OnChanges, OnInit {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @ViewChild('cmInfoModal', {static: false}) cmInfoModal;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  cfList: Array<any> = [];
  carFamilyTypes = CarFamilyTypes;
  pi = PI;
  carModelList;
  // search
  fieldGridCm;
  fieldGridEngine;
  fieldGridColor;

  constructor(private engineTypeApi: EngineTypeApi,
              private customerApi: CustomerApi,
              private carFamilyApi: CarFamilyApi,
              private carModelApi: CarModelApi,
              private vehicleColorApi: VehicleColorApi,
              private loadingService: LoadingService) {
    this.fieldGridCm = [
      {headerName: 'Mã model', headerTooltip: 'Mã model', field: 'cmCode'},
      {headerName: 'Tên model', headerTooltip: 'Tên model', field: 'cmName'},
      {headerName: 'Năm', headerTooltip: 'Năm', field: 'cmYear'},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'}
    ];
    this.fieldGridEngine = [
      {headerName: 'Loại máy', headerTooltip: 'Loại máy', field: 'engineCode'},
      {headerName: 'Tên máy', headerTooltip: 'Tên máy', field: 'engineName'}
    ];
    this.fieldGridColor = [
      {headerName: 'Mã màu', headerTooltip: 'Mã màu', field: 'vcCode'},
      {headerName: 'Tên màu', headerTooltip: 'Tên màu', field: 'vcName'}
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
        const field = ['doixe', 'cmCode', 'fullmodel'];
        if (val === 0) {
          field.forEach(it => this.form.get(it).enable());
          this.form.get('ckd').patchValue(undefined);
          this.form.get('ckd').disable();
          return;
        }
        field.forEach(it => this.form.get(it).disable());
        this.form.get('ckd').enable();
        this.form.get('cmCode').disable();
      });
  }

  getVehicleColor(val?, paginationParams?) {
    return this.vehicleColorApi.getAllColorByDlr(val, paginationParams);
  }

  getEngineType(val?, paginationParams?) {
    return this.engineTypeApi.getAllEngineByDlr(val, paginationParams);
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

  patchCmValue(val) {
    this.form.patchValue({
      cmId: val.id,
      doixe: val.doixe,
      cmCode: val.cmCode,
      cmType: val.cmType,
      fullmodel: val.doixe
    });
  }

  patchEngineValue(val) {
    this.form.patchValue({
      enginetypeId: val.id,
      enginecode: val.engineCode
    });
  }

  patchColorValue(val) {
    this.form.patchValue({
      vcId: val.id,
      vccode: val.vcCode
    });
  }

  changeSelectCfType() {
    const field = ['cfId', 'doixe', 'cmCode', 'fullmodel'];
    field.forEach(it => this.form.get(it).setValue(null));
  }

  cancelSelectCmInfo() {
    const field = ['doixe', 'cmCode', 'fullmodel'];
    field.forEach(it => this.form.get(it).setValue(null));
  }

  private checkForm() {
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
