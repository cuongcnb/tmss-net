import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { forkJoin, throwError } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, map, tap, throttleTime } from 'rxjs/operators';
import { ContextMenuComponent } from 'ngx-contextmenu';
import * as moment from 'moment';

import { QueuingApi } from '../../../api/queuing-system/queuing.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import {
  AdvisorVehicleReceivingModel,
  AppWaitAssignModel,
  GuestWaitAssignModel,
  ReceptionistWaitAssign
} from '../../../core/models/receptionist/receptionist.model';
import { ProgressState } from '../../../core/constains/progress-state';
import { DlrConfigApi } from '../../../api/common-api/dlr-config.api';
import { AgInCellButtonComponent } from '../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import { EventBusService } from '../../../shared/common-service/event-bus.service';
import { TMSSTabs } from '../../../core/constains/tabs';
import { CommonFunctionsService } from '../common-functions.service';
import { HomeComponent } from '../../../home/home.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'receiving-vehicle',
  templateUrl: './receiving-vehicle.component.html',
  styleUrls: ['./receiving-vehicle.component.scss']
})
export class ReceivingVehicleComponent implements AfterViewInit, OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  moment = moment;
  searchForm: FormGroup;
  guestCars: Array<GuestWaitAssignModel> = [];
  appointmentCars: Array<AppWaitAssignModel> = [];
  consultingCar: AdvisorVehicleReceivingModel;
  waitingConsultCars: Array<any> = [];
  consultedCars: Array<any> = [];
  receivedQty: number;
  waitingQty: number;
  warningTime: number;
  guessReceptionOrder: string;
  private readonly pauseColor: string = '#ffc107';

  @Input() state: ProgressState;
  @Input() isSCC;
  @ViewChild(ContextMenuComponent, { static: false }) public basicMenu: ContextMenuComponent;
  ProgressState = ProgressState;

  // table
  fieldGrid;
  params;
  frameworkComponents;

  constructor(
    private formBuilder: FormBuilder, private toastService: ToastService, private eventBus: EventBusService, private queuingApi: QueuingApi,
    private dlrConfigApi: DlrConfigApi, private commonFunctionsService: CommonFunctionsService, private homeComponent: HomeComponent,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      registerNo: ['', Validators.compose([])],
      job: ['ALL', Validators.required],
      date: [new Date(), Validators.required]
    });
    this.fieldGrid = [
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'registerNo',
        width: 60,
        cellClass: ['text-center'],
        cellStyle: params => {
          if (params.data.vehicleStatus === '3') {
            return { backgroundColor: `${this.pauseColor} !important` };
          }
        },
      },
      {
        headerName: 'Giờ vào cổng',
        headerTooltip: 'Giờ vào cổng',
        inDate: 'inDate',
        width: 60,
        cellClass: ['text-center'],
        cellRenderer: params => params ? moment(params.data.inDate).format('HH:mm') : '',
        cellStyle: params => {
          if (params.data.vehicleStatus === '3') {
            return { backgroundColor: `${this.pauseColor} !important` };
          }
        },
      },
      {
        headerName: 'Thời gian chờ',
        headerTooltip: 'Thời gian chờ',
        field: 'duration',
        width: 60,
        cellClass: ['text-center'],
        cellStyle: params => {
          if (params.data.vehicleStatus === '3') {
            return { backgroundColor: `${this.pauseColor} !important` };
          }
        },
      },
      {
        headerName: 'Yêu cầu sửa chữa',
        headerTooltip: 'Yêu cầu sửa chữa',
        cellClass: ['text-center'],
        width: 60,
        tooltip: params => this.commonFunctionsService.getCarJobs(params.data),
        cellRenderer: params => params ? this.commonFunctionsService.getCarJobs(params.data) : '',
        cellStyle: params => {
          if (params.data.vehicleStatus === '3') {
            return { backgroundColor: `${this.pauseColor} !important` };
          }
        },
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        cellClass: ['text-center'],
        width: 60,
        cellRenderer: params => {
          if (params.data.vehicleStatus === '3') {
            return 'Tạm dừng';
          }
        },
        cellStyle: params => {
          if (params.data.vehicleStatus === '3') {
            return { backgroundColor: `${this.pauseColor} !important` };
          }
        },
      },
      {
        headerName: 'Trạng thái hẹn',
        headerTooltip: 'Trạng thái',
        cellClass: ['text-center'],
        width: 50,
        cellRenderer: params => {
          const imgComponent = {
            component: ''
          };
          if (params.data.isAppointment === 'Y' || (params.data.isAppointment !== 'Y' && !params.data.id )) {
            const src = 'assets/imgs/h.png';
            return this.imgComponent(src);
          } else { return; }
        },
      },
      {
        headerName: 'Hành động',
        headerTooltip: 'Hành động',
        field: 'action',
        width: 100,
        cellRenderer: 'agInCellButtonComponent',
        buttonDef: {
          text: 'Tiếp nhận',
          useRowData: true,
          function: this.onReceiveVehicleClick.bind(this)
        },
        buttonDefTwo: {
          text: 'Gọi loa',
          useRowData: true,
          function: this.onNotifyVehicleClick.bind(this)
        },
        cellClass: ['cell-readonly'],
        cellStyle: params => (!!params && !!params.data && !!params.data.id) ? ({ display: 'inline-block' }) : ({ display: 'none' }),
      }
    ];
    this.frameworkComponents = { agInCellButtonComponent: AgInCellButtonComponent };
  }

  ngAfterViewInit(): void {
    this.searchForm.get('date').valueChanges
      .pipe(
        throttleTime(500),
        distinctUntilChanged(),
        tap(_ => this.searchForm.get('registerNo').setValue('')),
        concatMap(_ => forkJoin(this.handleRequests()))
      ).subscribe(response => this.handleLoadPageResponse(response));

    this.searchForm.get('job').valueChanges
      .pipe(
        throttleTime(500),
        distinctUntilChanged(),
        tap(_ => this.searchForm.get('registerNo').setValue('')),
        concatMap(_ => forkJoin(this.handleRequests()))
      ).subscribe(response => this.handleLoadPageResponse(response));
    this.changeDetectorRef.detectChanges();
  }

  loadData() {
    this.searchForm.get('registerNo').setValue('');
    forkJoin(this.handleRequests()).subscribe(response => this.handleLoadPageResponse(response));
  }

  callbackGrid(params) {
    this.params = params;
  }

  getParams(params) {
    const selectedNode = params.api.getSelectedNodes();
    if (selectedNode) { }
  }

  handleRequests(): object {
    const registerNo = this.commonFunctionsService.tranformRegisterNo(this.searchForm.get('registerNo').value.toString().toUpperCase());
    const timeStamp = this.searchForm.get('date').value.valueOf();
    const jobType = this.searchForm.get('job').value !== 'ALL' ? this.searchForm.get('job').value : null;

    const customers$ = this.queuingApi.getWaitingAndConsultingCustomers(timeStamp, registerNo, jobType);
    // const currentDealer$ = this.dlrConfigApi.getByCurrentDealer();
    const currentDealer$ = this.dlrConfigApi.getCurrentByDealer();
    const consultingCar$ = this.queuingApi.getAdvisorVehicleReceiving(timeStamp);
    const waitingCars$ = this.queuingApi.getAdvisorWaitReceive(timeStamp);
    const receivedCars$ = this.queuingApi.getAdvisorReceivedVehicle(timeStamp);
    const waitOrRecvVehicleQty$ = this.queuingApi.getAdvisorWaitOrRecvVehicleQty();

    return { customers$, currentDealer$, consultingCar$, waitingCars$, receivedCars$, waitOrRecvVehicleQty$ };
  }

  handleLoadPageResponse(response) {
    response.waitingCars$.forEach(waitingCar => waitingCar.duration = `${this.getDuration(waitingCar)} ph`);

    // this.warningTime = response.currentDealer$[0].warningTime * 60000;
    // this.guessReceptionOrder = response.currentDealer$[0].guessReceptionOrder;
    this.warningTime = response.currentDealer$.warningTime * 60000;
    this.guessReceptionOrder = response.currentDealer$.guessReceptionOrder;
    this.guestCars = response.customers$.guestWaitAssign;
    this.appointmentCars = response.customers$.appWaitAssign;
    this.consultingCar = response.consultingCar$;
    this.waitingConsultCars = response.waitingCars$;
    if (this.waitingConsultCars) { this.params.api.setRowData(this.waitingConsultCars); }
    this.consultedCars = response.receivedCars$;
    this.waitingQty = !!response.waitOrRecvVehicleQty$ ? response.waitOrRecvVehicleQty$.waitingQty : 0;
    this.receivedQty = !!response.waitOrRecvVehicleQty$ ? response.waitOrRecvVehicleQty$.receivedQty : 0;
  }

  isToday(): boolean {
    const timestamp = this.searchForm.get('date').value.valueOf();
    const now = moment();
    const startToday = now.startOf('day').valueOf();
    const endToday = now.endOf('day').valueOf();

    return timestamp >= startToday && timestamp < endToday;
  }

  getDuration(car): number {
    const now = moment();
    const inDate = moment(car.inDate);
    const duration = moment.duration(now.diff(inDate));
    return Math.floor(duration.asMinutes()) < 0 ? 0 : Math.floor(duration.asMinutes());
  }

  // btn tại dòng trong bảng
  onReceiveVehicleClick(event) {
    this.doVehicleReceive('RECEIVE', event.data);
  }

  onNotifyVehicleClick(event) {
    this.doCallSpeaker(event.data);
  }

  getChunkOfArray(arr: Array<any>, n: number): Array<any> {
    return Array.from(Array(Math.ceil(arr.length / n)), (_, i) => arr.slice(i * n, i * n + n));
  }

  findCar() {
    const registerNo = this.commonFunctionsService.tranformRegisterNo(this.searchForm.get('registerNo').value.toString().toUpperCase());
    const time = this.searchForm.get('date').value;

    const findCar$ = this.queuingApi.getWaitingAndConsultingCustomers(time, registerNo);
    findCar$.subscribe((res: ReceptionistWaitAssign) => {
      this.guestCars = res.guestWaitAssign;
      this.appointmentCars = res.appWaitAssign;
    });
  }

  doVehicleReceive(action: string, car) {
    const act = action.toUpperCase();
    const currentModifyDate = car.modifyDate;
    const gateInOutId = car.id;

    this.queuingApi.doAdvisorVehicleReceive(act, { currentModifyDate, gateInOutId })
      .pipe(
        tap(_ => {
          switch (act) {
            case 'RECEIVE':
              this.toastService.openSuccessToast('Tiếp nhận xe thành công.');
              break;
            case 'CANCEL':
              this.toastService.openSuccessToast('Tạm dừng xe thành công.');
              break;
            case 'DONE':
              this.toastService.openSuccessToast('Hoàn thành tiếp nhận xe.');
              break;
          }
        }),
        concatMap(_ => forkJoin(this.handleRequests())),
        map(response => {
          act === 'RECEIVE' ? this.opeCustomerInfo(car) : this.homeComponent.registerNo = undefined;
          return response;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 522) {
            this.toastService.openFailToast('Dữ liệu đã bị thay đổi.');
            return throwError(err);
          }
        })
      )
      .subscribe(response => this.handleLoadPageResponse(response));
  }

  opeCustomerInfo(car) {
    if (!!car) {
      const registerNo = car.registerNo;
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.customerInfo,
        registerNo,
      });
    }
  }

  callSpeaker(car) {
    return this.queuingApi.callCustomer(car.id, car.modifyDate)
      .pipe(
        tap(_ => this.toastService.openSuccessToast(`Thông báo thành công tới xe ${car.registerNo}.`)),
      );
  }

  chooseVehicle(car) {
    const currentModifyDate = car.modifyDate;
    const gateInOutId = car.id;
    const ordering = -1;

    return this.queuingApi.doAdvisorChooseVehicle({ currentModifyDate, gateInOutId, ordering })
      .pipe(
        map(_ => this.toastService.openSuccessToast('Chọn xe thành công.')),
        concatMap(_ => forkJoin(this.handleRequests()))
      );
  }

  doChooseVehicle(car) {
    this.chooseVehicle(car).subscribe(response => this.handleLoadPageResponse(response));
  }

  doCallSpeaker(car) {
    this.callSpeaker(car).subscribe();
  }

  doCallSpeakerThenChooseVehicle(car) {
    this.callSpeaker(car)
      .pipe(
        concatMap(_ => this.chooseVehicle(car))
      )
      .subscribe(response => this.handleLoadPageResponse(response));
  }
  imgComponent(srcImg) {
    const eGui = document.createElement('span');
    eGui.innerHTML = '<img witdh="10px" src="' + srcImg + '" />';
    return eGui;
  }
}
