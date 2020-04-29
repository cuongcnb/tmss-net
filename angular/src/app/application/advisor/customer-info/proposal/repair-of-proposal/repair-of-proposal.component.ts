import { Component, EventEmitter, Output, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { remove } from 'lodash';
import { InsuranceComModel, InsuranceEmpModel } from '../../../../../core/models/sales/insurance-company.model';
import { InsuranceServiceApi } from '../../../../../api/common-api/insurance-service.api';
import { InsuranceEmployeeApi } from '../../../../../api/common-api/insurance-employee.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-of-proposal',
  templateUrl: './repair-of-proposal.component.html',
  styleUrls: ['./repair-of-proposal.component.scss'],
})
export class RepairOfProposalComponent implements OnInit, OnChanges {
  @Output() countMoney = new EventEmitter();
  @Output() chosenJob = new EventEmitter();
  @Output() partByJob = new EventEmitter();
  @Input() rotype: string;
  @Input() isRefresh;
  @Input() cmId: string;
  @Input() proposalForm;
  @Input() state;
  @Input() sccCurredJob;
  @Input() dsCurredJob;
  @Input() roState;
  @Input() dataGeneralRepair;
  @Input() dataBpRepair;
  @ViewChild('searchInsuranceStaff', {static: false}) searchInsuranceStaff;
  selectedTab;
  tabs = [];
  fieldGridInsurance;
  isRepair;
  isCollapsed = false;
  insurances;
  empOfInsurance;

  constructor(
    private insuranceServiceApi: InsuranceServiceApi,
    private insuranceEmployeeApi: InsuranceEmployeeApi,
  ) {
    this.fieldGridInsurance = [
      {headerName: 'Mã nhân viên', headerTooltip: 'Mã nhân viên', field: 'id'},
      {headerName: 'Tên nhân viên', headerTooltip: 'Tên nhân viên', field: 'name'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'tel'},
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.rotype && !this.isRefresh) {
      remove(this.tabs, item => item.tab === 'repair');
      remove(this.tabs, item => item.tab === 'dongson');
      this.rotype === '1' ? this.tabs.unshift({tab: 'dongson', name: 'Đồng Sơn'}) : this.tabs.unshift({tab: 'repair', name: 'Sửa chữa chung'});
      this.selectedTab = this.tabs[0].tab;
    }
  }

  ngOnInit() {
    this.checkForm();
    this.getInsurances();
  }

  private getInsurances() {
    this.insuranceServiceApi.findByDealer()
      .subscribe(insurances => this.insurances = insurances || []);
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private getEmpOfInsurance() {
    this.insuranceEmployeeApi.getEmpByComId(this.proposalForm.getRawValue().inrComId)
      .subscribe(res => this.empOfInsurance = res || []);
  }

  private checkForm() {
    // Sửa lại
    this.proposalForm.get('isFix').valueChanges.subscribe(val => {
      if (val) {
        this.tabs.push({tab: 'isFix', name: 'Sửa lại'});
      } else {
        if (this.tabs && this.tabs.length) {
          this.selectedTab = this.tabs[0].tab;
          remove(this.tabs, item => item.tab === 'isFix');
        }
      }
      this.isRepair = !val;
    });

    // Bảo hiểm
    this.proposalForm.get('isInr').valueChanges.subscribe((val: any) => {
      if (val) {
        this.tabs.push({tab: 'isInr', name: 'Bảo hiểm'});
      } else {
        if (this.tabs && this.tabs.length) {
          this.selectedTab = this.tabs[0].tab;
          remove(this.tabs, item => item.tab === 'isInr');
        }
      }
    });

    this.proposalForm.get('inrComId').valueChanges.subscribe(val => {
      if (val) {
        this.getEmpOfInsurance();
      } else {
        this.empOfInsurance = [];
        this.proposalForm.get('inrEmpId').setValue(undefined);
      }
    });

    this.proposalForm.get('inrEmpId').valueChanges.subscribe(val => {
      if (val) {
        const matchVal = this.empOfInsurance.find(emp => emp.id === val);
        this.proposalForm.get('inrEmpName').setValue(matchVal.name);
        this.proposalForm.get('inrEmpPhone').setValue(matchVal.tel);
      } else {
        this.proposalForm.get('inrEmpName').setValue(undefined);
        this.proposalForm.get('inrEmpPhone').setValue(undefined);
      }
    });
  }
}
