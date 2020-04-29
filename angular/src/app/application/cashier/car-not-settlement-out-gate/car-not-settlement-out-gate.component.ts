import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CarNotSettlementOutGateApi } from '../../../api/dlr-cashier/car-not-settlement-out-gate.api';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { EmployeeCommonApi } from '../../../api/common-api/employee-common.api';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { DownloadService } from '../../../shared/common-service/download.service';
import { RoState } from '../../../core/constains/ro-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-not-settlement-out-gate',
  templateUrl: './car-not-settlement-out-gate.component.html',
  styleUrls: ['./car-not-settlement-out-gate.component.scss'],
})
export class CarNotSettlementOutGateComponent implements OnInit {
  @ViewChild('searchGuarantor', { static: false }) searchGuarantor;
  carGridField;
  carParams;
  carSelected;
  checkRequired: boolean;
  checkRequiredTextArea: string;

  guarantorGridField;

  repairOrderGridField;
  repairOrderParams;
  repairOrderList;

  searchForm: FormGroup;
  form: FormGroup;
  roState = RoState;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private downloadService: DownloadService,
    private gridTableService: GridTableService,
    private employeeCommonApi: EmployeeCommonApi,
    private carNotSettlementApi: CarNotSettlementOutGateApi,
  ) {
  }

  ngOnInit() {
    this.buildSearchForm();
    this.buildForm();
    this.checkRequired = true;
    this.checkRequiredTextArea = 'required';
    this.carGridField = [
      { headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerno' },
      { headerName: 'Số VIN/FRAME', headerTooltip: 'Số VIN/FRAME', field: 'vinno' },
    ];
    this.guarantorGridField = [
      { headerName: 'Người bảo lãnh', headerTooltip: 'Người bảo lãnh', field: 'empName' },
      { headerName: 'Mã nhân viên', headerTooltip: 'Mã nhân viên', field: 'empCode' },
      { headerName: 'Tên chức danh', headerTooltip: 'Tên chức danh', field: 'titleName' },
    ];
    this.repairOrderGridField = [
      { headerName: 'Số RO', headerTooltip: 'Số RO', field: 'repairorderno' },
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'rostate',
        valueFormatter: params => this.roState.find(state => state.id === params.value).name,
      },
      { headerName: 'Tổng giảm giá', headerTooltip: 'Tổng giảm giá', field: 'discount', cellClass: ['cell-border', 'cell-readonly', 'text-right'] },
      // backend thiếu field này
      { headerName: 'Tổng tiền chưa giảm giá', headerTooltip: 'Tổng tiền chưa giảm giá', field: 'totalWithoutDiscount', cellClass: ['cell-border', 'cell-readonly', 'text-right'] },
      { headerName: 'Người tạo RO', headerTooltip: 'Người tạo RO', field: 'empName' },
    ];
  }

  search() {
    if (this.searchForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.carNotSettlementApi.searchInOutGate(this.searchForm.value).subscribe(res => {
      this.carSelected = undefined;
      if (res) {
        this.carParams.api.setRowData(res);
        this.gridTableService.selectFirstRow(this.carParams);
      } else {
        this.carParams.api.setRowData();
      }
      this.loadingService.setDisplay(false);
    });
  }

  callbackCar(params) {
    params.api.setRowData();
    this.carParams = params;
  }

  getParamsCar() {
    const selected = this.carParams.api.getSelectedRows();
    if (selected) {
      this.carSelected = selected[0];
      this.getDetail();
    }
  }

  callbackRO(params) {
    params.api.setRowData();
    this.repairOrderParams = params;
  }

  printOutGate(params) {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      vhcId: this.carSelected.vhcId,
      registerNo: this.carSelected.registerno,
      roId: this.carSelected.id,
      extension: params.extension,
    });
    this.loadingService.setDisplay(true);
    this.carNotSettlementApi.printOutGate(value).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  // Sử dụng cho search-data-grid-modal
  getEmp() {
    this.loadingService.setDisplay(true);
    this.employeeCommonApi.getEmpByCurrentDlr().subscribe(res => {
      this.searchGuarantor.open(null, res || []);
      this.loadingService.setDisplay(false);
    });
  }

  patchGuarantor(data) {
    this.form.patchValue({
      picId: data ? data.id : undefined,
      picName: data ? data.empName : undefined,
    });
  }

  private getDetail() {
    this.repairOrderList = [];
    this.loadingService.setDisplay(true);
    this.carNotSettlementApi.getDetail(this.carSelected.vhcId).subscribe(res => {
      if (!!res && res.length) {
        // check required nếu xe vào nhưng không làm j #22794
        this.checkRequired = true;
        this.checkRequiredTextArea = 'required';
        this.form.controls.reason.setValidators([GlobalValidator.required, GlobalValidator.maxLength(500)]);
        this.form.controls.picName.setValidators([GlobalValidator.required]);
        this.form.controls.picName.updateValueAndValidity();
        this.form.controls.reason.updateValueAndValidity();
        //
        this.repairOrderList = res || [];
        this.repairOrderParams.api.setRowData(res);
      } else {
        this.repairOrderParams.api.setRowData();
        this.checkRequired = false;
        this.checkRequiredTextArea = '';
        this.form.controls.reason.setErrors(null);
        this.form.controls.picName.setErrors(null);
      }
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      reason: [undefined, [GlobalValidator.required, GlobalValidator.maxLength(500)]],
      picId: [undefined],
      picName: [undefined, GlobalValidator.required],
    });
  }

  private buildSearchForm() {
    this.searchForm = this.formBuilder.group({
      registerNo: [undefined, [GlobalValidator.required, GlobalValidator.minLength(3)]],
      vinNo: [undefined],
    });
  }
}
