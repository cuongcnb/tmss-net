import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { MasterLexusApi } from '../../../api/srv-master-lexus/master-lexus.api';
import { SrvModule } from '../srv-module';
import { PaginationParamsModel } from '../../../core/models/base.model';
import { SrvModel } from '../../../core/models/srv-lexus/srv-model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { DownloadService } from '../../../shared/common-service/download.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lexus-parts-price-management',
  templateUrl: './lexus-parts-price-management.component.html',
  styleUrls: ['./lexus-parts-price-management.component.scss'],
})
export class LexusPartsPriceManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('updatePriceModal', {static: false}) updatePriceModal;
  @ViewChild('importPriceModal', {static: false}) importPriceModal;
  form: FormGroup;

  fieldGrid;
  gridParams;
  selectedData: SrvModule;
  partList: SrvModel[];

  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;
  dataExport: SrvModel[];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private loadingService: LoadingService,
    private masterLexusApi: MasterLexusApi,
    private gridTableService: GridTableService,
    private downloadService: DownloadService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        minWidth: 150,
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        },
        minWidth: 150,
      },
      {
        headerName: 'Giá nhập TMV',
        headerTooltip: 'Giá nhập TMV',
        field: 'purchasePrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        minWidth: 150,
      },
      {
        headerName: 'Giá bán lẻ',
        headerTooltip: 'Giá bán lẻ',
        field: 'sellPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        minWidth: 150,
      },
      {
        headerName: 'Giá Lexus bán ĐL Toyota',
        headerTooltip: 'Giá Lexus bán ĐL Toyota',
        field: 'dlrPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        minWidth: 150,
      },
    ];
  }

  ngAfterViewInit(): void {
    this.search();
  }

  callBackGrid(params) {
    this.gridParams = params;
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.partList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    this.loadingService.setDisplay(true);
    if (this.form.get('partsCode').value && this.form.get('partsCode').value.length === 10) {
      this.paginationParams = { page: 1, size: 20, };
    }

    this.masterLexusApi.searchLexusPartPrice(this.form.value, this.paginationParams)
      .subscribe(data => {
        this.loadingService.setDisplay(false);
        this.partList = data.list;
        this.paginationTotalsData = data.total;
        this.gridParams.api.setRowData(this.partList);
      });
  }

  exportData() {
    // if (!this.form.value.partsCode) {
    //   this.swalAlert.openWarningToast('Phải nhập mã phụ tùng để xuất dữ liệu');
    //   return;
    // }
    this.loadingService.setDisplay(true);
    this.masterLexusApi.exportLexusPartPrice(this.form.value, this.paginationParams)
      .subscribe(data => {
        if (data) {
          this.downloadService.downloadFile(data);
          this.loadingService.setDisplay(false);
      }});
  }

  importData() {
    this.importPriceModal.open();
  }

  updatePrice() {
    this.form.get('partsCode').reset();
    this.updatePriceModal.open();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      partsCode: [undefined],
    });
  }

}
