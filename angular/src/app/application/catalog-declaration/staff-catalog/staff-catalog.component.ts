import { Component, OnInit, ViewChild } from '@angular/core';
import { DivisionCommonModel } from '../../../core/models/common-models/division-common.model';
import { DivisionCommonApi } from '../../../api/common-api/division-common.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { EmployeeCommonApi } from '../../../api/common-api/employee-common.api';
import { EmployeeCommonModel } from '../../../core/models/common-models/employee-common.model';
import { ITreeOptions } from 'angular-tree-component';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'staff-catalog',
  templateUrl: './staff-catalog.component.html',
  styleUrls: ['./staff-catalog.component.scss'],
})
export class StaffCatalogComponent implements OnInit {
  @ViewChild('divisionTree', { static: false }) divisionTree;
  @ViewChild('changeSelectedUnit', { static: false }) changeSelectedUnit;
  unitsTreeData;
  unitsOptions: ITreeOptions = {
    displayField: 'divName'
  };
  showDetail;
  unitFieldGrid;
  units: Array<DivisionCommonModel>;
  selectedUnit: DivisionCommonModel;

  staffFieldGrid;
  staffsParams;
  staffs: Array<EmployeeCommonModel>;
  staffSelected: EmployeeCommonModel;
  gridIndex: number;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private unitCatalogApi: DivisionCommonApi,
    private employeeApi: EmployeeCommonApi,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getUnitDivision();
    this.unitFieldGrid = [
      { headerName: 'Mã', headerTooltip: 'Mã', field: 'divCode' },
      { headerName: 'Tên đơn vị', headerTooltip: 'Tên đơn vị', field: 'divName' },
    ];
    this.staffFieldGrid = [
      { headerName: 'Mã', headerTooltip: 'Mã', field: 'empCode' },
      { headerName: 'Tên nhân viên', headerTooltip: 'Tên nhân viên', field: 'empName' },
    ];
  }

  active(e) {
    this.selectedUnit = e.node.data;
    this.clearData();
    this.getStaff(this.selectedUnit.id);
  }

  refresh() {
    this.getStaff(this.selectedUnit.id);
  }

  addStaff() {
    this.staffSelected = undefined;
    this.staffsParams.api.setRowData(this.staffs);
  }

  callbackGrid(params) {
    this.staffsParams = params;
  }

  getParams() {
    const selectedStaff = this.staffsParams.api.getSelectedNodes()[0];
    if (selectedStaff) {
      this.staffSelected = selectedStaff.data;
      this.gridIndex = selectedStaff.rowIndex;
    }
  }

  private clearData() {
    this.staffSelected = undefined;
    this.staffs = undefined;
    this.gridIndex = undefined;
    this.staffsParams.api.setRowData();
  }

  private getUnitDivision() {
    this.loadingService.setDisplay(true);
    this.unitCatalogApi.getDivisionByCurrentDlr().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.unitsTreeData = this.setChildren(res || []);
      setTimeout(() => {
        this.divisionTree.treeModel.expandAll();
      });
    });
  }

  private setChildren(sourceData, parentDivId?) {
    return (parentDivId
      ? sourceData.filter(res => res.parentDivId === parentDivId)
      : sourceData.filter(res => !res.parentDivId))
      .map(res => {
        return Object.assign({}, res, {
          children: this.setChildren(sourceData, res.id),
        });
      });
  }

  private getStaff(divId) {
    this.loadingService.setDisplay(true);
    this.employeeApi.getEmpByDivisionOfCurrent(divId).subscribe(staffs => {
      this.loadingService.setDisplay(false);
      this.staffs = staffs || [];
      this.staffsParams.api.setRowData(this.staffs);
      this.gridIndex
        ? this.staffsParams.api.getModel().rowsToDisplay[this.gridIndex].setSelected(true)
        : this.gridTableService.selectFirstRow(this.staffsParams);
      this.gridTableService.autoSizeColumn(this.staffsParams);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      empCode: [null],
      empName: [null]
    });
  }

  searchByEmp() {
    this.loadingService.setDisplay(true);
    this.employeeApi.searchEmployee(this.form.value).subscribe( res => {
      this.loadingService.setDisplay(false);
      this.showDetail = true;
      this.staffs = res.list || [];
      this.staffsParams.api.setRowData(this.staffs);
      this.gridTableService.selectFirstRow(this.staffsParams);
      this.gridTableService.autoSizeColumn(this.staffsParams);
    });
  }
}
