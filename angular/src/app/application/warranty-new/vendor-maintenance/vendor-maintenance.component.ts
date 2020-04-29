import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {SysUserApi} from '../../../api/system-admin/sys-user.api';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {AgDatepickerRendererComponent} from '../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import * as moment from 'moment';
import {VendorMaintenanceApi} from '../../../api/warranty/vendor-maintenance.api';

@Component({
  selector: 'vendor-maintenance',
  templateUrl: './vendor-maintenance.component.html',
  styleUrls: ['./vendor-maintenance.component.scss']
})
export class VendorMaintenanceComponent implements OnInit {

  @ViewChild('updateModal', {static: false}) updateModal;
  form: FormGroup;
  fieldGrid;
  params;
  selectedData;
  data;
  paginationParams;
  paginationTotalsData: number;
  frameworkComponents;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private vendorMaintenanceApi: VendorMaintenanceApi,
    private downloadService: DownloadService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private dealerListService: DealerListService,
    private sysUserApi: SysUserApi,
    private confirmService: ConfirmService
  ) {
    this.frameworkComponents = {
      agDatepickerRendererComponent: AgDatepickerRendererComponent
    };

    this.fieldGrid = [
      {
        headerName: 'Vendor Code',
        headerTooltip: 'Vendor Code',
        field: 'venCode',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'Vendor Name (VN)',
        headerTooltip: 'Vendor Name(VN)',
        field: 'venVn',
        pinned: true,
        width: 100,
        resizable: true,

      },
      {
        headerName: 'Vendor Name (ENG)',
        headerTooltip: 'Vendor Name (ENG)',
        field: 'venEng',
        pinned: true,
        width: 100,
        resizable: true,
      },
      {
        headerName: 'PWR1',
        headerTooltip: 'PWR1',
        field: 'pwr1',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'PWR2',
        headerTooltip: 'PWR2',
        field: 'pwr2',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'PWR3',
        headerTooltip: 'PWR3',
        field: 'pwr3',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'PWR Change Date',
        headerTooltip: 'PWR Change Date',
        field: 'pwrChangeDate',
        pinned: true,
        width: 100,
        resizable: true,
      },
      {
        headerName: 'PWR1 New',
        headerTooltip: 'PWR1 New',
        field: 'pwr1New',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'PWR2 New',
        headerTooltip: 'PWR2 New',
        field: 'pwr2New',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'PWR3 New',
        headerTooltip: 'PWR3 New',
        field: 'pwr3New',
        width: 40,
        resizable: true,
      },
      {
        headerName: 'TWC FlatRate',
        headerTooltip: 'TWC FlatRate',
        field: 'twcFlatRate',
        width: 40,
        resizable: true,
      },
      {
        headerName: 'TWC Currency Code',
        headerTooltip: 'TWC Currency Code',
        field: 'twcCurrencyCode',
        width: 40,
        resizable: true,
      },
      {
        headerName: 'TWC Labor Currency Code',
        headerTooltip: 'TWC Labor Currency Code',
        field: 'twcLaborCode',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'TWC JudSystem',
        headerTooltip: 'TWC JudSystem',
        field: 'twcJudSystem',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'TACT Vendor Code',
        headerTooltip: 'TACT Vendor Code',
        field: 'tactVenCode',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'Vendor Name ABBR',
        headerTooltip: 'Vendor Name ABBR',
        field: 'venNameAbbr',
        width: 100,
        resizable: true,
      },
      {
        headerName: 'DIST Code',
        headerTooltip: 'DIST Code',
        field: 'distCode',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'PRR',
        headerTooltip: 'PRR',
        field: 'prr',
        width: 60,
        resizable: true,
      },
    ];
  }

  ngOnInit() {}


  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.callApi();
  }

  callApi() {
    this.vendorMaintenanceApi.getVendorMaintenanceApi().subscribe(val => {
      this.data = val;
      this.params.api.setRowData(this.data);
    });
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows()[0];
    if (selectedData) {
      this.selectedData = selectedData;
    }
  }

  // changePaginationParams(paginationParams) {
  //   if (!this.data) {
  //     return;
  //   }
  //   this.paginationParams = paginationParams;
  //   this.search();
  // }

  // search() {
  //   const searchData = this.form.getRawValue();
  //   this.selectedData = undefined;
  //   this.loadingService.setDisplay(true);
  //   this.vendorMaintenanceApi.searchVendorMaintenance(searchData, this.paginationParams).subscribe(res => {
  //     this.loadingService.setDisplay(false);
  //     this.data = res.list;
  //     this.paginationTotalsData = res.total;
  //     this.params.api.setRowData(this.data);
  //   });
  // }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.vendorMaintenanceApi.deleteVendorMaintenance(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }

  // exportExcel() {
  //   const paramsExport = {
  //     fileName: 'theo-doi-bao-hanh',
  //     sheetName: 'Theo dõi bảo hành',
  //     processHeaderCallback: params => params.column.getColDef().headerName,
  //     processCellCallback: params => {
  //       const field = params.column.getColDef().field;
  //       switch (field) {
  //         case 'cusComplainDate': case 'dlrJudgeDate': case 'reqTSDDate': case 'appointForRepair':
  //         case 'tsdJudgeDate': case 'dlrOrderPartDate': case 'etaDate': case 'appointForGemba':
  //           return !!params.value ? moment(params.value).format(moment.HTML5_FMT.DATETIME_LOCAL_MS) : '';
  //         default:
  //           return params.value;
  //       }
  //     }
  //   };
  //   this.params.api.exportDataAsExcel(paramsExport);
  // }

  // private buildForm() {
  //   this.form = this.formBuilder.group({
  //     modelPicId: [null],
  //     dlrId: [null],
  //     cboReqTSD: [null],
  //     status: [null],
  //     fromDate: [null],
  //     toDate: [null],
  //     byLT: [null],
  //   });
  // }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }

}
