import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../shared/common-service/set-modal-height.service';
import {ModalDirective} from 'ngx-bootstrap';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CurrentUserModel} from '../../../core/models/base.model';
import {CurrentUser} from '../../../home/home.component';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {PartsInfoManagementApi} from '../../../api/parts-management/parts-info-management.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsInfoManagementModel} from '../../../core/models/parts-management/parts-info-management.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-import-export-history-report',
  templateUrl: './part-import-export-history-report.component.html',
  styleUrls: ['./part-import-export-history-report.component.scss']
})
export class PartImportExportHistoryReportComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('btn', {static: false}) btn: ElementRef;
  @ViewChild('searchPartGridModal', {static: false}) searchPartGridModal;
  form: FormGroup;
  modalHeight: number;


  fieldGridSearchPartGrid;
  dealerList: DealerModel[];
  currentUser: CurrentUserModel = CurrentUser;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dealerApi: DealerApi,
    private loadingService: LoadingService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.fieldGridSearchPartGrid = [
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  searchPartsApi(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForOrder({partsCode: val.partsCode || null}, paginationParams);
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
      this.buildForm();
    });
  }

  open() {
    if (this.currentUser.isAdmin) {
      this.getDealer();
    } else {
      this.buildForm();
    }
    this.modal.show();
    setTimeout(() => {
      this.btn.nativeElement.focus();
    }, 200);
  }

  reset() {
    this.form = undefined;
  }

  searchPart() {
    this.searchPartGridModal.open({partsCode: this.form.value.partType});
  }

  setDataToField(part: PartsInfoManagementModel) {
    this.form.patchValue({
      partCode: part.partsCode
    });
  }

  downloadFile() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.setDisplay(true);
    this.serviceReportApi.impExpParthis(Object.assign({}, this.form.getRawValue()))
      .subscribe(res => {
        this.downloadService.downloadFile(res);
        this.loadingService.setDisplay(false);
      });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      dlrID: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin
      }, GlobalValidator.required],
      partCode: [undefined, GlobalValidator.required],
      fromDate: [new Date(year, month, date, 0, 0, 0).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      extension: ['xls']
    });
  }
}
