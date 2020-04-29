import { Component, OnInit } from '@angular/core';

import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { InsuranceServiceApi } from '../../../../api/common-api/insurance-service.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { InsuranceComModel } from '../../../../core/models/sales/insurance-company.model';
import { InsuranceNewEmpApi } from '../../../../api/sales-api/insurance-new-emp.api/insurance-new-emp.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'inr-com',
  templateUrl: './inr-com.component.html',
  styleUrls: ['./inr-com.component.scss']
})
export class InrComComponent implements OnInit {
  gridField;
  gridParams;
  selectedCompany: InsuranceComModel;

  gridFieldEmp;
  gridParamsEmp;
  selectedEmp;

  constructor(
    private insuranceApi: InsuranceServiceApi,
    private insuranceEmpApi: InsuranceNewEmpApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.gridField = [
      {headerName: 'Mã Cty', headerTooltip: 'Mã Cty', field: 'inrCCode', resizable: true},
      {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'inrCName', resizable: true},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'smicAdd', resizable: true},
      {headerName: 'Website', headerTooltip: 'Website', field: 'website', resizable: true},
      {headerName: 'Số ĐT', headerTooltip: 'Số ĐT', field: 'tel', cellClass: ['cell-readonly', 'cell-border', 'text-right'], resizable: true},
      {headerName: 'Fax', headerTooltip: 'Fax', field: 'fax', cellClass: ['cell-readonly', 'cell-border', 'text-right'], resizable: true},
      {headerName: 'Số tài khoản', headerTooltip: 'Số tài khoản', field: 'accno', cellClass: ['cell-readonly', 'cell-border', 'text-right'], resizable: true},
      {headerName: 'Ngân hàng', headerTooltip: 'Ngân hàng', field: 'bankName', resizable: true},
      {headerName: 'MST', headerTooltip: 'Mã số thuế', field: 'taxcode', cellClass: ['cell-readonly', 'cell-border', 'text-right'], resizable: true},
      {headerName: 'Email', headerTooltip: 'Email', field: 'email', resizable: true},
      {headerName: 'Người LH', headerTooltip: 'Người liên hệ', field: 'pic', resizable: true},
      {headerName: 'ĐT người LH', headerTooltip: 'ĐT người LH', field: 'picTel', cellClass: ['cell-readonly', 'cell-border', 'text-right'], resizable: true},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark', resizable: true}
    ];
    this.gridFieldEmp = [
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'name', resizable: true},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'tel', cellClass: ['cell-readonly', 'cell-border', 'text-right'], resizable: true},
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.getInsuranceByDlr();
  }

  callbackGridEmp(params) {
    this.gridParamsEmp = params;
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedCompany = selectedData[0];
      this.refreshListEmp();
    }
  }

  getParamsEmp() {
    const selectedEmp = this.gridParamsEmp.api.getSelectedRows();
    if (selectedEmp) {
      this.selectedEmp = selectedEmp[0];
    }
  }

  refreshList() {
    this.gridParams.api.setRowData();
    this.selectedCompany = undefined;
    this.getInsuranceByDlr();
    this.refreshListEmp();
  }

  refreshListEmp() {
    this.gridParamsEmp.api.setRowData();
    this.selectedEmp = undefined;
    if (this.selectedCompany) {
      this.getEmpData();
    }
  }


  delete() {
    if (this.selectedCompany) {
      this.confirmService.openConfirmModal('Bạn có muốn xóa công ty này không?')
        .subscribe(() => {
          this.loadingService.setDisplay(true);
          this.insuranceApi.remove(this.selectedCompany.id).subscribe(() => {
            this.refreshList();
            this.loadingService.setDisplay(false);
            this.swalAlertService.openSuccessToast();
          });
        });
    } else {
      this.swalAlertService.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
    }
  }

  deleteEmp() {
    if (this.selectedEmp) {
      this.confirmService.openConfirmModal('Bạn có muốn xóa nhân viên này không?')
        .subscribe(() => {
          this.loadingService.setDisplay(true);
          this.insuranceEmpApi.remove(this.selectedEmp.id).subscribe(() => {
            this.refreshListEmp();
            this.loadingService.setDisplay(false);
            this.swalAlertService.openSuccessToast();
          });
        });
    } else {
      this.swalAlertService.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
    }
  }

  private getInsuranceByDlr() {
    this.loadingService.setDisplay(true);
    this.insuranceApi.findByDealer().subscribe(insurances => {
      this.gridParams.api.setRowData(insurances);
      const allColumnIds = [];
      this.gridParams.columnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.colId);
    });
      this.gridParams.columnApi.autoSizeColumns(allColumnIds);
      this.loadingService.setDisplay(false);
    });
  }

  private getEmpData() {
    this.loadingService.setDisplay(true);
    this.insuranceEmpApi.findInsuranceEmp(this.selectedCompany.id).subscribe(insurances => {
      this.gridParamsEmp.api.setRowData(insurances);
      this.loadingService.setDisplay(false);
    });
  }
}
