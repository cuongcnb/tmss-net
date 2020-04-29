import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CurrentUserModel} from '../../../core/models/base.model';
import {CurrentUser} from '../../../home/home.component';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {PartsInfoManagementModel} from '../../../core/models/parts-management/parts-info-management.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsInfoManagementApi} from '../../../api/parts-management/parts-info-management.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-check-inventory-report',
  templateUrl: './parts-check-inventory-report.component.html',
  styleUrls: ['./parts-check-inventory-report.component.scss']
})
export class PartsCheckInventoryReportComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('searchPartGridModal', {static: false}) searchPartGridModal;
  form: FormGroup;
  modalHeight: number;

  currentUser: CurrentUserModel = CurrentUser;
  dealerList: DealerModel[] = [];
  selectedDate;
  fieldGridSearchPartGrid;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private dealerApi: DealerApi,
    private dataFormatService: DataFormatService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private el: ElementRef
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

  open() {
    if (this.currentUser.isAdmin) {
      this.getDealers();
    }
    this.buildForm();
    this.fillMonthPicker();
    this.modal.show();
    setTimeout(() => {
      this.el.nativeElement.querySelector('.btn-blue').focus();
    }, 200);
  }

  getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
    });
  }

  reset() {
    this.form = undefined;
  }

  private fillMonthPicker(selectedDate?) {
    this.selectedDate = selectedDate ? new Date(selectedDate) : new Date();
    this.form.patchValue({
      fromDate: new Date(new Date(this.selectedDate).getFullYear(), new Date(this.selectedDate).getMonth()).getTime()
    });
  }

  downloadFile() {
    if (this.form.invalid) {
      return;
    }
    const obj = Object.assign({}, this.form.getRawValue(), {
      showZero: this.form.getRawValue().showZero ? 'Y' : 'N'
    });
    this.loadingService.setDisplay(true);
    this.serviceReportApi.partsCheckInventoryReportDownload(obj).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dlrId: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin
      }, GlobalValidator.required],
      partCode: [undefined, GlobalValidator.required],
      location: [undefined],
      showZero: [false],
      stockType: ['all'],
      extension: ['xls']
    });
  }

  searchPart() {
    this.searchPartGridModal.open({partsCode: this.form.value.partType});
  }

  searchPartsApi(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForOrder({partsCode: val.partsCode || null}, paginationParams);
  }

  setDataToField(part: PartsInfoManagementModel) {
    this.form.patchValue({
      partCode: part.partsCode
    });
  }

}
