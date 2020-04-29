import { Component, ViewChild } from '@angular/core';
import { InsuranceCompanyService} from '../../../api/master-data/insurance-company.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insurance-company',
  templateUrl: './insurance-company.component.html',
  styleUrls: ['./insurance-company.component.scss']
})
export class InsuranceCompanyComponent {
  @ViewChild('insuranceCompanyModal', {static: false}) insuranceCompanyModal;

  insuranceCompanyGridField;
  selectedCompany;
  gridParamsInsurance;

  constructor(
    private insuranceCompanyService: InsuranceCompanyService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.insuranceCompanyGridField = [
      {field: 'code', minWidth: 100},
      {headerName: 'VN Name', field: 'vnName', minWidth: 180},
      {headerName: 'EN Name', field: 'enName', minWidth: 120},
      {field: 'contactPerson', minWidth: 120},
      {
        field: 'status', minWidth: 60, cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
      },
      {headerName: 'Phone', field: 'tel', cellClass: ['cell-border', 'text-right'], minWidth: 100},
      {field: 'fax', cellClass: ['cell-border', 'text-right'], minWidth: 100},
      {field: 'taxCode', cellClass: ['cell-border', 'text-right'], minWidth: 100},
      {headerName: 'Bank No.', field: 'bankNo', cellClass: ['cell-border', 'text-right'], minWidth: 100},
      {field: 'address'},
    ];
  }

  callbackInsuranceCompanies(params) {
    this.loadingService.setDisplay(true);
    this.insuranceCompanyService.getInsuranceCompanyTable().subscribe(insurances => {
      params.api.setRowData(insurances);
      this.loadingService.setDisplay(false);
    });
    this.gridParamsInsurance = params;
  }

  refreshList() {
    this.selectedCompany = undefined;
    this.callbackInsuranceCompanies(this.gridParamsInsurance);
  }

  getParamsInsuranceCompany() {
    const selectedInsuranceCompany = this.gridParamsInsurance.api.getSelectedRows();
    if (selectedInsuranceCompany) {
      this.selectedCompany = selectedInsuranceCompany[0];
    }
  }

  updateInsuranceCompany() {
    this.selectedCompany ?
      this.insuranceCompanyModal.open(this.selectedCompany)
      : this.swalAlertService.openWarningForceSelectData();
  }

  deleteInsuranceCompany() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.insuranceCompanyService.deleteInsuranceCompany(this.selectedCompany.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}

