import {Component, OnInit, ViewChild, ElementRef, Injector} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {CurrentUserModel} from '../../../core/models/base.model';
import {SetModalHeightService} from '../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {PartsInfoManagementApi} from '../../../api/parts-management/parts-info-management.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsInfoManagementModel} from '../../../core/models/parts-management/parts-info-management.model';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessory-selling-report',
  templateUrl: './accessory-selling-report.component.html',
  styleUrls: ['./accessory-selling-report.component.scss']
})
export class AccessorySellingReportComponent extends AppComponentBase implements OnInit {
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('searchPartGridModal', {static: false}) searchPartGridModal;
  fieldGridSearchPartGrid;
  form: FormGroup;
  modalHeight: number;
  dealerList: DealerModel[];
  // currentUser: CurrentUserModel = CurrentUser;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private dealerApi: DealerApi,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private dataFormatService: DataFormatService,
    private el: ElementRef
  ) {
    super(injector);
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
    this.modalHeight = this.modalHeightService.onResize();
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
      this.buildForm();
    });
  }

  downloadFile() {
    if (this.form.invalid) {
      return;
    }
    const obj = this.form.getRawValue();
    this.loadingService.setDisplay(true);
    this.serviceReportApi.partsExportReport(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  searchPartsApi(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForOrder({partsCode: val.partsCode || null}, paginationParams);
  }

  reset() {
    this.form = undefined;
  }

  open() {
    if (this.currentUser.isAdmin) {
      this.getDealer();
    } else {
      this.buildForm();
    }
    this.modal.show();
    setTimeout(() => {
      this.el.nativeElement.querySelector('.btn-blue').focus();
    }, 200);
  }

  setDataToField(part: PartsInfoManagementModel) {
    this.form.patchValue({
      partCode: part.partsCode
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
      fromdate: [new Date(year, month, date, 0, 0, 0).getTime()],
      todate: [new Date(year, month, date, 23, 59, 59).getTime()],
      partCode: [undefined, GlobalValidator.required],
      extension: ['xls']
    });
  }

  searchPart() {
    this.searchPartGridModal.open({partsCode: this.form.value.partType});
  }

  report() {
    if (this.form.invalid) {
      return;
    }
    this.reportTypeModal.open();
  }
}
