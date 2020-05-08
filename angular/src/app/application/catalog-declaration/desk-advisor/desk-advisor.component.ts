import { Component, OnInit, ViewChild, Injector } from '@angular/core';

import { ToastService } from '../../../shared/swal-alert/toast.service';
import { DeskAdvisorModel } from '../../../core/models/catalog-declaration/desk-advisor.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DeskAdvisorApi } from '../../../api/master-data/catalog-declaration/desk-advisor.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'desk-advisor',
  templateUrl: './desk-advisor.component.html',
  styleUrls: ['./desk-advisor.component.scss']
})
export class DeskAdvisorComponent extends AppComponentBase implements OnInit {
  @ViewChild('deskAdvisorModal', { static: false }) deskAdvisorModal;
  // currentUser = CurrentUser;
  gridField;
  gridParams;
  selectedDealerId: number;
  advisors: Array<DeskAdvisorModel>;
  selectedData: DeskAdvisorModel;

  constructor(
    injector: Injector,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private deskAdvisorApi: DeskAdvisorApi,
    private confirm: ConfirmService,
    private gridTableService: GridTableService,
  ) {
    super(injector);
    this.gridField = [
      { headerName: 'Tên bàn', headerTooltip: 'Tên bàn', field: 'deskName' },
      { headerName: 'Mã cố vấn dịch vụ', headerTooltip: 'Mã cố vấn dịch vụ', field: 'advisorCode' },
      { headerName: 'Tên cố vấn dịch vụ', headerTooltip: 'Tên cố vấn dịch vụ', field: 'advisorName' },
      { headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'description' },
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Còn hiệu lực' : 'Hết hiệu lực'}`
      },
    ];
  }

  ngOnInit() {
    this.selectedDealerId = this.currentUser.dealerId;
  }

  refreshDeskAdvisor() {
    this.selectedData = undefined;
    this.callbackDeskAdvisor(this.gridParams);
  }

  callbackDeskAdvisor(params) {
    params.api.setRowData();
    this.gridParams = params;
    this.loadingService.setDisplay(true);
    this.deskAdvisorApi.getDeskByCurrentDealer().subscribe(res => {
      this.advisors = res || [];
      params.api.setRowData(this.advisors);
      this.loadingService.setDisplay(false);
      this.gridTableService.autoSizeColumn(this.gridParams);
    });
  }

  getParamsDeskAdvisor() {
    const selectCheck = this.gridParams.api.getSelectedRows();
    if (selectCheck) {
      this.selectedData = selectCheck[0];
    }
  }

  updateDeskAdvisor() {
    this.selectedData
      ? this.deskAdvisorModal.open(this.advisors, this.selectedData)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteDeskAdvisor() {
    this.selectedData
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.deskAdvisorApi.remove(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.refreshDeskAdvisor();
          this.swalAlertService.openSuccessToast();
        });
      })
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }
}
