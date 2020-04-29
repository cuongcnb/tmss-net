import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ShortcutInput} from 'ng-keyboard-shortcuts';
import {GateInOutModel} from '../../../core/models/queuing-system/gate-in-out.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {QueuingApi} from '../../../api/queuing-system/queuing.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {AgInCellButtonComponent} from '../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import {CommonFunctionsService} from '../common-functions.service';
import {AudioData} from '../../../shared/reload-progress-customer/reload-progress-customer';
import {ReloadProgressCustomerService} from '../../../shared/reload-progress-customer/reload-progress-customer.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {WebSocketService} from '../../../api/web-socket.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'screen-wait-reception',
  templateUrl: './screen-wait-reception.component.html',
  styleUrls: ['./screen-wait-reception.component.scss']
})
export class ScreenWaitReceptionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vehicleInOut', {static: false}) vehicleInOut;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @Output() shortcuts = new EventEmitter<Array<ShortcutInput>>();
  form: FormGroup;
  currentUser;
  selectedData: GateInOutModel;
  data;
  params;
  fieldGrid;
  paginationParams = {
    page: 1,
    size: 10
  };
  page = -1;
  paginationTotalsData: number;
  exportParams;
  rowClassRules;
  frameworkComponents;
  excelStyles;
  keyboardShortcuts: Array<ShortcutInput> = [];
  height;
  audioData = undefined;
  stompClient;
  notifications = [];
  interval;
  intervalNotify;

  constructor(
    private downloadService: DownloadService, private formBuilder: FormBuilder, private confirmService: ConfirmService, private swalAlertService: ToastService,
    private loadingService: LoadingService, private queuingApi: QueuingApi, private dataFormatService: DataFormatService, private gridTableService: GridTableService,
    private commonFunctionsService: CommonFunctionsService,
    private sanitizer: DomSanitizer,
    private webSocketService: WebSocketService,
    private formStoringService: FormStoringService,
    private reloadProgressCustomerService: ReloadProgressCustomerService) {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        width: 60
      },
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'registerNo',
        width: 160
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'vehicleStatus',
        cellRenderer: params => {
          return params && params.data ? this.commonFunctionsService.getCarStatusReception(params.data) : '';
        }
      },
      {
        headerName: 'Quầy tiếp',
        headerTooltip: 'Quầy tiếp',
        field: 'deskName',
        width: 120
      },
      {
        headerName: 'CVDV',
        headerTooltip: 'CVDV',
        field: 'empName'
      },
      {
        headerName: 'Dịch vụ',
        headerTooltip: 'Dịch vụ',
        cellRenderer: params => {
          let job = '';
          if (params && params.data) {
            if (params.data.is1k === 'Y') {
              job += '1K+';
            }
            if (params.data.isBp === 'Y') {
              job += 'BP+';
            }
            if (params.data.isGj === 'Y') {
              job += 'GJ+';
            }
            if (params.data.isMa === 'Y') {
              job += 'PM';
            }
          }
          if (job.endsWith('+')) {
            job = job.slice(0, job.length - 1);
          }
          return job;
        }
      },
      {
        headerName: 'TGDK tiếp',
        headerTooltip: 'TGDK tiếp',
        field: 'inDate',
        cellRenderer: params => {
          let value = 0;
          const minute = 60000;
          if (params && params.data) {
            value = params.data.inDate ? params.data.inDate : 0;
            const receptionTimeBp = params.data.receptionTimeBp ? params.data.receptionTimeBp : 0;
            const receptionTimeScc = params.data.receptionTimeScc ? params.data.receptionTimeScc : 0;
            const reception = params.data.reception ? params.data.reception : 0;
            if (params.data.isBp === 'Y') {
              value += receptionTimeBp * minute;
            }
            if (params.data.isGj === 'Y') {
              value += receptionTimeScc * minute;
            }
            if (params.data.reception) {
              value += reception * minute;
            }
          }
          return params && params.value && value > 0 ? this.dataFormatService.parseTimestampToFullDate(value) : '';
        }
      }
    ];
    this.setColorForCustomer();
    this.height = (window.innerHeight - 180) + 'px'; // trừ 169 do độ cao của header
    this.frameworkComponents = {agInCellButtonComponent: AgInCellButtonComponent};
  }

  private setColorForCustomer() {
    this.rowClassRules = {
      firtInColor: params => params.data.isFirstIn === 'Y'
    };
  }

  ngOnInit() {
    // this.intervalNotify = setInterval(() => {
    //   if (this.notifications.length > 0) {
    //     console.log(this.notifications);
    //   }
    // }, 10000);
    this.reconnectSocket();
  }

  reconnectSocket() {
    this.stompClient = this.webSocketService.connect();
    this.stompClient.connect({}, () => {

      // Subscribe to notification topic
      this.stompClient.subscribe('/topic/notification/reception', res => {

        // Update notifications attribute with the recent messsage sent from the server
        const body = JSON.parse(res.body);
        const data = JSON.parse(body.data);
        if (body && Number(body.dlrId) === Number(this.currentUser.dealerId)) {
          this.reloadProgressCustomerService.getVoice(data[0].text)
            .subscribe((audioData: AudioData) => {
              this.audioData = this.transform('audio/mpeg', audioData.audioContent);
            });
        }
      }, onerror => console.log(onerror));
    }, () => this.reconnectSocket());
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    clearInterval(this.intervalNotify);
  }

  ngAfterViewInit(): void {
  }

  transform(mimeType: string, base64Data: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:${mimeType};base64, ${base64Data}`);
  }

  search() {
    this.queuingApi.getVehicleWaitReception().subscribe(res => {
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

  callbackGrid(params) {
    this.params = params;
    this.interval = setInterval(() => this.search(), 10000);
    this.search();
  }

  getParams(event) {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  refresh() {
    this.search();
    this.selectedData = undefined;
  }
}
