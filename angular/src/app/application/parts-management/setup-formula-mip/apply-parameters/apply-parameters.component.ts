import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { AgInCellButtonComponent } from '../../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import { PartsExportApi } from '../../../../api/parts-management/parts-export.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import {
  PartsExportPartDetailPrepick,
  PartsExportRoModel,
} from '../../../../core/models/parts-management/parts-export.model';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apply-parameters',
  templateUrl: './apply-parameters.component.html',
  styleUrls: ['./apply-parameters.component.scss'],
})
export class ApplyParametersComponent implements OnInit, OnChanges {
  @Output() prePickActionSuccess = new EventEmitter();
  @Input() tabDisplay: boolean;
  @Input() prepickListOfRo: PartsExportPartDetailPrepick[];
  @Input() selectedRo: PartsExportRoModel;

  displayedData: PartsExportPartDetailPrepick[] = [];

  fieldGrid;
  params;
  selectedPrePick;
  frameworkComponents;



  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private partsExportApi: PartsExportApi,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.patchData();
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80,
      },
      {
        headerName: 'Tên đại lý',
        headerTooltip: 'Tên đại lý',
        field: 'partsCode',
      },
      {
        headerName: 'n',
        headerTooltip: 'n',
        field: 'n',
      },
      {
        headerName: 'a',
        headerTooltip: 'a',
        field: 'a',
      },
      {
        headerName: 'LT',
        headerTooltip: 'LT',
        field: 'lt',
      },
      {
        headerName: 'OC',
        headerTooltip: 'OC',
        field: 'oc',
      },
    ];
    this.frameworkComponents = {
      agInCellButtonComponent: AgInCellButtonComponent,
    };
  }

  // AG GRID
  callbackGrid(params) {
    this.params = params;
    this.patchData();
  }

  getParams() {
    const selectedPrePick = this.params.api.getSelectedRows();
    if (selectedPrePick) {
      this.selectedPrePick = selectedPrePick[0];
    }
  }

  patchData() {
    if (this.params && this.prepickListOfRo) {
      this.params.api.setRowData(this.gridTableService.addSttToData(this.prepickListOfRo));
      this.getDisplayedData();
    }
  }

  cellEditingStopped(params) {
    const field = params.colDef.field;
    const newQty = +params.data.newQty;
    const qty = +params.data.qty;
    if (field === 'newQty') {
      if (newQty >= qty) {
        this.swalAlertService.openWarningToast('Số lượng Pre-pick mới phải nhỏ hơn số lượng Pre-pick trước. Yêu cầu nhập giá trị khác');

        this.gridTableService.startEditCell(params);
      }
    }
  }

  getDisplayedData() {
    this.displayedData = this.gridTableService.getAllData(this.params);
  }

  // RETURN - EXPORT
  returnSinglePart(params) {
    if (+params.data.newQty >= +params.data.qty) {
      this.swalAlertService.openWarningToast('Số lượng Pre-pick mới phải nhỏ hơn số lượng Pre-pick trước. Yêu cầu nhập giá trị khác');
      return;
    }

    this.loadingService.setDisplay(true);
    this.partsExportApi.returnPrepickPart(params.data).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.prePickActionSuccess.emit();
      this.loadingService.setDisplay(false);
    });
  }

  exportSinglePart(params) {
    this.getDisplayedData();
    this.loadingService.setDisplay(true);
    this.partsExportApi.exportPrePickPart(params.data, this.selectedRo).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.prePickActionSuccess.emit();
      this.loadingService.setDisplay(false);
    });
  }

  returnAllPart() {
    this.getDisplayedData();
    if (!this.displayedData.length) {
      this.swalAlertService.openWarningToast('Danh sách pre pick trống, hãy chọn đơn hàng khác để Trả');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsExportApi.returnAllPrePickPart(this.displayedData).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.prePickActionSuccess.emit();
      this.loadingService.setDisplay(false);
    });
  }

  exportAllPart() {
    this.getDisplayedData();
    if (!this.displayedData.length) {
      this.swalAlertService.openWarningToast('Danh sách pre pick trống, hãy chọn đơn hàng khác để Xuất');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsExportApi.exportAllPrePickPart(this.displayedData, this.selectedRo)
      .subscribe(() => {
        this.swalAlertService.openSuccessToast();
        this.prePickActionSuccess.emit();
        this.loadingService.setDisplay(false);
      });
  }

  get disabledReturnBtn(): boolean {
    return !this.displayedData || (this.displayedData && !this.displayedData.length);
  }

  get disabledExportBtn(): boolean {
    return !this.displayedData ||
      (this.displayedData && !this.displayedData.length) ||
      (this.displayedData && this.displayedData.length && this.displayedData[0].reqtype === '2');
  }
}
