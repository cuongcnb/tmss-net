import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProgressBrealInfoModel} from '../../../core/models/coo/progress-breal-info.model';
import {VehicleHistoryApi} from '../../../api/vehicle-history/vehicle-history.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {EmployeeCommonApi} from '../../../api/common-api/employee-common.api';
import {CarStatus} from '../../../core/constains/progress-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'management-status',
  templateUrl: './management-status.component.html',
  styleUrls: ['./management-status.component.scss']
})
export class ManagementStatusComponent implements OnInit {
  @ViewChild('managementVehicle', {static: false}) managementVehicle;
  @ViewChild('managementVehicleUnusual', {static: false}) managementVehicleUnusual;

  form: FormGroup;
  fieldGrid;
  params;
  selectedData: ProgressBrealInfoModel;
  advisors;
  listStatus = CarStatus;

  constructor(
    private formBuilder: FormBuilder,
    private vehicleHistory: VehicleHistoryApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private employeeCommonApi: EmployeeCommonApi
  ) {
    this.fieldGrid = [
      {headerName: 'STT', headerTooltip: 'STT', field: 'repairorderno'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'reasoncontent'},
      {headerName: 'Tổng số lượng xe', headerTooltip: 'Tổng số lượng xe', field: 'reasoncontent'},
      {headerName: 'Số lượng xe bất thường', headerTooltip: 'Số lượng xe bất thường', field: 'unusual'}
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.employeeCommonApi.getEmpIsAdvisor().subscribe(val => {
      if (val) {
        this.advisors = val;
      }
    });
  }

  callbackGrid(params) {
    params.api.setRowData([{}]);
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  search() {
    this.loadingService.setDisplay(true);
    this.vehicleHistory.getVehicleHistory(this.form.value).subscribe(res => {
      this.params.api.setRowData(res);
      this.loadingService.setDisplay(false);
    });

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      roType: [''],
      status: [''],
      empId: ['']
    });
  }

  onCellDoubleClicked(param) {
    console.log(param);
    if (param.colDef && param.colDef.field === 'unusual') {
      this.managementVehicleUnusual.open();
    } else {
      this.managementVehicle.open();
    }
  }
}
