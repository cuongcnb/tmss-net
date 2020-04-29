import {Component, Input, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CheckLogVehiclesService} from '../../../api/master-data/check-log-vehicles.service';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'check-log-vehicles',
  templateUrl: './check-log-vehicles.component.html',
  styleUrls: ['./check-log-vehicles.component.scss']
})
export class CheckLogVehiclesComponent {
  @ViewChild('checkLogVehiclesModal', {static: false}) checkLogVehiclesModal;
  @Input() searchKey: string;
  fieldGrid;
  gridParamsCheck;
  checkLogVehiclesData;

  paginationTotalsData: number;
  paginationParams;

  constructor(
    private checkLogVehiclesService: CheckLogVehiclesService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private gridExportService: GridExportService,
  ) {
    this.fieldGrid = [
      {
        headerName: 'TMSS No',
        field: 'tmssNo'
      },
      {
        field: 'frameNo'
      },
      {
        field: 'tableName'
      },
      {
        field: 'fieldName'
      },
      {
        field: 'createDate',
        cellClass: ['cell-border', 'text-right'],

      },
      {
        field: 'beforeChange',
        cellClass: ['cell-border', 'text-right'],
      },
      {
        field: 'afterChange',
        cellClass: ['cell-border', 'text-right'],
      },
      {
        field: 'userName'
      },
      {
        field: 'fullName'
      }
    ];
  }

  callbackCheckLog(params) {
    this.gridParamsCheck = params;
  }

  changePaginationParams(paginationParams) {
    if (!this.checkLogVehiclesData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  setFilterModel(params) {
    if (this.paginationParams && this.paginationParams.filters.length) {
      const obj = {};
      this.paginationParams.filters.map(item => {
        obj[item.fieldFilter] = {
          type: 'contains',
          filterType: 'text',
          filter: item.filterValue
        };
      });

      params.api.setFilterModel(obj);
    }
  }

  search() {
    if (this.searchKey) {
      this.loadingService.setDisplay(true);
      this.checkLogVehiclesService.searchCheckLogVehicles(this.searchKey, this.paginationParams).subscribe(checkLogVehiclesData => {
        this.checkLogVehiclesData = checkLogVehiclesData.list;
        this.paginationTotalsData = checkLogVehiclesData.total;
        this.gridParamsCheck.api.setRowData(this.checkLogVehiclesData);
        this.loadingService.setDisplay(false);
        this.setFilterModel(this.gridParamsCheck);
      });
    } else {
      this.gridParamsCheck.api.setRowData();
    }
  }

  export() {
    this.gridExportService.export(this.gridParamsCheck, 'Check Vehicles Logs');
  }
}
