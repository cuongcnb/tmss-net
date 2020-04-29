import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WshopBPModel } from '../../../core/models/repair-progress/wshop-bp.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { BpGroupApi } from '../../../api/bp-group/bp-group.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  selector: 'app-wshop-bp-group',
  templateUrl: './wshop-bp-group.component.html',
  styleUrls: ['./wshop-bp-group.component.scss']
})
export class WshopBpGroupComponent implements OnInit {
  @ViewChild('wshopBpGroupModal', { static: false }) wshopBpGroupModal;

  form: FormGroup;
  cavitiesGridField;
  gridField;
  gridParams;
  fieldGridEmployees;
  bpGroups = [];
  finishLoadData = false;
  employeesParams: any;
  selectedData: WshopBPModel;


  constructor(
    private bpGroupApi: BpGroupApi,
    private swalAlertService: ToastService,
    private confirm: ConfirmService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.gridField = [
      { headerName: 'Mã Tổ', headerTooltip: 'Mã Tổ', field: 'groupCode' },
      { headerName: 'Tên Tổ', headerTooltip: 'Tên Tổ', field: 'groupName' },
      { headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'groupDesc' },
      { headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'ordering', cellClass: ['cell-readonly', 'cell-border', 'text-right'] }
    ];

    this.fieldGridEmployees = [
      { headerName: 'Mã nhân viên', headerTooltip: 'Mã Tổ', field: 'empCode' },
      { headerName: 'Tên nhân viên', headerTooltip: 'Tên nhân viên', field: 'empName' },
    ];
    this.initData();
  }

  refreshBpGroup() {
    this.selectedData = undefined;
    this.initData();
    this.callbackBpGroup(this.gridParams);
  }

  callbackBpGroup(params) {
    this.gridParams = params;
    if (this.bpGroups.length) {
      params.api.setRowData(this.bpGroups);
    }
    // if (this.form.value.wsTypeId) {
    //   this.getCavitiesByType(this.form.value.wsTypeId);
    // }
  }

  callbackGridEmployees(params) {
    this.employeesParams = params;
  }

  getParamsEmployees() {

  }

  initData() {
    this.finishLoadData = false;
    this.loadingService.setDisplay(true);
    this.bpGroupApi.getBpGroups().subscribe(res => {
      this.bpGroups = res;
      this.finishLoadData = true;
      this.loadingService.setDisplay(false);
    })
  }

  getParamsBpGroup() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
      this.bpGroupApi.getBpGroup(this.selectedData.id).subscribe(res => {
        this.employeesParams.api.setRowData(res)
      });
    }
  }

  updateBpGroup() {
    this.selectedData
      ? this.wshopBpGroupModal.open(this.selectedData)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteBpGroup() {
    this.selectedData
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.bpGroupApi.deleteBpGroup(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.initData();
          this.employeesParams.api.setRowData([]);
          this.swalAlertService.openSuccessToast();
        });
      })
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

}
