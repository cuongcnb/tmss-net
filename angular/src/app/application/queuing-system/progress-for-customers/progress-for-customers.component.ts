import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { ReloadProgressCustomerService } from '../../../shared/reload-progress-customer/reload-progress-customer.service';
import { AudioData, Customers } from '../../../shared/reload-progress-customer/reload-progress-customer';
import { FormStoringService } from '../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../core/constains/storageKeys';
import { CommonFunctionsService } from '../common-functions.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { AgInCellButtonComponent } from '../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import { QueuingApi } from '../../../api/queuing-system/queuing.api';
import { VehicleStatusModel } from '../../../core/models/queuing-system/vehicle-status.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'progress-for-customers',
  templateUrl: './progress-for-customers.component.html',
  styleUrls: ['./progress-for-customers.component.scss'],
})
export class ProgressForCustomersComponent implements AfterViewInit, OnInit {
  @ViewChild('audio', { static: false }) audio: ElementRef;
  customers$: Observable<Customers> | null | undefined;
  show: boolean;
  defaultCustomers: Customers = { list: [], total: 0 };
  public mybutton: any = 'Show';
  audioData = undefined;
  currentUser;
  imgSrc: string;
  phoneNumber: string;
  webAddress: string;
  fieldGrid;
  frameworkComponents;
  rowClassRules;
  height;
  params;
  selectedData: VehicleStatusModel;
  data;
  paginationTotalsData;
  paginationParams = {
    page: 1,
    size: 10
  };
  page;

  constructor(
    private reloadProgressCustomerService: ReloadProgressCustomerService,
    private sanitizer: DomSanitizer,
    private formStoringService: FormStoringService,
    private commonFunctionsService: CommonFunctionsService,
    private dataFormatService: DataFormatService,
    private queuingApi: QueuingApi
  ) {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.fieldGrid = [
      {
        headerName: 'BSX',
        headerTooltip: 'Biển số xe',
        field: 'registerNo',
      },
      {
        headerName: 'CVDV',
        headerTooltip: 'CVDV',
        field: 'empName'
      },
      {
        headerName: 'Dịch vụ',
        headerTooltip: 'Dịch vụ',
        field: 'roType',
        cellRenderer: params => {
          return this.convertRoType(params);
        },
        tooltip: (params) => {
          return this.convertRoType(params);
        }
      },
      {
        headerName: 'Giờ giao',
        headerTooltip: 'Giờ giao',
        field: 'carDeliveryTime',
        cellRenderer: params => {
          return this.dataFormatService.parseTimestampToHourMinute(params.value);
        },
        tooltip: (params) => {
          return this.dataFormatService.parseTimestampToHourMinute(params.value);
        }
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'roStatus'
      }
    ];
    this.setColorForCustomer();
    this.height = (window.innerHeight - 180) + 'px'; // trừ 169 do độ cao của header
    this.frameworkComponents = { agInCellButtonComponent: AgInCellButtonComponent };
  }

  ngOnInit() {
    // this.show = true;
    // this.customers$ = this.reloadProgressCustomerService.customers;
  }

  ngAfterViewInit(): void {
    // this.reloadProgressCustomerService.getSpeakers()
    //   .subscribe((audioData: AudioData) => this.audioData = this.transform('audio/mpeg', audioData.audioContent));
    // this.imgSrc = this.commonFunctionsService.getLogo(this.currentUser.dealerId) ? this.commonFunctionsService.getLogo(this.currentUser.dealerId) : '';
    // this.phoneNumber = this.commonFunctionsService.getPhoneNumber(this.currentUser.dealerId);
    // this.webAddress = this.commonFunctionsService.getWebAdress(this.currentUser.dealerId);
  }

  transform(mimeType: string, base64Data: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mimeType};base64, ${base64Data}`);
  }

  toggle(): void {
    this.show = !this.show;
    this.mybutton = this.show ? 'Hide' : 'Show';
  }

  getParams(event) {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  callbackGrid(params) {
    this.params = params;
    // this.interval = setInterval(() => this.search(), 10000);
    this.search();
  }

  search() {
    this.queuingApi.getVehicleStatus().subscribe(res => {
      this.data = res ? res : [];
      this.paginationTotalsData = res ? res.length : 0;
      const totalPage = res && res.length > 0 ? Math.ceil(res.length / this.paginationParams.size) : 0;
      if (this.page < (totalPage - 1)) {
        this.page += 1;
      } else {
        this.page = 0;
      }
      this.params.api.setRowData(this.data);
      this.params.api.paginationGoToPage(this.page);
    });
  }

  changePaginationParams(paginationParams) {
    this.paginationParams = paginationParams;
    const totalPage = this.data && this.data.length > 0 ? Math.ceil(this.data.length / this.paginationParams.size) : 0;
    if (this.page < (totalPage - 1)) {
      this.page += 1;
    } else {
      this.page = 0;
    }
    this.params.api.setRowData(this.data);
    this.params.api.paginationGoToPage(this.page);
  }

  refresh() {
    this.search();
    this.selectedData = undefined;
  }

  private setColorForCustomer() {
    this.rowClassRules = {
      firtInColor: params => params.data.isFirstIn === 'Y'
    };
  }

  private convertRoType(params) {
    switch (params.value) {
      case "1":
        return "Đồng sơn";
      case "2":
        return "Sữa chữa chung";
      case "3":
        return "Rửa xe";
      default:
        return "";
    }
  }
}

