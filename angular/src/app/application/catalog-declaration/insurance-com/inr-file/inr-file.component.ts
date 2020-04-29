import { Component, OnInit } from '@angular/core';

import { InsuranceFileModel } from '../../../../core/models/catalog-declaration/insurance-file.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { InsuranceDoctypeApi } from '../../../../api/common-api/insurance-doctype.api';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'inr-file',
  templateUrl: './inr-file.component.html',
  styleUrls: ['./inr-file.component.scss']
})
export class InrFileComponent implements OnInit {
  gridField;
  gridParams;
  selectedData: InsuranceFileModel;

  constructor(
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private InsuranceDocApi: InsuranceDoctypeApi,
    private confirmService: ConfirmService,
    private insuranceDocApi: InsuranceDoctypeApi,
  ) {
  }

  ngOnInit() {
    this.gridField = [
      {
        headerName: 'Mã hồ sơ',
        headerTooltip: 'Mã hồ sơ',
        // minWidth: 150,
        field: 'doctypeCode',
      },
      {
        headerName: 'Tên hồ sơ',
        headerTooltip: 'Tên hồ sơ',
        // minWidth: 150,
        field: 'doctypeName',
      },
    ];

  }

  refreshFile() {
    this.gridParams.api.setRowData();
    this.selectedData = undefined;
    this.getInrDoc();
  }

  callbackFile(params) {
    this.gridParams = params;
    this.getInrDoc();
  }

  getParamsFile() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  getInrDoc() {
    this.loadingService.setDisplay(true);
    this.InsuranceDocApi.getAll().subscribe(file => {
      this.gridParams.api.setRowData(file);
      this.loadingService.setDisplay(false);
    });
  }

  delete() {
    if (this.selectedData) {
      this.confirmService.openConfirmModal('Bạn có muốn xóa công ty này không?')
        .subscribe(() => {
          this.loadingService.setDisplay(true);
          this.insuranceDocApi.remove(this.selectedData.id).subscribe(() => {
            this.refreshFile();
            this.loadingService.setDisplay(false);
            this.swalAlertService.openSuccessToast();
          });
        });
    } else {
      this.swalAlertService.openWarningToast('Hãy chọn dòng cần xóa!', 'Thông báo!');
    }
  }
}
