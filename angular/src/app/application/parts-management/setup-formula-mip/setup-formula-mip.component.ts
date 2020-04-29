import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {concatMap} from 'rxjs/operators';

import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {
  PartsExportCustomerInfo, PartsExportPartDetailPrepick, PartsExportPartDetailShipping,
  PartsExportPartOfRo, PartsExportPartsOfRoAndShip, PartsExportRoModel
} from '../../../core/models/parts-management/parts-export.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsExportApi} from '../../../api/parts-management/parts-export.api';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {AgDataValidateService} from '../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {EventBusService} from '../../../shared/common-service/event-bus.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'setup-formula-mip',
  templateUrl: './setup-formula-mip.component.html',
  styleUrls: ['./setup-formula-mip.component.scss']
})
export class SetupFormulaMipComponent implements OnInit, OnChanges {
  @ViewChild('partsExportSingleSlipModal', {static: false}) partsExportSingleSlipModal;
  @ViewChild('partsExportViewSlipModal', {static: false}) partsExportViewSlipModal;
  @Input() partExportInitialData: {
    ro: string,
    type: number,
    plate: string,
    searchOnStart: boolean,
  };
  fieldGridRo;
  roParams;
  form: FormGroup;
  selectedRo: PartsExportRoModel;
  roData: PartsExportRoModel[] = [];
  paginationTotalsData: number;
  paginationParams;
  fieldGridPartsOfRo;
  partsOfRoParams;
  selectedPart: PartsExportPartOfRo;
  frameworkComponents;
  displayedParts: Array<PartsExportPartOfRo> = [];
  partsAndShipStatusOfRo: PartsExportPartsOfRoAndShip;
  customerInfo: PartsExportCustomerInfo;
  partShippingHistory: PartsExportPartDetailShipping[];
  prepickListOfRo: PartsExportPartDetailPrepick[];
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;
  tabs: Array<any>;
  selectedTab: string;
  enableButtonOrderBO;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private partsExportApi: PartsExportApi,
    private gridTableService: GridTableService,
    private agDataValidateService: AgDataValidateService,
    private eventBus: EventBusService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent
    };
    this.fieldGridRo = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt'
      },
      {
        headerName: 'Mã công thức',
        headerTooltip: 'Mã công thức',
        field: 'ro'
      }
    ];
    this.initTabs();
    this.selectedTab = this.tabs[0].tab;
    this.buildForm();
    if (this.partExportInitialData && this.partExportInitialData.searchOnStart) {
      this.searchRo();
    }
  }

  callbackRoInfo(params) {
    this.roParams = params;
  }

  getParamsRoInfo() {
    const selectedRo = this.roParams.api.getSelectedRows();
    if (selectedRo) {
      this.selectedRo = selectedRo[0];
      this.selectedPart = undefined;
      this.getRoDetail();
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.roData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchRo();
  }

  searchRo() {
    this.loadingService.setDisplay(true);
  }

  // =====**** PARTS OF RO GRID ****=====
  getRoDetail() {
    this.loadingService.setDisplay(true);
    forkJoin([
        this.partsExportApi.getCustomerDetail(this.selectedRo),
        this.partsExportApi.getPartOfRo(this.selectedRo),
        this.partsExportApi.getPrepickOfRo(this.selectedRo)
      ]
    ).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.customerInfo = res[0];
      this.partsAndShipStatusOfRo = res[1];
      this.prepickListOfRo = res[2];
      this.setPartsOfRo();

      if (this.partsAndShipStatusOfRo.parts && this.partsAndShipStatusOfRo.parts.length) {
        this.enableButtonOrderBO = (this.partsAndShipStatusOfRo.parts.find(it => it.slTon < it.slCan));
      }
    });
  }

  setPartsOfRo() {
    this.partsOfRoParams.api.setRowData(this.gridTableService.addSttToData(this.partsAndShipStatusOfRo.parts));
    // Clear detail data nếu api trả về rỗng
    if (this.partsAndShipStatusOfRo.parts.length) {
      this.gridTableService.selectFirstRow(this.partsOfRoParams);
    } else {
      this.partShippingHistory = [];
    }
    this.getDisplayedParts();
    this.calculateFooterDetail();
  }

  export() {
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng');
      return;
    } else if (!this.selectedPart.slXuat && this.selectedPart.status === 3) {
      this.swalAlertService.openWarningToast('Phụ tùng đã chọn chưa có số lượng xuất');
      return;
    }
    if (this.selectedPart.status === 0 && !this.selectedPart.prepickLocationNo) {
      this.swalAlertService.openWarningToast('Trạng thái là "Pre-pick". Yêu cầu nhập "Vị trí Pre-pick"');
      return;
    }
    const val = {
      customer: this.customerInfo,
      partShippingDetail: [this.selectedPart],
      ro: this.selectedRo
    };
    this.loadingService.setDisplay(true);
    this.partsExportApi.exportSinglePart(val)
      .pipe(concatMap(() => this.partsExportApi.getPartOfRo(this.selectedRo)))
      .subscribe(() => {
        this.loadingService.setDisplay(false);
        this.getRoDetail();
        if (this.selectedPart.status === 3) {
          this.partsExportSingleSlipModal.open(this.customerInfo, this.partsAndShipStatusOfRo);
        }
      });
  }

  get rowToExport() {
    const editedRow = [];
    let validPrepick = true;
    if (this.agDataValidateService.validateDataGrid(this.partsOfRoParams, this.fieldGridPartsOfRo, this.displayedParts)) {
      let i = 0;
      while (i < this.displayedParts.length) {
        if (this.displayedParts[i].status === 0 && !this.displayedParts[i].prepickLocationNo) {
          this.swalAlertService.openWarningToast(`Dòng ${i + 1}, Trạng thái là "Pre-pick". Yêu cầu nhập "Vị trí Pre-pick"`);
          validPrepick = false;
          break;
        } else {
          if (this.displayedParts[i].slXuat) {
            editedRow.push(this.displayedParts[i]);
          }
          i++;
        }
      }
    }
    return validPrepick ? editedRow : validPrepick;
  }

  getDisplayedParts() {
    this.displayedParts = this.gridTableService.getAllData(this.partsOfRoParams);
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.displayedParts);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  private initTabs() {
    this.tabs = [
      {name: 'Tham số áp dụng', tab: 'prepickInfo'},
      {name: 'Thiết lập ICC', tab: 'boPartsExportDetail'}
    ];
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      code: [undefined],
      mad: [undefined],
      ss: [undefined],
      mip: [undefined]
    });

  }

  changeValueMAD(value, event?) {
    this.form.patchValue({ mad: (this.form.value.mad ? this.form.value.mad : '') + value });
  }

  changeValueSS(value) {
    this.form.patchValue({
      ss: (this.form.value.ss ? this.form.value.ss : '') + value
    });
  }

  changeValueMIP(value) {
    this.form.patchValue({
      mip: (this.form.value.mip ? this.form.value.mip : '') + value
    });
  }
}
