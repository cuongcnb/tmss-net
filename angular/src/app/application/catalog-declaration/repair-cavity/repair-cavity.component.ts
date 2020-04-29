import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { RepairCavityModel } from '../../../core/models/catalog-declaration/repair-cavity.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CavityTypeModel } from '../../../core/models/catalog-declaration/cavity-type.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ShopCommonApi } from '../../../api/common-api/shop-common.api';
import { ShopTypeCommonApi } from '../../../api/common-api/shop-type-common.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-cavity',
  templateUrl: './repair-cavity.component.html',
  styleUrls: ['./repair-cavity.component.scss']
})
export class RepairCavityComponent implements OnInit {
  @ViewChild('repairCavityModal', { static: false }) cavityModal;
  form: FormGroup;
  cavitiesGridField;
  gridField;
  gridParams;

  cavities: Array<RepairCavityModel>;
  cavitiesTypes: Array<CavityTypeModel>;
  selectedData: RepairCavityModel;

  constructor(
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private shopApi: ShopCommonApi,
    private shopTypeApi: ShopTypeCommonApi,
    private confirm: ConfirmService,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.cavitiesGridField = [
      { headerName: 'Mã', headerTooltip: 'Mã', field: 'wsTypeCode' },
      { headerName: 'Tên', headerTooltip: 'Tên', field: 'wsTypeName' }
    ];
    this.gridField = [
      { headerName: 'Mã Khoang', headerTooltip: 'Mã Khoang', field: 'wsCode' },
      { headerName: 'Tên Khoang', headerTooltip: 'Tên Khoang', field: 'wsName' },
      { headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description' },
      { headerName: 'Tổ phụ trách', headerTooltip: 'Tổ phụ trách', field: 'divCode' },
      {
        headerName: 'Nhân viên', headerTooltip: 'Nhân viên', field: 'listEmpName',
        valueFormatter: params => params.value.toString()
      },
      { headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'ordering', cellClass: ['cell-readonly', 'cell-border', 'text-right'] },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        cellRenderer: params => params.data.status === 'Y' ? `Còn sử dụng` : 'Hết sử dụng',
      },
    ];
    this.buildForm();
  }

  refreshCavity() {
    this.selectedData = undefined;
    this.callbackCavity(this.gridParams);
  }

  callbackCavity(params) {
    params.api.setRowData();
    this.gridParams = params;
    if (this.form.value.wsTypeId) {
      this.getCavitiesByType(this.form.value.wsTypeId);
    }
  }

  getParamsCavity() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  updateCavity() {
    this.selectedData
      ? this.cavityModal.open(this.form.value.wsTypeId, this.selectedData)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteCavity() {
    this.selectedData
      ? this.confirm.openConfirmModal('Bàn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.shopApi.remove(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.refreshCavity();
          this.swalAlertService.openSuccessToast();
        });
      })
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      wsTypeId: [undefined],
      wsTypeName: [{ value: undefined, disabled: true }],
      description: [{ value: undefined, disabled: true }],
      status: ['Y'],
    });
    this.getCavitiesTypes();
    this.form.get('wsTypeId').valueChanges.subscribe(val => {
      if (val) {
        const matchValue = this.cavitiesTypes.find(type => type.id === val);
        this.form.patchValue({
          wsTypeName: matchValue ? matchValue.wsTypeName : undefined,
          description: matchValue ? matchValue.des : undefined,
        });
        this.getCavitiesByType(val);
      }
    });
  }

  private getCavitiesTypes() {
    this.loadingService.setDisplay(true);
    this.shopTypeApi.getAll().subscribe(res => {
      this.cavitiesTypes = res || [];
      this.form.patchValue({ wsTypeId: this.cavitiesTypes[0].id });
      this.getCavitiesByType(this.form.value.wsTypeId);
      this.loadingService.setDisplay(false);
    });
  }

  private getCavitiesByType(typeId) {
    this.loadingService.setDisplay(true);
    this.shopApi.getShopByShopType(typeId).subscribe(res => {
      this.cavities = !res ? [] : res.map(cavity => {
        return Object.assign({}, cavity, {
          listEmpName: cavity.listEmp.map(emp => emp.empName),
        }) || [];
      });
      this.gridParams.api.setRowData(this.cavities);
      this.loadingService.setDisplay(false);
      this.gridTableService.autoSizeColumn(this.gridParams);
    });
  }
}
