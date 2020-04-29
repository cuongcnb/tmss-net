import { Component, OnInit } from '@angular/core';
import { CarFamilyApi } from '../../../api/common-api/car-family.api';
import { CarFamilyTypes } from '../../../core/constains/car-type';
import { LoadingService } from '../../../shared/loading/loading.service';
import { CarModelApi } from '../../../api/common-api/car-model.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CarFamilyModel } from '../../../core/models/catalog-declaration/car-family.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModelCarModel } from '../../../core/models/catalog-declaration/model-car.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'storage-job-package',
  templateUrl: './storage-job-package.component.html',
  styleUrls: ['./storage-job-package.component.scss']
})
export class StorageJobPackageComponent implements OnInit {

  form: FormGroup;
  carFamField;
  carFamList: Array<CarFamilyModel>;
  carModelField;
  carModelList: Array<ModelCarModel>;
  carTypes = CarFamilyTypes;

  repairJobField;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private loading: LoadingService,
    private carFamilyApi: CarFamilyApi,
    private carModelApi: CarModelApi,
  ) {
  }

  ngOnInit() {
    this.carFamField = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'cfCode'},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'cfName'},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'cfType',
        valueFormatter: params => {
          const matchVal = this.carTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      }
    ];
    this.carModelField = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'cmCode', width: 100},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'cmName', width: 100},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'},
    ];
    this.repairJobField = [
      {headerName: 'Mã  CV', headerTooltip: 'Mã  CV', field: 'rccode'},
      {headerName: 'Tên  CV', headerTooltip: 'Tên  CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'},
    ];
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      carFamId: [undefined],
      carModelId: [undefined],
    });
    this.getCarFamByType();
    this.form.get('carFamId').valueChanges.subscribe(val => {
      this.form.patchValue({carModelId: undefined});
      this.carModelList = undefined;
      if (val || val === 0) {
        this.getCarModelByFam(val);
      }
    });
  }

  // Chọn công việc
  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamList = carFams || [];
      this.form.patchValue({carFamId: carFams[0] ? carFams[0].id : undefined});
      this.loading.setDisplay(false);
    });
  }

  private getCarModelByFam(famId) {
    this.loading.setDisplay(true);
    this.carModelApi.getCarModelByCarFam(famId).subscribe(carModel => {
      this.carModelList = carModel || [];
      this.form.patchValue({carModelId: carModel[0] ? carModel[0].id : undefined});
      this.loading.setDisplay(false);
    });
  }

}
