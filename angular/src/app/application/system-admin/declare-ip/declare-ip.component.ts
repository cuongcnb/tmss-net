import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {SysUserApi} from '../../../api/system-admin/sys-user.api';
import {AuthorizeApi} from '../../../api/system-admin/authorize.api';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {DealerIpApi} from '../../../api/system-admin/dealer-ip.api';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {DealerIpConfigApi} from '../../../api/sales-api/dealer-ip-config/dealer-ip-config.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'declare-ip',
  templateUrl: './declare-ip.component.html',
  styleUrls: ['./declare-ip.component.scss']
})
export class DeclareIpComponent implements OnInit {
  @ViewChild('declareIpDlr', {static: false}) declareIpDlr;
  fieldGridIp;
  ipParams;
  createUserData: Array<any>;
  selectedDLr: any;
  isConfirmChange: boolean;

  fieldGridGroupIpDlr;
  paramsDLrIp;
  listDLrIp: Array<any>;
  displayedUserGroupData: Array<any>;
  selectedDlrIp: any;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private authorizeApi: AuthorizeApi,
    private sysUserApi: SysUserApi,
    private dealerApi: DealerApi,
    private dealerIpApi: DealerIpApi,
    private confirmService: ConfirmService,
    private dealerIpConfigApi: DealerIpConfigApi
  ) {
    this.fieldGridIp = [
      {
        headerName: 'STT',
        headerTooltip: 'Số Thứ Tự',
        width: 50,
        cellClass: ['cell-border'],
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'code'},
      {headerName: 'TMV/Dealer', headerTooltip: 'TMV/Dealer', field: 'vnName'},
      {headerName: 'Địa Chỉ', headerTooltip: 'Địa Chỉ', field: 'address'},
      {headerName: 'Tỉnh/TP', headerTooltip: 'Tỉnh/TP', field: 'provinceName'},
      {headerName: 'Điện Thoại', headerTooltip: 'Điện Thoại', field: 'phone'}
    ];
    this.fieldGridGroupIpDlr = [
      {
        headerName: 'STT',
        headerTooltip: 'Số Thứ Tự',
        width: 50,
        cellClass: ['cell-border'],
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Địa Chỉ IP', headerTooltip: 'Địa Chỉ IP', field: 'ipClass'},
      {headerName: 'Is Log', headerTooltip: 'Is Log', field: 'isLog'},
      {headerName: 'Is Dealer IP', headerTooltip: 'Is Dealer IP', field: 'isDealerIp'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'status'}
    ];
  }

  ngOnInit() {
  }

  callbackGridIp(params) {
    this.ipParams = params;
    this.refreshListDlr();
  }

  refreshListDlr() {
    this.selectedDLr = undefined;
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(createUserData => {
      this.loadingService.setDisplay(false);
      this.createUserData = createUserData;
      this.ipParams.api.setRowData(this.createUserData);
      this.ipParams.api.sizeColumnsToFit(this.ipParams);
    });
  }

  getParamsIp() {
    this.forceSwitchUserDef();
  }

  forceSwitchUserDef() {
    const selectedDLr = this.ipParams.api.getSelectedRows();
    if (selectedDLr) {
      this.selectedDLr = selectedDLr[0];
      this.refreshListDlrIp();
    }
  }

  callbackGridIpDlr(params) {
    this.paramsDLrIp = params;
  }

  getParamsGridIpDlr() {
    const selectedDlrIp = this.paramsDLrIp.api.getSelectedRows();
    if (selectedDlrIp) {
      this.selectedDlrIp = selectedDlrIp[0];
    }
  }

  refreshListDlrIp() {
    if (this.selectedDLr) {
      this.loadingService.setDisplay(true);
      this.dealerIpConfigApi.getDealerIpByDealerIp(this.selectedDLr.id).subscribe(listDLrIp => {
        this.listDLrIp = listDLrIp;
        this.paramsDLrIp.api.setRowData(this.listDLrIp);
        this.paramsDLrIp.api.sizeColumnsToFit(this.paramsDLrIp);
        this.loadingService.setDisplay(false);
      });
    } else {
      this.paramsDLrIp.api.setRowData();
    }
  }

  removeSelectedRow() {
    if (!this.selectedDLr) {
      this.swalAlertService.openWarningToast('Cần chọn dữ liệu');
    } else {
      this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
        // tslint:disable-next-line:no-shadowed-variable
        this.dealerIpConfigApi.deleteDealerIp(this.selectedDlrIp).subscribe(res => {
          this.swalAlertService.openSuccessToast();
          this.refreshListDlrIp();
        });
      });
    }
  }
}
