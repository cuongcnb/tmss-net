import {Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PerfectScrollbarComponent, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {forkJoin, merge, Observable, Subject, throwError, timer} from 'rxjs';
import {catchError, distinctUntilChanged, map, mapTo, mergeMap, shareReplay, skip, switchMap, take, takeUntil, tap, throttleTime} from 'rxjs/operators';
import {findIndex} from 'lodash';
import * as moment from 'moment';

import {QueuingApi} from '../../../api/queuing-system/queuing.api';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {
  AdvisorVehicleReceivingModel,
  AppWaitAssignModel,
  GuestWaitAssignModel,
  ReceptionistDeskAdviserModel,
  ReceptionistWaitAssign,
  WaitReceiveResponseModel
} from '../../../core/models/receptionist/receptionist.model';
import {DlrConfigApi} from '../../../api/common-api/dlr-config.api';
import {CommonFunctionsService} from '../common-functions.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';

const CACHE_SIZE = 1;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.scss']
})
export class ReceptionistComponent implements AfterViewInit, OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('receptionist') receptionist;
  @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef?: PerfectScrollbarComponent;
  @ViewChild('receptionistVehicle', {static: false}) receptionistVehicle;
  searchForm: FormGroup;
  public config: PerfectScrollbarConfigInterface = {};
  moment = moment;
  guestCars: Array<GuestWaitAssignModel> = [];
  appointmentCars: Array<AppWaitAssignModel> = [];
  consultingCarsAdviserIds: string[] = [];
  waitingConsultCarsAdviserIds: string[] = [];
  dropListConnectedIds: string[] = [];
  warningTime: number;
  private cache$: Observable<Array<ReceptionistDeskAdviserModel>> | null | undefined;
  private reload$ = new Subject<void>();

  advisers$: Observable<Array<ReceptionistDeskAdviserModel>> | null | undefined;
  showNotification$: Observable<boolean>;
  update$ = new Subject<void>();
  forceReload$ = new Subject<void>();

  REFRESH_INTERVAL;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private queuingApi: QueuingApi,
    private dlrConfigApi: DlrConfigApi,
    private commonFunctionsService: CommonFunctionsService,
    private changeDetectorRef: ChangeDetectorRef,
    private formStoringService: FormStoringService
  ) {
  }


  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      registerNo: ['', Validators.compose([])],
      date: [new Date(), Validators.required]
    });

    const initialAdvisers$ = this.getDataOnce();

    const updates$ = merge(this.update$, this.forceReload$).pipe(
      mergeMap(() => this.getDataOnce())
    );

    this.advisers$ = merge(initialAdvisers$, updates$);

    const reload$ = this.forceReload$.pipe(switchMap(() => this.getNotifications()));
    const initialNotifications$ = this.getNotifications();
    const show$ = merge(initialNotifications$, reload$).pipe(mapTo(true));
    const hide$ = this.update$.pipe(mapTo(false));
    this.showNotification$ = merge(show$, hide$);

    this.searchForm.get('date').valueChanges
      .pipe(
        throttleTime(500),
        distinctUntilChanged(),
        tap(_ => this.searchForm.get('registerNo').setValue(''))
      ).subscribe(_ => this.forceReload());
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  getDataOnce() {
    return this.advisers.pipe(take(1));
  }

  getNotifications() {
    return this.advisers.pipe(skip(1));
  }

  forceReload() {
    this.reload$.next();
    this.cache$ = null;
    this.forceReload$.next();
  }

  get advisers(): Observable<Array<ReceptionistDeskAdviserModel>> | null | undefined {
    const dlrConfig = this.formStoringService.get(StorageKeys.dlrConfig);
    if (dlrConfig.guessReceptionOrder === 'Y') {
      this.REFRESH_INTERVAL = 15000;
    }
    if (dlrConfig.guessReceptionOrder === 'N') {
      this.REFRESH_INTERVAL = null;
    }
    if (!this.cache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, this.REFRESH_INTERVAL);
      // For each tick we make an http requests to fetch new data
      // We use shareReplay(X) to multicast the cache so that all
      // subscribers share one underlying source and don't re-create
      // the source over and over again
      this.cache$ = timer$.pipe(
        switchMap(_ => this.requestAdvisers()),
        takeUntil(this.reload$),
        shareReplay(CACHE_SIZE)
      );
    }

    return this.cache$;
  }

  requestAdvisers() {
    const timeStamp = this.searchForm.get('date').value;

    const customers$ = this.queuingApi.getWaitingAndConsultingCustomers(timeStamp, null);
    // const currentDealer$ = this.dlrConfigApi.getByCurrentDealer();
    const currentDealer$ = this.dlrConfigApi.getCurrentByDealer();
    const advisers$ = this.queuingApi.getAdviserDesks();
    const consultingCars$ = this.queuingApi.getReceivingVehicle(timeStamp);
    const waitingCars$ = this.queuingApi.getWaitReceiveVehicle(timeStamp);
    const receivedCars$ = this.queuingApi.getReceivedVehicle(timeStamp);

    return forkJoin({customers$, currentDealer$, advisers$, consultingCars$, waitingCars$, receivedCars$})
      .pipe(
        map(response => this.handleAdviserResponse(response))
      );
  }

  handleAdviserResponse({customers$, currentDealer$, advisers$, consultingCars$, waitingCars$, receivedCars$}) {
    this.guestCars = customers$.guestWaitAssign ? customers$.guestWaitAssign.filter(it => it.isService === 'Y') : [];
    this.appointmentCars = customers$.appWaitAssign;
    // this.warningTime = currentDealer$[0].warningTime * 60000;
    this.warningTime = currentDealer$.warningTime * 60000;

    advisers$.forEach(adviser => {
      adviser.isOpen = false;
      this.consultingCarsAdviserIds.push(`consulting-cars-adviser-${adviser.advisorId}`);
      this.waitingConsultCarsAdviserIds.push(`waiting-consult-cars-adviser-${adviser.advisorId}`);

      const idx = !!consultingCars$ ? findIndex(consultingCars$, consultingCar => (consultingCar as AdvisorVehicleReceivingModel).advisorId === adviser.advisorId) : -1;
      adviser.consultingCars = (idx > -1) ? [consultingCars$[idx]] : [];
      adviser.waitingConsultCars = waitingCars$.filter(car => car.advisorId === adviser.advisorId);
      adviser.consultedCars = receivedCars$.filter(car => car.advisorId === adviser.advisorId);
    });
    if (this.isToday()) {
      this.dropListConnectedIds = [...this.consultingCarsAdviserIds, ...this.waitingConsultCarsAdviserIds];
    }

    return advisers$;
  }

  modifyVehicle(car) {
    // if (!!car.jobs) { return; }
    this.receptionistVehicle.open(car);
  }

  isToday(): boolean {
    const timestamp = this.searchForm.get('date').value;
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

  findCar() {
    const registerNo = this.commonFunctionsService.tranformRegisterNo(this.searchForm.get('registerNo').value.toString().toUpperCase());
    const timeStamp = this.searchForm.get('date').value;

    const findCar$ = this.queuingApi.getWaitingAndConsultingCustomers(timeStamp, registerNo);
    findCar$.subscribe((res: ReceptionistWaitAssign) => {
      this.guestCars = res.guestWaitAssign ? res.guestWaitAssign.filter(it => it.isService === 'Y') : [];
      this.appointmentCars = res.appWaitAssign;
    });
  }

  drop(event: CdkDragDrop<object[]>, adviser: ReceptionistDeskAdviserModel | null = null) {
    if (event.previousContainer === event.container) {
      this.toastService.openWarningToast('Không thể sắp xếp');
      return;
    }

    if (event.container.data.length > 0 && event.container.id.includes('consulting-cars-adviser-')) {
      this.toastService.openWarningToast('Xe đang tư vấn');
      return;
    }

    if (event.previousContainer !== event.container && event.container.id.includes('waiting-consult-cars-adviser-')) {
      const advisorId = adviser.advisorId;
      const currentModifyDate = (event.previousContainer.data[event.previousIndex] as AppWaitAssignModel | GuestWaitAssignModel).modifyDate;
      const gateInOutId = (event.previousContainer.data[event.previousIndex] as AppWaitAssignModel | GuestWaitAssignModel).id;
      const ordering = event.currentIndex !== event.container.data.length ? (event.container.data[event.currentIndex] as WaitReceiveResponseModel).ordering : -1;

      this.queuingApi.assigndvisor({advisorId, currentModifyDate, gateInOutId, ordering})
        .pipe(
          tap(_ => this.forceReload()),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 522) {
              this.toastService.openFailToast('Dữ liệu đã bị thay đổi');
              return throwError(err);
            }
          })
        )
        .subscribe(() => event.previousContainer !== event.container
          ? transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
          : moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
        );
    }

    if (event.container.id === 'guest-cars') {
      const gateInOutId = (event.previousContainer.data[event.previousIndex] as AppWaitAssignModel | GuestWaitAssignModel).id;

      this.queuingApi.unReceiveVehicle(gateInOutId)
        .pipe(
          tap(_ => this.forceReload())
        )
        .subscribe(() => event.previousContainer !== event.container
          ? transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
          : moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
        );
    }
  }
}
