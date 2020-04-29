import { Component, OnInit, ViewChild } from '@angular/core';
import { CarFamilyModel } from '../../../core/models/catalog-declaration/car-family.model';
import { ModelCarModel } from '../../../core/models/catalog-declaration/model-car.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CarFamilyApi } from '../../../api/common-api/car-family.api';
import { CarModelApi } from '../../../api/common-api/car-model.api';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { CarFamilyTypes } from '../../../core/constains/car-type';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'model-declaration',
  templateUrl: './model-declaration.component.html',
  styleUrls: ['./model-declaration.component.scss']
})
export class ModelDeclarationComponent implements OnInit {
  @ViewChild('carFamModify', { static: false }) carFamModify;
  @ViewChild('carModelModify', { static: false }) carModelModify;
  carFamGrid;
  carFamParams;
  carFamSelected: CarFamilyModel;
  modelGrid;
  modelParams;
  modelSelected: ModelCarModel;
  carTypes = CarFamilyTypes;
  form: FormGroup;
  currentDlrId;

  constructor(
    private loading: LoadingService,
    private swalAlert: ToastService,
    private dataFormatService: DataFormatService,
    private carFamilyApi: CarFamilyApi,
    private carModelApi: CarModelApi,
    private confirm: ConfirmService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.carFamGrid = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      { headerName: 'Mã dòng xe', headerTooltip: 'Mã dòng xe', field: 'cfCode' },
      { headerName: 'Tên dòng xe', headerTooltip: 'Tên dòng xe', field: 'cfName' },
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'cfType',
        valueFormatter: params => {
          const matchVal = this.carTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        },
      },
    ];
    this.modelGrid = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      { headerName: 'Mã kiểu xe', headerTooltip: 'Mã kiểu xe', field: 'cmCode' },
      { headerName: 'Tên kiểu xe', headerTooltip: 'Tên kiểu xe', field: 'cmName' },
      { headerName: 'Fullmodel', headerTooltip: 'Fullmodel', field: 'doixe' },
      {
        headerName: 'Năm',
        headerTooltip: 'Năm',
        field: 'cmYear',
        tooltip: params => this.dataFormatService.parseTimestampToYear(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToYear(params.value)
      },
    ];
    this.buildForm();
    this.currentDlrId = JSON.parse(localStorage.getItem('TMSS_Service_Current_User')).dealerId;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      cfCode: undefined,
      cmCode: undefined
    })
  }

  callbackCarFam(params) {
    this.carFamParams = params;    
  }

  getCarFamParams() {
    const selected = this.carFamParams.api.getSelectedRows();
    if (selected) {
      this.carFamSelected = selected[0];
      this.refreshCarModel();
    }
  }

  updateCarFam() {
    this.carFamSelected
      ? this.carFamModify.open(this.carFamSelected)
      : this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteCarFam() {
    this.carFamSelected
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loading.setDisplay(true);
        this.carFamilyApi.remove(this.carFamSelected.id).subscribe(() => {
          this.loading.setDisplay(false);
          this.refreshCarFamily();
          this.swalAlert.openSuccessToast();
        });
      })
      : this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  refreshCarFamily() {
    this.carFamParams.api.setRowData();
    this.modelParams.api.setRowData();
    this.carFamSelected = undefined;
    this.modelSelected = undefined;
    this.getCarFam();
  }

  refreshCarModel() {
    this.modelParams.api.setRowData();
    this.modelSelected = undefined;
    this.getModelByCarFam();
  }

  addCarModel() {
    this.carFamSelected
      ? this.carModelModify.open(this.carFamSelected)
      : this.swalAlert.openWarningToast('Bạn phải chọn dòng xe');
  }

  updateCarModel() {
    this.modelSelected
      ? this.carModelModify.open(this.carFamSelected, this.modelSelected)
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
  }

  deleteCarModel() {
    this.modelSelected
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loading.setDisplay(true);
        this.carModelApi.remove(this.modelSelected.id).subscribe(() => {
          this.loading.setDisplay(false);
          this.refreshCarModel();
          this.swalAlert.openSuccessToast();
        });
      })
      : this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  callbackModel(params) {
    this.modelParams = params;
  }

  getModelParams() {
    const selected = this.modelParams.api.getSelectedRows();
    if (selected) {
      this.modelSelected = selected[0];
    }
  }

  private getCarFam() {
    this.carFamParams.api.setRowData();
    this.loading.setDisplay(true);
    const searchDTO = Object.assign({}, this.form.getRawValue());
    this.carFamilyApi.search(searchDTO).subscribe(carFams => {
      this.carFamParams.api.setRowData(carFams);
      this.loading.setDisplay(false);
      if (this.carFamParams.api.getDisplayedRowCount() > 0) {
        this.carFamParams.api.getDisplayedRowAtIndex(0).setSelected(true);
      }
    });
  }

  private getModelByCarFam() {
    this.modelParams.api.setRowData();
    this.loading.setDisplay(true);
    this.carModelApi.getCarModelByCFAndCmCode(this.carFamSelected.id, this.form.getRawValue().cmCode).subscribe(carFam => {
      this.modelParams.api.setRowData(carFam);
      this.loading.setDisplay(false);
    });
  }
}
