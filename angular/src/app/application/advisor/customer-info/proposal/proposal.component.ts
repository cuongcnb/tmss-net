import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forkJoin, Subject} from 'rxjs';
import * as moment from 'moment';
import {invalid} from 'moment';
import {difference, uniqBy} from 'lodash';
import {AllowIn, ShortcutInput} from 'ng-keyboard-shortcuts';

import {MoneyStatusModel} from '../../../../core/models/advisor/money-status.model';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {RcTypeApi} from '../../../../api/rc-type/rc-type.api';
import {RcTypeModel} from '../../../../core/models/advisor/rc-type.model';
import {RepairOrderApi} from '../../../../api/quotation/repair-order.api';
import {DownloadService} from '../../../../shared/common-service/download.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {EmployeeCommonApi} from '../../../../api/common-api/employee-common.api';
import {CustomerApi} from '../../../../api/customer/customer.api';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import {CarModelApi} from '../../../../api/common-api/car-model.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {RepairPlanApi} from '../../../../api/repair-plan/repair-plan.api';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {RoStateOfProposal, state} from '../../../../core/constains/ro-state';
import {AppoinmentApi} from '../../../../api/appoinment/appoinment.api';
import {CampaignManagementApi} from '../../../../api/master-data/warranty/campaign-management.api';
import {TMSSTabs} from '../../../../core/constains/tabs';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {SrvDRcJobsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {RepairJobApi} from '../../../../api/common-api/repair-job.api';
import {DataCodes} from '../../../../core/constains/data-code';
import {Times} from '../../../../core/constains/times';
import {NextShortcutService} from '../../../../shared/common-service/nextShortcut.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {CampaignDlrApi} from '../../../../api/campaign-dlr/campaign-dlr.api';

/**
 * Use to emit new shortcut config of ProposalComponent
 */
export const proposalShortcutRef$ = new Subject();
/**
 * Latest clicked row
 */
export let clickedRow: any;
/**
 * @param param Ag Grid params
 * @param selected Ag Grid seleted row
 * @param rowType Ag Grid rowType
 * @param clear Optional param to clear clickedRow
 */
export const setClickedRow = (param, selected, rowType: string, clear?: boolean): void => {
  if (clear) {
    clickedRow = null;
    return;
  } else {
    if (param && selected && rowType) {
      clickedRow = {
        params: param,
        selectedNode: selected,
        type: rowType
      };
    } else {
      clickedRow = null;
    }
  }
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterContentChecked {
  @Output() clear = new EventEmitter();
  @Output() reOpen = new EventEmitter();
  // tslint:disable-next-line:no-input-rename
  @Input('customerInfo') customerInfo;
  // tslint:disable-next-line:no-input-rename
  @Input('carInformation') carInformation;
  @ViewChild('proposalPrintModal', {static: false}) proposalPrintModal;
  @ViewChild('repairHistory', {static: false}) repairHistory;
  @ViewChild('content', {static: false}) content;
  @ViewChild('workIncurred', {static: false}) workIncurred;
  @ViewChild('cusInfoOfProposal', {static: false}) cusInfoOfProposal;
  @ViewChild('workNeedFast', {static: false}) workNeedFastModal;
  @ViewChild('storageModal', {static: false}) storageModal;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @ViewChild('firstFocus', {static: false}) firstFocus: ElementRef;
  @Output() shortcuts = new EventEmitter<Array<ShortcutInput>>();

  // @Output() proposal = new EventEmitter<Array<ShortcutInput>>();
  dlrConfig;
  keyboardShortcuts: Array<ShortcutInput> = [];
  campaign;
  kmBefore;
  RoState = RoStateOfProposal;
  State = state;
  form: FormGroup;
  repairMoney: MoneyStatusModel;
  partMoney: MoneyStatusModel;
  isRefresh: boolean;
  rcTypes: Array<RcTypeModel>;
  isSubmit: boolean;
  arrObjPart = [];
  arrObjGeneralRepair = [];
  arrObjBpRepair = [];
  cmListByType;
  dsCurredJob;
  sccCurredJob;
  roState;
  timeStartComponent;
  listCampaign;
  listJobGroup;
  listJobGroupFilter;
  listJobGroupJobType;
  partJobGroup = [];
  generalJobGroup = [];
  listJobType;
  time = new Date().getTime();
  campJobs: Array<any>;
  claimVehicleOld = 'BH xe cũ';
  disableCustomer = [state.settlement, state.cancel, state.gateInOut];
  enableBtnQuotationTmp = [null, state.quotationTmp];
  mrsTmssRoDTO;
  appointmentId;
  enableBtnQuotation = [
    null, state.quotationTmp, state.quotation, state.lsc, state.lxpt, state.working,
    state.complete, state.completeSc, state.qc, state.washing, state.stopWork
  ];
  enableBtnCancelRo = [state.quotationTmp, state.quotation, state.cancel];
  enableBtnPrintLXPT = [
    state.quotation, state.lsc, state.lxpt, state.working, state.complete, state.completeSc, state.qc, state.washing, state.stopWork
  ];
  stateCVDV = [null, state.quotationTmp];
  enableBtnPrintLSC = [
    null, state.quotation, state.lsc, state.lxpt, state.working, state.complete, state.completeSc, state.qc, state.washing, state.stopWork
  ];
  enableBtnFinishRo = [state.lsc, state.lxpt, state.working, state.complete, state.completeSc, state.qc, state.washing, state.stopWork];
  enableBtnProposalPrint = [state.complete, state.completeSc, state.settlement, state.washing];
  enableBtnRepairHistory = [
    null, state.quotation, state.lsc, state.lxpt, state.working, state.complete, state.completeSc,
    state.settlement, state.cancel, state.qc, state.washing, state.stopWork
  ];
  enableBtnWorkIncurred = [state.lsc, state.lxpt, state.working, state.complete, state.completeSc, state.qc, state.washing, state.stopWork];
  enableBtnWorkNeedFast = [state.lsc, state.complete, state.completeSc, state.qc, state.washing, state.stopWork];
  arrNotCheckDirty = ['km', 'qcLevel', 'estimateTime', 'typeEstimateTime', 'isCarWash', 'isTakeParts', 'isPriority', 'isCusWait', 'isEm', 'carDeliveryTime'];
  screenHeight: number;
  listRoNo = [];
  decode;
  isAdvisor = true;
  advisors = [];
  checkDirty = false;
  mapCodeByName = {
    // cus refer
    name: 'Ng m/x',
    tel: 'ĐT',
    tel2: 'ĐT',
    address: 'Địa chỉ',
    email: 'Email',
    // cus
    carownername: 'Chủ xe',
    cusno: 'Chủ xe',
    orgname: 'Tên Cty',
    carownermobil: 'DĐ/CĐ',
    carownertel: 'DĐ/CĐ',
    carownerfax: 'Fax',
    carowneremail: 'Email',
    carowneradd: 'Đ/chỉ',
    cusNote: 'Ghi chú',
    vccode: 'Màu xe',
    reqdesc: 'Yêu cầu khách hàng',
    estimateTime: 'TGSC',
    carDeliveryTime: 'Dự kiến giao xe',
    km: 'Km vào'
  };

  arrCustomer = [
    'registerno',
    'vinno',
    'name',
    'type',
    'calltime',
    'tel',
    'tel2',
    'address',
    'email',
    // cus
    'customerId',
    'carownername',
    'cusno',
    'callingHourOwner',
    'orgname',
    'custypeId',
    'carownermobil',
    'carownertel',
    'carownerfax',
    'carowneremail',
    'carowneradd',
    'provinceId',
    'districtId',
    'cusNote',
    'cmId',
    'cfId',
    'cmType',
    'cmCode',
    'fullmodel',
    'vcId',
    'vccode',
    'enginetypeId',
    'enginecode',
    'frameno',
    'engineno',
    'cmName',
    'doixe',
    'vehiclesId'
  ];

  onResize() {
    this.screenHeight = window.innerHeight - 180;
  }

  constructor(
    private formBuilder: FormBuilder,
    private confirmService: ConfirmService,
    private customerApi: CustomerApi,
    private swalAlertService: ToastService,
    private rcTypeApi: RcTypeApi,
    private repairOrderApi: RepairOrderApi,
    private downloadService: DownloadService,
    private gridTableService: GridTableService,
    private loadingService: LoadingService,
    private employeeApi: EmployeeCommonApi,
    private roWshopApi: RoWshopApi,
    private cdr: ChangeDetectorRef,
    private dataFormatService: DataFormatService,
    private carModelApi: CarModelApi,
    private repairPlanApi: RepairPlanApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private appoinmentApi: AppoinmentApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
    private repairJobApi: RepairJobApi,
    private campaignManagementApi: CampaignManagementApi,
    private campaignDlrApi: CampaignDlrApi,
    private eventBus: EventBusService,
    private nextShortcutService: NextShortcutService,
    private formStoringService: FormStoringService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private jwtHelper: JwtHelperService,
    private campaignApi: CampaignManagementApi,
    private elem: ElementRef
  ) {
    const currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.decode = this.jwtHelper.decodeToken(currentUser.token);
    this.getAdvisors();
    setTimeout(() => {
      this.getRcType();
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, 100);
    this.swalAlertService.setToastrConfig(5000);
    // @ts-ignore
  }

  ngOnDestroy() {
    // clearInterval(this.intervalSaveStorage);
    this.elem.nativeElement.removeEventListener('mousedown', () => {
    });
  }

  ngOnInit() {
    this.elem.nativeElement.addEventListener('mousedown', () => {
      const dataLocalStorage = localStorage.getItem(this.form.getRawValue().registerno);
      if (dataLocalStorage) {
        localStorage.removeItem(this.form.getRawValue().registerno);
      }
    });
    this.dlrConfig = this.formStoringService.get(StorageKeys.dlrConfig);
    this.getJobGroupJobType();
    this.getJobType();
    this.getCampaignByCar(this.customerInfo);
    // this.getJobGroup();
    this.onResize();
    this.timeStartComponent = new Date().getTime();


    this.keyboardShortcuts = [
      {
        key: ['ctrl + s', 'ctrl + S'],
        label: 'Báo giá',
        description: 'Lưu báo giá',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          const loadingComponent = document.querySelector('#loading-component');
          if (loadingComponent) {
            this.swalAlertService.openWarningToast('Đang có tiến trình chưa hoàn thành. Vui lòng đợi trong giây lát');
            return;
          }
          if (this.enableBtnQuotationTmp.includes(this.form.getRawValue().rostate) && this.isAdvisor) {
            this.createQuotationTmp(true);
          } else {
            if (this.enableBtnQuotation.includes(this.form.getRawValue().rostate)
              && !(this.form.getRawValue().jti !== this.form.getRawValue().createdBy && !this.stateCVDV.includes(this.form.getRawValue().rostate))
              && this.isAdvisor) {
              this.createQuotation('1', false);
            }
          }
        },
        preventDefault: true
      },
      {
        key: ['ctrl + b', 'ctrl + B'],
        label: 'Báo giá',
        description: 'In và xuất RO',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.createQuotation('1'),
        preventDefault: true
      },
      {
        key: ['ctrl + p', 'ctrl + P'],
        label: 'Báo giá',
        description: 'In lệnh xuất phụ tùng',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.reportTypeModal.open(2),
        preventDefault: true
      },
      {
        key: ['ctrl + r', 'ctrl + R'],
        label: 'Báo giá',
        description: 'In lệnh sửa chữa',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.onBtnLSC(),
        preventDefault: true
      },
      {
        key: ['ctrl + e', 'ctrl + E'],
        label: 'Báo giá',
        description: 'Công việc cần làm sớm',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.workNeedFastModal.open(this.form.getRawValue()),
        preventDefault: true
      },
      {
        key: ['ctrl + q', 'ctrl + Q'],
        label: 'Báo giá',
        description: 'In quyết toán',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.proposalPrintModal.open(this.form.getRawValue()),
        preventDefault: true
      },
      {
        key: ['ctrl + d', 'ctrl + D'],
        label: 'Báo giá',
        description: 'Xóa hàng chọn',
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => this.deleteClickedRow(),
        preventDefault: true
      }
    ];
    proposalShortcutRef$.next(this.keyboardShortcuts);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChangeProposal', this.customerInfo);
  }

  ngAfterContentChecked(): void {
  }

  reloadQuotation() {
    if (this.firstFocus && this.firstFocus.nativeElement) {
      this.firstFocus.nativeElement.focus();
    }
    const roState = this.form.getRawValue().rostate;
    if (!roState || roState === '' || Number(roState) < 2 || Number(roState) > 4) {
      return;
    }
    this.reload();
  }

  reload(noCheck?) {
    const obj = {
      cusId: this.form.get('customerId').value,
      cusvsId: this.form.get('cusvsId').value,
      roId: this.form.get('roId').value,
      vehiclesId: this.form.get('vehiclesId').value
    };
    this.customerApi.getCustomerDetail(obj).subscribe(res => {
      if (!noCheck && res.repairOrder && Number(res.repairOrder.rostate) === Number(this.form.get('rostate').value)) {
        return;
      }
      this.getListRo();
      this.customerInfo = Object.assign({}, this.customerInfo, res);
      this.cusInfoOfProposal.getDistricts();
      this.getCampaignByCar(this.customerInfo);
      // this.getJobGroup();
      this.patchFormValue();
    });
  }

  keyDown(event) {
    if (event.code === 'KeyC' && !!event.ctrlKey) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.customerInfo.repairOrder ? this.customerInfo.repairOrder.repairorderno : '';
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      return;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.firstFocus) {
        this.firstFocus.nativeElement.focus();
      }
    }, 200);
    this.changeDetectorRef.detectChanges();
  }

  getAdvisors() {
    this.employeeApi.getEmpIsAdvisor().subscribe(advisors => {
      this.advisors = advisors || [];
      const data = advisors.find(it => it.userId === this.decode.jti);
      this.isAdvisor = (data);
      if (!this.isAdvisor) {
        this.swalAlertService.openWarningToast('Bạn không phải CVDV nên không được phép tạo báo giá');
      }
    });
  }

  getListRo() {
    if (this.customerInfo.vehicle) {
      this.repairOrderApi.getListRo(this.customerInfo.vehicle.id).subscribe(res => {
        this.listRoNo = [];
        if (res) {
          this.listRoNo = res;
          this.listRoNo.map(it => {
            const ro = this.RoState.find(itt => itt.id === it.roState);
            it.roName = ro ? ro.name : '';
            return it;
          });
        }
      });
    }
  }

  getCampaignByCar(customer) {
    if (customer.carModel && customer.carModel.id) {
      this.campaignDlrApi.checkCarInDealerCampaign(customer.carModel.id).subscribe(res => {
        this.listCampaign = res ? res : [];
        this.listCampaign.unshift({id: null, campaignName: ''});
      });
    }
  }

  // getJobGroup() {
  //   const obj = {
  //     cmId: !!this.customerInfo ? this.customerInfo.carModel ? this.customerInfo.carModel.id : null : null,
  //     cfId: !!this.customerInfo ? this.customerInfo.carModel ? this.customerInfo.carModel.cfId : null : null,
  //     deleteFlag: 'N'
  //
  //   };
  //   this.repairJobApi.searchJobsGroup(obj).subscribe(res => {
  //     this.listJobGroup = res ? res : [];
  //     this.listJobGroupFilter = this.listJobGroup;
  //   });
  // }

  // changeSelectJobGroup() {
  //   if (!this.form.value.packageJob) {
  //     if (this.partJobGroup) {
  //       const data = [];
  //       this.partJobGroup.forEach(it => data.push(it.partsCode));
  //       this.arrObjPart = this.arrObjPart.filter(it => !data.includes(it.partsCode));
  //     }
  //     if (this.generalJobGroup) {
  //       const data = [];
  //       this.generalJobGroup.forEach(it => data.push(it.rccode));
  //       this.arrObjGeneralRepair = this.arrObjGeneralRepair.filter(it => !data.includes(it.rccode));
  //     }
  //     return;
  //   }
  //   const obj = {
  //     cmId: !!this.customerInfo ? this.customerInfo.carModel ? this.customerInfo.carModel.id : null : null,
  //     cfId: !!this.customerInfo ? this.customerInfo.carModel ? this.customerInfo.carModel.cfId : null : null,
  //     id: this.form.value.packageJob
  //   };
  //   this.repairJobApi.getJobsGroupDetail(obj).subscribe(res => {
  //     if (this.partJobGroup) {
  //       this.partJobGroup.map(it => it.id);
  //       this.arrObjPart = this.arrObjPart.filter(it => !this.partJobGroup.includes(it.id));
  //     }
  //     if (this.generalJobGroup) {
  //       this.generalJobGroup.map(it => it.id);
  //       this.arrObjGeneralRepair = this.arrObjGeneralRepair.filter(it => !this.generalJobGroup.includes(it.id));
  //     }
  //     this.partJobGroup = [];
  //     this.generalJobGroup = [];
  //     if (res) {
  //       res.map(it => it.listPartsDetail.forEach(item => this.partJobGroup.push(item)));
  //       this.generalJobGroup = res.map(it => {
  //         it.jobsname = it.rcname;
  //         it.timework = it.jobtime;
  //         it.actualtime = it.actualJobTime;
  //         it.taxRate = it.taxRate ? it.taxRate : 10;
  //         it.costs = it.cost;
  //         it.subletTypeCode = null;
  //         it.jobType = null;
  //         it.status = 'N';
  //         delete it.listPartsDetail;
  //         return it;
  //       });
  //     }
  //     this.partJobGroup.map(it => {
  //       it.partsId = it.id;
  //       it.partsNameVn = it.partsName;
  //       it.qty = it.amount;
  //       it.amount = it.payment;
  //       it.taxRate = it.taxRate ? it.taxRate : 10;
  //       return it;
  //     });
  //     this.arrObjPart = [...this.form.value.partList || [], ...this.partJobGroup];
  //     this.arrObjGeneralRepair = [...this.form.value.jobListScc || [], ...this.generalJobGroup];
  //   });
  // }

  changePartByJob(event) {
    this.arrObjPart = [...this.form.value.partList || [], ...event];
  }

  getRcType() {
    this.rcTypeApi.getAll().subscribe(rcTypes => {
      this.rcTypes = rcTypes || [];
      this.buildForm();
      this.patchFormValue();
    });
  }

  getRepairMoney(val: MoneyStatusModel) {
    this.repairMoney = val;
    this.getCampaignMoney(this.form.value.campaignId);
  }

  getPartMoney(val: MoneyStatusModel) {
    this.partMoney = val;
    this.getCampaignMoney(this.form.value.campaignId);
  }

  selectAppointment() {
    this.appointmentId = this.form.getRawValue().appointmentId;
  }

  getCampaignMoney(val) {
    if (val) {
      const data = this.listCampaign.find(it => it.id === val);
      if (!data) {
        this.campaign = {};
        return;
      }
      this.campaign = data;
    } else {
      this.campaign = {};
    }
  }

  changeType(val) {
    this.arrObjPart = [];
    this.arrObjGeneralRepair = [];
    this.arrObjBpRepair = [];

    // tslint:disable-next-line: no-shadowed-variable
    const type = val.substr(3);
    this.form.patchValue({roTypeTemp: type === '2' ? '2' : '1'});
    if (!!this.form.dirty) {
      this.swalAlertService.openWarningToast('Dữ liệu sẽ bị xóa khi bạn chuyển loại công việc');
      return;
    }

    if (type === '1') {
      this.nextShortcutService.nextType('DS');
    }
    if (type === '2') {
      this.nextShortcutService.nextType('SCC');
    }
    this.form.patchValue({
      rotype: type,
      roTypeTemp: type
    });
  }

  refresh() {
    this.isRefresh = true;
    setTimeout(() => {
      this.isRefresh = false;
    }, 1000);
    this.patchFormValue();
  }

  printLXPT(extension) {
    const printing = () => {
      this.loadingService.setDisplay(true);
      this.repairOrderApi.printPartHandover({
        extension,
        isCarWash: this.form.get('isCarWash').value ? 'Y' : 'N',
        isCusWait: this.form.get('isCusWait').value ? 'Y' : 'N',
        isTakeParts: this.form.get('isTakeParts').value ? 'Y' : 'N',
        isPriority: this.form.get('isPriority').value ? 'Y' : 'N',
        isEm: this.form.get('isEm').value ? 'Y' : 'N',
        qcLevel: this.form.get('qcLevel').value,
        estimateTime: this.form.value.typeEstimateTime === 1
          ? Number(this.form.getRawValue().estimateTime) * Times.hourMin : this.form.value.typeEstimateTime === 2
            ? Number(this.form.getRawValue().estimateTime) * Times.dayMin : Number(this.form.getRawValue().estimateTime),
        // appId: this.form.getRawValue().appointmentId,
        appId: this.appointmentId,
        customerDId: !!this.customerInfo ? this.customerInfo.customerD ? this.customerInfo.customerD.id : null : null,
        customersId: !!this.customerInfo ? this.customerInfo.customer ? this.customerInfo.customer.id : null : null,
        roId: this.form.get('roId').value,
        km: this.form.get('km').value,
        vehiclesId: !!this.customerInfo ? this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null : null
      }).subscribe((data) => {
        //reset appointment id
        this.appointmentId = null;
        this.reload(true);
        this.repairOrderApi.getOne(this.form.get('roId').value).subscribe(val => {
          this.getListRo();
          this.loadingService.setDisplay(false);
          if (data) {
            this.downloadService.downloadFile(data);
          }
          if (val) {
            this.form.get('rostate').setValue(val.rostate);
          }
        });
      });
    };

    if (this.form.invalid) {
      this.swalAlertService.openWarningToast('Bạn chưa nhập đủ thông tin trường băt buộc hoặc giá trị nhập không hợp lệ');
      return;
    }
    if (!this.form.get('partList').value || !this.form.get('partList').value.length) {
      this.swalAlertService.openWarningToast('Không có thông tin phụ tùng');
      return;
    }
    // if (!this.form.get('km').value) {
    //   this.swalAlertService.openWarningToast('Bắt buộc nhập Km');
    //   return;
    // }
    printing();
  }

  printInQT(extension) {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printRoSettlement({
      mrsTmssRoDTO: this.mrsTmssRoDTO,
      extension,
      customerDId: !!this.customerInfo ? this.customerInfo.customerD ? this.customerInfo.customerD.id : null : null,
      customersId: !!this.customerInfo ? this.customerInfo.customer ? this.customerInfo.customer.id : null : null,
      roId: this.form.get('roId').value,
      vehiclesId: !!this.customerInfo ? this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null : null
    }).subscribe((data) => {
      this.arrCustomer.forEach(it => this.form.get(it).disable());
      this.getListRo();
      this.loadingService.setDisplay(false);
      if (data) {
        this.repairOrderApi.getOne(this.form.get('roId').value).subscribe(val => {
          this.loadingService.setDisplay(false);
          if (data) {
            this.downloadService.downloadFile(data);
          }
          if (val) {
            this.form.get('rostate').setValue(val.rostate);
          }
        });
      }
    });
  }

  printLSC(extension) {
    const printing = () => {
      this.loadingService.setDisplay(true);
      this.repairOrderApi.printRepairOrder({
        listCampaignId: this.customerInfo.listCampaignId,
        isCarWash: this.form.get('isCarWash').value ? 'Y' : 'N',
        isCusWait: this.form.get('isCusWait').value ? 'Y' : 'N',
        isTakeParts: this.form.get('isTakeParts').value ? 'Y' : 'N',
        isPriority: this.form.get('isPriority').value ? 'Y' : 'N',
        isEm: this.form.get('isEm').value ? 'Y' : 'N',
        qcLevel: this.form.get('qcLevel').value,
        estimateTime: this.form.value.typeEstimateTime === 1
          ? Number(this.form.getRawValue().estimateTime) * Times.hourMin : this.form.value.typeEstimateTime === 2
            ? Number(this.form.getRawValue().estimateTime) * Times.dayMin : Number(this.form.getRawValue().estimateTime),
        extension,
        campaignId: this.form.value.campaignId ? this.form.value.campaignId : null,
        // campaignOpemDlrId: this.form.value.campaign ? this.form.value.campaign.campaignOpemDlrId : null,
        // appId: this.form.getRawValue().appointmentId,
        appId: this.appointmentId,
        customerDId: !!this.customerInfo ? this.customerInfo.customerD ? this.customerInfo.customerD.id : null : null,
        customersId: !!this.customerInfo ? this.customerInfo.customer ? this.customerInfo.customer.id : null : null,
        roId: this.form.get('roId').value,
        vehiclesId: !!this.customerInfo ? this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null : null,
        km: this.form.get('km').value
      }).subscribe((data) => {
        //reset appointment id
        this.appointmentId = null;
        this.reload(true);
        const api = [this.repairOrderApi.getOne(this.form.get('roId').value)];
        forkJoin(api).subscribe(res => {
          this.loadingService.setDisplay(false);
          if (data) {
            this.downloadService.downloadFile(data);
          }
          if (res[0]) {
            this.form.get('rostate').setValue(res[0].rostate);
          }
        });
      });
    };
    printing();
  }

  checkKmAndQc() {
    let errorMessage = '';
    if (!this.form.get('vccode').value) {
      errorMessage += ' Màu xe,';
      this.form.get('vccode').setErrors({requiredOnCondition: true});
    } else {
      this.form.get('vccode').setErrors(null);
    }
    if (!this.form.get('km').value) {
      errorMessage += ' Km,';
      this.form.get('km').setErrors({requiredOnCondition: true});
    } else {
      this.form.get('vccode').setErrors(null);
    }
    if (!this.form.get('qcLevel').value) {
      errorMessage += ' Cấp QC,';
      this.form.get('qcLevel').setErrors(invalid());
    } else {
      this.form.get('qcLevel').setErrors(null);
    }
    if (errorMessage) {
      errorMessage = 'Bạn phải nhập' + errorMessage;
      this.swalAlertService.openWarningToast(errorMessage.substring(0, errorMessage.length - 1));
      return false;
    }
    return true;
  }

  finishRo() {
    if (!!this.form.dirty) {
      this.swalAlertService.openWarningToast('Có dữ liệu thay đổi. Bạn phải in lại báo giá');
      return;
    }
    if (this.form.invalid) {
      this.swalAlertService.openWarningToast('Bạn chưa nhập đủ thông tin trường băt buộc hoặc giá trị nhập không hợp lệ');
      return;
    }
    this.loadingService.setDisplay(true);
    const data = this.form.getRawValue();
    this.repairOrderApi.finishRo(data.roId, data.vehiclesId, data.customerId).subscribe(val => {
      this.getListRo();
      if (val) {
        this.form.get('rostate').setValue(val.rostate);
      }
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  cancelRo() {
    this.confirmService.openConfirmModal(null, 'Bạn muốn hủy báo giá?').subscribe(() => {
      this.loadingService.setDisplay(true);
      this.repairOrderApi.cancelRo(this.form.get('roId').value).subscribe(val => {
        this.swalAlertService.openSuccessToast('Hủy thành công');
        this.getListRo();
        if (val) {
          this.form.get('rostate').setValue(val.rostate);
        }
        this.loadingService.setDisplay(false);
      });
    }, () => {
    });

  }

  createQuotationTmp(print?) {
    this.isSubmit = true;
    const listInvalid = this.findInvalidControls();
    let stringNotify = 'Bạn đã sai hoặc thiếu thông tin trường: ';
    if (new Date(this.form.get('carDeliveryTime').value).getTime() < new Date().getTime()) {
      this.swalAlertService.openWarningToast('DK giao xe phải lớn hơn thời gian hiện tại');
      return;
    }
    if (listInvalid && listInvalid.length > 0) {
      // tslint:disable-next-line:forin
      for (const field in listInvalid) {
        stringNotify = stringNotify + this.mapCodeByName[`${listInvalid[field]}`] + ', ';
      }
      stringNotify = stringNotify.slice(0, stringNotify.length - 2);
    }
    if (this.form.invalid) {
      this.swalAlertService.openWarningToast(stringNotify + ' .Chú ý dữ liệu trong các FORM đang đóng.');
      return;
    }
    if (this.customerInfo) {
      const dataSave = {
        estimateTime: this.form.value.typeEstimateTime === 1
          ? Number(this.form.getRawValue().estimateTime) * Times.hourMin : this.form.getRawValue().typeEstimateTime === 2
            ? Number(this.form.getRawValue().estimateTime) * Times.dayMin : Number(this.form.getRawValue().estimateTime),
        roIdDel: this.form.get('roId').value,
        cusVsId: this.customerInfo.cusVisit ? this.customerInfo.cusVisit.id : null,
        custId: this.customerInfo.customer ? this.customerInfo.customer.id : null,
        vehicleId: this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null,
        // appId: this.form.getRawValue().appointmentId,
        appId: this.appointmentId,
        jobList: [],
        pds: this.form.get('pds').value ? 'Y' : 'N',
        campaignId: this.form.value.campaignId ? this.form.value.campaignId : null,
        partList: this.form.getRawValue().partList
          ? this.form.getRawValue().partList.map(part => {
            return Object.assign({}, part,
              {quotationprintVersion: part.quotationprintVersion ? part.quotationprintVersion : part.version});
          })
          : [],
        srvBRecinr: {
          inrComId: this.form.get('inrComId').value,
          inrEmpId: this.form.get('inrEmpId').value
        },
        srvBCusVisit: {
          calltime: this.form.get('calltime').value
        },
        srvBRepairOrder: {
          isCarWash: this.form.get('isCarWash').value ? 'Y' : 'N',
          isCusWait: this.form.get('isCusWait').value ? 'Y' : 'N',
          isTakeParts: this.form.get('isTakeParts').value ? 'Y' : 'N',
          isPriority: this.form.get('isPriority').value ? 'Y' : 'N',
          isEm: this.form.get('isEm').value ? 'Y' : 'N',
          qcLevel: this.form.get('qcLevel').value,
          attribute1: null,
          attribute2: null,
          checkTlccpt: null,
          closeroDate: null,
          cusvsId: null,
          freePm: this.form.get('rctypeId').value,
          carDeliveryTime: this.form.get('carDeliveryTime').value,
          gid: null,
          id: null,
          inrstate: null,
          insertQversion: null,
          kcalc: null,
          km: this.form.get('km').value,
          notes: null,
          openroDate: null,
          quotationprint: this.form.get('quotationprint').value,
          rctypeId: this.form.get('rctypeId').value,
          readjustFixnote: this.form.get('readjustFixnote').value,
          readjustReason: this.form.get('readjustReason').value,
          readjustRoid: this.form.get('readjustRoid').value,
          repairorderno: null,
          reqdesc: this.form.get('reqdesc').value,
          roChange: null,
          rostate: null,
          rotype: this.form.get('rotype').value,
          testpaperprint: null,
          totalAmount: this.form.get('beforeTaxTotal').value,
          totalDiscount: this.form.get('discountTotal').value,
          totalTaxAmount: this.form.get('totalTaxAmount').value,
          useprogress: null
        }
      };
      if (dataSave.srvBRepairOrder.rotype === '1') {
        dataSave.jobList = this.form.getRawValue().jobListDs
          ? this.form.getRawValue().jobListDs.map(job => {
            return Object.assign({}, job,
              {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : job.version});
          })
          : [];
      } else {
        dataSave.jobList = this.form.getRawValue().jobListScc
          ? this.form.getRawValue().jobListScc.map(job => {
            return Object.assign({}, job,
              {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : job.version});
          })
          : [];
      }
      if (!dataSave.jobList || !dataSave.jobList.length || (dataSave.jobList.length === 1 && !dataSave.jobList[0].jobsname)) {
        this.swalAlertService.openWarningToast('Bạn chưa có công việc sửa chữa');
        return;
      } else {
        dataSave.jobList.map(it => {
          it.amount = Number(it.costs);
          return it;
        });
      }
      if (Number(this.form.getRawValue().estimateTime) === 0) {
        this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
        return;
      }
      for (let i = 0; i < dataSave.jobList.length; i++) {
        if ((!dataSave.jobList[i].jobsname || dataSave.jobList[i].jobsname === '') && !dataSave.jobList[i].subletTypeCode) {
          this.swalAlertService.openWarningToast(`Bạn chưa nhập đủ thông tin công việc sửa chữa TÊN CV hoặc THÀNH TIỀN ở dòng ${i + 1}`);
          return;
        }
        if (!this.form.value.pds && (!dataSave.jobList[i].costs || Number(dataSave.jobList[i].costs) === 0)) {
          this.swalAlertService.openWarningToast(`Chưa có thành tiền công việc ở dòng ${i + 1}`);
          return;
        }
      }
      if (dataSave.partList) {
        for (let i = 0; i < dataSave.partList.length; i++) {
          if ((!dataSave.partList[i].partsCode && dataSave.partList[i].qty) || (dataSave.partList[i].partsCode === '' && !(Number(dataSave.partList[i].qty) === 0))
            || (!dataSave.partList[i].qty && dataSave.partList[i].partsCode)
            || ((Number(dataSave.partList[i].qty) === 0) && dataSave.partList[i].partsCode)) {
            this.swalAlertService.openWarningToast(`Bạn chưa nhập đủ thông tin MÃ PT hoặc SL CẦN ở dòng ${i + 1}`);
            return;
          }
          // tslint:disable-next-line:prefer-for-o prefer-for-of
          if ((!dataSave.partList[i].partsCode && !dataSave.partList[i].qty) || (dataSave.partList[i].partsCode === '' && Number(dataSave.partList[i].qty) === 0)
            || (!dataSave.partList[i].qty && dataSave.partList[i].partsCode === '') || (Number(dataSave.partList[i].qty) === 0) && !dataSave.partList[i].partsCode) {
            dataSave.partList.splice(i, 1);
          } else {
            dataSave.partList[i].qty = Number(dataSave.partList[i].qty);
            if (dataSave.partList[i].status && +dataSave.partList[i].status < +status || !dataSave.partList[i].status) {
              dataSave.partList[i].status = status;
            }
            dataSave.partList[i].readjust = (dataSave.partList[i].readjust === true) ? 'Y' : 'N';
            // fix bug âm dương phụ tùng
          }
          let sum = 0;
          let cost = 0;
          let partCode;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < dataSave.partList.length; j++) {
            if (dataSave.partList[i].partsCode === dataSave.partList[j].partsCode) {
              // const totalQty = Number(dataSave.partList[j].qty || 0) - Number(dataSave.partList[j].received || 0);
              sum = Math.round((sum + Number(dataSave.partList[j].qty || 0)) * 100) / 100;
              cost += Number(dataSave.partList[j].discount || 0);
              partCode = dataSave.partList[j].partsCode;
            }
            if (sum < 0) {
              this.swalAlertService.openWarningToast(`Tổng số lượng của mã phụ tùng ${partCode} đang nhỏ hơn 0`);
              return;
            }

          }
        }
      }
      this.loadingService.setDisplay(true);
      forkJoin([this.updateCustomer(),
        this.repairOrderApi.createQuotationTmp(dataSave)
      ]).subscribe(val => {
        //reset appointment id
        this.appointmentId = null;
        this.getListRo();
        if (dataSave.srvBRepairOrder.rotype === '1') {
          this.arrObjBpRepair = dataSave.jobList;
        } else {
          this.arrObjGeneralRepair = dataSave.jobList;
        }
        this.arrObjPart = dataSave.partList;
        this.swalAlertService.openSuccessToast('Lưu thành công');
        this.form.get('quotationprint').setValue(val[1].srvBRepairOrder.quotationprint);
        this.form.get('roId').setValue(val[1].srvBRepairOrder.id);
        this.form.get('roNo').setValue(val[1].srvBRepairOrder.repairorderno);
        this.form.get('rostate').setValue(val[1].srvBRepairOrder.rostate);
        this.form.get('km').updateValueAndValidity();
        this.loadingService.setDisplay(false);

        setTimeout(() => {
          this.form.markAsPristine();
        }, 200);
        if (!!print) {
          return;
        }
        this.printQuotation();
      });
    } else {
      this.swalAlertService.openFailToast('Không có thông tin khách hàng');
    }
  }

  // autoCheck(valueCode) {
  //   this.isSubmit = true;
  //   if (Number(this.form.getRawValue().estimateTime) === 0) {
  //     this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
  //     return;
  //   }
  //   if (this.form.invalid) {
  //     this.swalAlertService.openWarningToast('Bạn phải nhập đủ thông tin trường bắt buộc');
  //     return;
  //   }
  //
  //   if (this.customerInfo) {
  //     const dataSave = {
  //       suggestRequestCode: valueCode,
  //       estimateTime: this.form.value.typeEstimateTime === 1
  //         ? Number(this.form.getRawValue().estimateTime) * Times.hourMin : this.form.value.typeEstimateTime === 2
  //           ? Number(this.form.getRawValue().estimateTime) * Times.dayMin : Number(this.form.getRawValue().estimateTime),
  //       // appId: this.form.getRawValue().appointmentId,
  //       appId: this.appointmentId,
  //       roIdDel: this.form.get('roId').value,
  //       campaignOpemDlrId: this.form.value.campaign ? this.form.value.campaign.campaignOpemDlrId : null,
  //       cusVsId: this.customerInfo.cusVisit ? this.customerInfo.cusVisit.id : null,
  //       custId: this.customerInfo.customer ? this.customerInfo.customer.id : null,
  //       vehicleId: this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null,
  //       jobList: [],
  //       partList: this.form.getRawValue().partList
  //         ? this.form.getRawValue().partList.map(part => {
  //           return Object.assign({}, part,
  //             {quotationprintVersion: part.quotationprintVersion ? part.quotationprintVersion : part.version});
  //         })
  //         : [],
  //       srvBRecinr: {
  //         inrComId: this.form.get('inrComId').value,
  //         inrEmpId: this.form.get('inrEmpId').value
  //       },
  //       srvBCusVisit: {
  //         calltime: this.form.get('calltime').value
  //       },
  //       srvBRepairOrder: {
  //         attribute1: null,
  //         attribute2: null,
  //         checkTlccpt: null,
  //         closeroDate: null,
  //         createDate: this.form.get('date').value,
  //         createdBy: null,
  //         cusvsId: null,
  //         deleteflag: null,
  //         dlrId: null,
  //         freePm: this.form.get('rctypeId').value,
  //         gid: null,
  //         id: this.form.get('roId').value,
  //         inrstate: null,
  //         insertQversion: null,
  //         kcalc: null,
  //         km: this.form.get('km').value,
  //         modifiedBy: null,
  //         modifyDate: null,
  //         notes: null,
  //         openroDate: null,
  //         quotationprint: this.form.get('quotationprint').value,
  //         rctypeId: this.form.get('rctypeId').value,
  //         readjustFixnote: this.form.get('readjustFixnote').value,
  //         readjustReason: this.form.get('readjustReason').value,
  //         readjustRoid: this.form.get('readjustRoid').value,
  //         repairorderno: this.form.getRawValue().roNo,
  //         reqdesc: this.form.get('reqdesc').value,
  //         roChange: null,
  //         rostate: null,
  //         rotype: this.form.get('rotype').value,
  //         testpaperprint: null,
  //         totalAmount: this.form.get('beforeTaxTotal').value,
  //         totalDiscount: this.form.get('discountTotal').value,
  //         totalTaxAmount: this.form.get('totalTaxAmount').value,
  //         useprogress: null
  //       }
  //     };
  //     if (dataSave.srvBRepairOrder.rotype === '1') {
  //       dataSave.jobList = this.form.getRawValue().jobListDs
  //         ? this.form.getRawValue().jobListDs.map(job => {
  //           return Object.assign({}, job,
  //             {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : job.version});
  //         })
  //         : [];
  //     } else {
  //       dataSave.jobList = this.form.getRawValue().jobListScc
  //         ? this.form.getRawValue().jobListScc.map(job => {
  //           return Object.assign({}, job,
  //             {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : job.version});
  //         })
  //         : [];
  //     }
  //     if (!dataSave.jobList || !dataSave.jobList.length || (dataSave.jobList.length === 1 && !dataSave.jobList[0].jobsname)) {
  //       this.swalAlertService.openWarningToast('Bạn chưa có công việc sửa chữa');
  //       return;
  //     } else {
  //       dataSave.jobList.map(it => {
  //         it.amount = Number(it.costs);
  //         return it;
  //       });
  //     }
  //     const lastJob = dataSave.jobList[dataSave.jobList.length - 1];
  //     if ((!lastJob.jobsname || !lastJob.costs) && !lastJob.subletTypeCode) {
  //       this.swalAlertService.openWarningToast('Bạn chưa nhập đủ thông tin công việc sửa chữa');
  //       return;
  //     }
  //     if (dataSave.partList) {
  //       for (let i = 0; i < dataSave.partList.length; i++) {
  //         if ((!dataSave.partList[i].partsCode && dataSave.partList[i].qty) || (dataSave.partList[i].partsCode === '' && !(Number(dataSave.partList[i].qty) === 0))
  //           || (!dataSave.partList[i].qty && dataSave.partList[i].partsCode)
  //           || ((Number(dataSave.partList[i].qty) === 0) && dataSave.partList[i].partsCode)) {
  //           this.swalAlertService.openWarningToast(`Bạn chưa nhập đủ thông tin MÃ PT hoặc SL CẦN ở dòng ${i + 1}`);
  //           return;
  //         }
  //         // tslint:disable-next-line:prefer-for-o prefer-for-of
  //         if ((!dataSave.partList[i].partsCode && !dataSave.partList[i].qty) || (dataSave.partList[i].partsCode === '' && Number(dataSave.partList[i].qty) === 0)
  //           || (!dataSave.partList[i].qty && dataSave.partList[i].partsCode === '') || (Number(dataSave.partList[i].qty) === 0) && !dataSave.partList[i].partsCode) {
  //           dataSave.partList.splice(i, 1);
  //         } else {
  //           dataSave.partList[i].qty = Number(dataSave.partList[i].qty);
  //           if (dataSave.partList[i].status && +dataSave.partList[i].status < +status || !dataSave.partList[i].status) {
  //             dataSave.partList[i].status = status;
  //           }
  //           dataSave.partList[i].readjust = (dataSave.partList[i].readjust === true) ? 'Y' : 'N';
  //           let sum = 0;
  //           let cost = 0;
  //           let partCode;
  //           // tslint:disable-next-line:prefer-for-of
  //           for (let j = 0; j < dataSave.partList.length; j++) {
  //             if (dataSave.partList[i].partsCode === dataSave.partList[j].partsCode) {
  //               // const totalQty = Number(dataSave.partList[j].qty || 0) - Number(dataSave.partList[j].received || 0);
  //               sum = Math.round((sum + Number(dataSave.partList[j].qty || 0)) * 100) / 100;
  //               cost += Number(dataSave.partList[j].discount || 0);
  //               partCode = dataSave.partList[j].partsCode;
  //             }
  //             if (sum < 0) {
  //               this.swalAlertService.openWarningToast(`Tổng số lượng của mã phụ tùng ${partCode} đang nhỏ hơn 0`);
  //               return;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     this.repairOrderApi.suggestTime(dataSave).subscribe(val => {
  //       this.form.patchValue({
  //         roId: val.srvBRepairOrder ? val.srvBRepairOrder.roId : null
  //       });
  //       this.openRepairProcess();
  //     }, error => {
  //       if (error.status === 6041 && valueCode === 2) {
  //         this.openRepairProcess();
  //       }
  //     });
  //   } else {
  //     this.swalAlertService.openFailToast('Không có thông tin khách hàng');
  //   }
  // }

  storeQuotation() {
    if (this.form.invalid) {
      this.swalAlertService.openWarningToast('Bạn chưa nhập đủ thông tin trường băt buộc hoặc giá trị nhập không hợp lệ');
      return;
    }
    if (!this.form.getRawValue().roId) {
      this.swalAlertService.openWarningToast('Chưa có báo giá');
      return;
    }
    this.storageModal.open();
  }

  findInvalidControls() {
    const listInvalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        listInvalid.push(name);
      }
    }
    return listInvalid;
  }

  private getChangedProperties(form): string[] {
    const changedProperties = [];

    Object.keys(this.form.controls).forEach((name) => {
      const currentControl = this.form.controls[name];
      if (currentControl.dirty) {
        changedProperties.push(name);
      }
    });

    return changedProperties;
  }

  createQuotation(status: string, openPrint = true) {
    const loadingComponent = document.querySelector('#loading-component');
    if (loadingComponent) {
      this.swalAlertService.openWarningToast('Đang có tiến trình chưa hoàn thành. Vui lòng đợi trong giây lát');
      return;
    }
    this.isSubmit = true;
    localStorage.removeItem(this.form.getRawValue().registerno);
    const listInvalid = this.findInvalidControls();
    let stringNotify = 'Bạn đã sai hoặc thiếu thông tin trường: ';
    if (listInvalid && listInvalid.length > 0) {
      // tslint:disable-next-line:forin
      for (const field in listInvalid) {

        stringNotify = stringNotify + this.mapCodeByName[`${listInvalid[field]}`] + ', ';
      }
      stringNotify = stringNotify.slice(0, stringNotify.length - 2);
    }
    if (this.form.invalid) {
      this.swalAlertService.openWarningToast(stringNotify + ' .Chú ý dữ liệu trong các FORM đang đóng.');
      return;
    }
    if (new Date(this.form.get('carDeliveryTime').value).getTime() < new Date().getTime()) {
      this.swalAlertService.openWarningToast('DK giao xe phải lớn hơn thời gian hiện tại');
      return;
    }
    if (this.customerInfo) {
      const dataSave = {
        pds: this.form.get('pds').value ? 'Y' : 'N',
        estimateTime: this.form.value.typeEstimateTime === 1
          ? Number(this.form.getRawValue().estimateTime) * Times.hourMin : this.form.getRawValue().typeEstimateTime === 2
            ? Number(this.form.getRawValue().estimateTime) * Times.dayMin : Number(this.form.getRawValue().estimateTime),
        // appId: this.form.getRawValue().appointmentId,
        appId: this.appointmentId,
        roIdDel: this.form.get('roId').value,
        // campaignOpemDlrId: this.form.value.campaign ? this.form.value.campaign.campaignOpemDlrId : null,
        campaignId: this.form.value.campaignId ? this.form.value.campaignId : null,
        cusVsId: this.customerInfo.cusVisit ? this.customerInfo.cusVisit.id : null,
        cusId: this.customerInfo.customer ? this.customerInfo.customer.id : null,
        vehicleId: this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null,
        jobList: [],
        partList: this.form.getRawValue().partList
          ? this.form.getRawValue().partList.map(part => {
            return Object.assign({}, part, {
              quotationprintVersion: part.quotationprintVersion ? part.quotationprintVersion
                : (!!openPrint ? Number(this.form.getRawValue().quotationprint || 0) + 1 : null)
            });
          })
          : [],
        srvBRecinr: {
          inrComId: this.form.get('inrComId').value,
          inrEmpId: this.form.get('inrEmpId').value
        },
        srvBCusVisit: {
          calltime: this.form.get('calltime').value
        },
        srvBRepairOrder: {
          isCarWash: this.form.get('isCarWash').value ? 'Y' : 'N',
          isCusWait: this.form.get('isCusWait').value ? 'Y' : 'N',
          isTakeParts: this.form.get('isTakeParts').value ? 'Y' : 'N',
          isPriority: this.form.get('isPriority').value ? 'Y' : 'N',
          isEm: this.form.get('isEm').value ? 'Y' : 'N',
          qcLevel: this.form.get('qcLevel').value,
          attribute1: null,
          attribute2: null,
          checkTlccpt: null,
          closeroDate: null,
          createDate: this.form.get('date').value,
          carDeliveryTime: this.form.get('carDeliveryTime').value,
          createdBy: null,
          cusvsId: null,
          deleteflag: null,
          dlrId: null,
          freePm: this.form.get('rctypeId').value,
          gid: null,
          id: this.form.get('roId').value,
          inrstate: null,
          insertQversion: null,
          kcalc: null,
          km: this.form.get('km').value,
          modifiedBy: null,
          modifyDate: null,
          notes: null,
          openroDate: null,
          quotationprint: this.form.get('quotationprint').value,
          rctypeId: this.form.get('rctypeId').value,
          readjustFixnote: this.form.get('readjustFixnote').value,
          readjustReason: this.form.get('readjustReason').value,
          readjustRoid: this.form.get('readjustRoid').value,
          repairorderno: this.form.getRawValue().roNo,
          reqdesc: this.form.get('reqdesc').value,
          roChange: null,
          rostate: null,
          rotype: this.form.get('rotype').value,
          testpaperprint: null,
          totalAmount: this.form.get('beforeTaxTotal').value,
          totalDiscount: this.form.get('discountTotal').value,
          totalTaxAmount: this.form.get('totalTaxAmount').value,
          useprogress: null
        }
      };
      if (!dataSave.cusVsId) {
        this.swalAlertService.openWarningToast('Báo giá chưa link được Customer Visit bạn vui lòng Refresh lại báo giá');
        return;
      }
      if (dataSave.srvBRepairOrder.rotype === '1') {
        dataSave.jobList = this.form.getRawValue().jobListDs
          ? this.form.getRawValue().jobListDs.map(job => {
            return Object.assign({}, job,
              {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : (!!openPrint ? job.version : null)});
          })
          : [];
      } else {
        dataSave.jobList = this.form.getRawValue().jobListScc
          ? this.form.getRawValue().jobListScc.map(job => {
            return Object.assign({}, job,
              {quotationprintVersion: job.quotationprintVersion ? job.quotationprintVersion : (!!openPrint ? job.version : null)});
          })
          : [];
      }
      if (!(dataSave.jobList && dataSave.jobList.length)) {
        this.swalAlertService.openWarningToast('Bạn chưa có công việc sửa chữa');
        return;
      } else {
        dataSave.jobList.map(it => {
          it.amount = Number(it.costs);
          return it;
        });
      }
      if (Number(this.form.getRawValue().estimateTime) === 0) {
        this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
        return;
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < dataSave.jobList.length; i++) {
        if ((!dataSave.jobList[i].jobsname || dataSave.jobList[i].jobsname === '') && !dataSave.jobList[i].subletTypeCode) {
          this.swalAlertService.openWarningToast(`Bạn chưa nhập đủ thông tin công việc sửa chữa TÊN CV hoặc THÀNH TIỀN ở dòng ${i + 1}`);
          return;
        }

        if (Number(dataSave.jobList[i].costs) < Number(dataSave.jobList[i].discount)) {
          this.swalAlertService.openWarningToast(`Công việc GIẢM GIÁ lớn hơn THÀNH TIỀN ở dòng ${i + 1}`);
          return;
        }

        if (Number(dataSave.jobList[i].discount) < 0) {
          this.swalAlertService.openWarningToast(`Công việc GIẢM GIÁ không thể âm ở dòng ${i + 1}`);
          return;
        }
        if (!this.form.value.pds && (!dataSave.jobList[i].costs || Number(dataSave.jobList[i].costs) === 0)) {
          this.swalAlertService.openWarningToast(`Chưa có THÀNH TIỀN công việc ở dòng ${i + 1}`);
          return;
        }
        if ((!dataSave.jobList[i].bpType || [null, 1].includes(Number(dataSave.jobList[i].bpType))) && (this.form.getRawValue().rotype === '1')
          && !dataSave.jobList[i].subletTypeCode) {
          this.swalAlertService.openWarningToast(`Chưa có NHÓM CÔNG VIỆC trong loại công việc đồng sơn ở dòng ${i + 1}`);
          return;
        }
      }
      if (dataSave.partList) {
        for (let i = 0; i < dataSave.partList.length; i++) {
          if ((!dataSave.partList[i].partsCode && dataSave.partList[i].qty) || (dataSave.partList[i].partsCode === '' && !(Number(dataSave.partList[i].qty) === 0))
            || (!dataSave.partList[i].qty && dataSave.partList[i].partsCode)
            || ((Number(dataSave.partList[i].qty) === 0) && dataSave.partList[i].partsCode)) {
            this.swalAlertService.openWarningToast(`Bạn chưa nhập đủ thông tin MÃ PT hoặc SL CẦN ở dòng ${i + 1}`);
            return;
          }

          if ((Number(dataSave.partList[i].sellPrice) * Number(dataSave.partList[i].qty)) < Number(dataSave.partList[i].discount) && Number(dataSave.partList[i].qty) > 0) {
            this.swalAlertService.openWarningToast(`Phụ tùng GIẢM GIÁ lớn hơn THÀNH TIỀN ở dòng ${i + 1} khi SỐ LƯỢNG dương`);
            return;
          }

          if (Number(dataSave.partList[i].discount) < 0 && Number(dataSave.partList[i].qty) > 0) {
            this.swalAlertService.openWarningToast(`Phụ tùng GIẢM GIÁ không thể âm ở dòng ${i + 1} khi SỐ LƯỢNG dương`);
            return;
          }
          if ((Number(dataSave.partList[i].sellPrice) * Number(dataSave.partList[i].qty)) > Number(dataSave.partList[i].discount) && Number(dataSave.partList[i].qty) < 0) {
            this.swalAlertService.openWarningToast(`Phụ tùng GIẢM GIÁ nhỏ hơn THÀNH TIỀN ở dòng ${i + 1} khi SỐ LƯỢNG âm`);
            return;
          }

          if (Number(dataSave.partList[i].discount) > 0 && Number(dataSave.partList[i].qty) < 0) {
            this.swalAlertService.openWarningToast(`Phụ tùng GIẢM GIÁ không thể dươmg ở dòng ${i + 1} khi SỐ LƯỢNG âm`);
            return;
          }
          if ((!dataSave.partList[i].partsCode && !dataSave.partList[i].qty) || (dataSave.partList[i].partsCode === '' && Number(dataSave.partList[i].qty) === 0)
            || (!dataSave.partList[i].qty && dataSave.partList[i].partsCode === '') || (Number(dataSave.partList[i].qty) === 0) && !dataSave.partList[i].partsCode) {
            dataSave.partList.splice(i, 1);
          } else {
            dataSave.partList[i].qty = Number(dataSave.partList[i].qty);
            if (dataSave.partList[i].status && +dataSave.partList[i].status < +status || !dataSave.partList[i].status) {
              dataSave.partList[i].status = status;
            }
            dataSave.partList[i].readjust = (dataSave.partList[i].readjust === true) ? 'Y' : 'N';
            let sum = 0;
            let cost = 0;
            let partCode;
            // tslint:disable-next-line:prefer-for-o prefer-for-of
            for (let j = 0; j < dataSave.partList.length; j++) {
              if (dataSave.partList[i].partsCode === dataSave.partList[j].partsCode) {
                // const totalQty = Number(dataSave.partList[j].qty || 0) - Number(dataSave.partList[j].received || 0);
                sum = Math.round((sum + Number(dataSave.partList[j].qty || 0)) * 100) / 100;
                cost += Number(dataSave.partList[j].discount || 0);
                partCode = dataSave.partList[j].partsCode;
              }
              if (sum < 0) {
                this.swalAlertService.openWarningToast(`Tổng số lượng của mã phụ tùng ${partCode} đang nhỏ hơn 0`);
                return;
              }
            }
          }
        }
      }
      const saving = () => {
        this.loadingService.setDisplay(true);
        this.saveQuotation(dataSave, openPrint);
      };
      if (this.campJobs && difference(this.campJobs.map(job => job.rcjId), dataSave.jobList.map(job => job.rcjId)).length) {
        this.confirmService.openConfirmModal('Cảnh báo', 'Không đúng công việc của chiến dịch. Có tiếp tục thay đổi').subscribe(() => {
          saving();
        });
      } else {
        saving();
      }
    } else {
      this.swalAlertService.openFailToast('Không có thông tin khách hàng');
    }
  }

  updateCustomer() {
    const obj = {
      registerNo: null,
      registerno: null,
      vhcType: this.customerInfo.vehicle ? this.customerInfo.vehicle.vhcType : null
    };
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.arrCustomer.length; i++) {
      obj[`${this.arrCustomer[i]}`] = this.form.get(`${this.arrCustomer[i]}`).value;
    }
    obj.registerNo = obj.registerno;
    obj.vhcType = this.customerInfo.vehicle ? this.customerInfo.vehicle.vhcType : null;
    return this.customerApi.updateData(obj);
  }

  saveQuotation(dataSave: any, openPrint = true) {
    forkJoin([
      this.updateCustomer(),
      this.repairOrderApi.createQuotation(dataSave)]).subscribe(val => {
      //reset appointment id
      this.appointmentId = null;
      this.getListRo();
      this.loadingService.setDisplay(false);
      if (dataSave.srvBRepairOrder.rotype === '1') {
        this.arrObjBpRepair = dataSave.jobList;
      } else {
        this.arrObjGeneralRepair = dataSave.jobList;
      }
      this.arrObjPart = dataSave.partList;
      this.form.get('roId').setValue(val[1].srvBRepairOrder.id);
      this.form.get('quotationprint').setValue(val[1].srvBRepairOrder.quotationprint);
      this.form.get('roNo').setValue(val[1].srvBRepairOrder.repairorderno);
      this.form.get('rostate').setValue(val[1].srvBRepairOrder.rostate);
      this.form.get('date').setValue(val[1].srvBRepairOrder ? val[1].srvBRepairOrder.modifyDate
        ? val[1].srvBRepairOrder.modifyDate : val[1].srvBRepairOrder.createDate : null);
      this.form.get('createdBy').setValue(val[1].srvBRepairOrder.createdBy);
      this.form.get('km').updateValueAndValidity();
      const userCreate = this.advisors.find(it => it.userId === val[1].srvBRepairOrder.createdBy);
      this.form.patchValue({
        cvdv: userCreate ? userCreate.empName : ''
      });

      setTimeout(() => {
        this.form.markAsPristine();
      }, 200);
      this.swalAlertService.openSuccessToast('Lưu thành công');
      if (openPrint) {
        this.printQuotation();
      }
    });
  }

  printQuotation() {
    if (!this.form.getRawValue().roId) {
      this.swalAlertService.openWarningToast('Chưa có báo giá');
      return;
    }
    this.reportTypeModal.open(1);
  }

  openRepairHistory() {
    this.repairHistory.open(
      this.form.get('customerId').value, this.form.get('customerDId').value, this.form.get('vehiclesId').value, this.customerInfo
    );
  }

  private patchFormValue() {
    this.form.reset();
    this.form.patchValue({
      dlrNo: !!this.customerInfo ? this.customerInfo.cusVisit ? this.customerInfo.cusVisit.dlrno : null : null,
      roTypeTemp: '2',
      rotype: '2',
      rctypeId: 50,
      typeEstimateTime: 0,
      type: '1',
      provinceId: '',
      districtId: ''
    });
    if (this.customerInfo) {
      this.form.get('appointmentId').setValue(this.customerInfo.appointmentId);
      if (this.customerInfo.booking) {
        this.form.get('appointmentId').setValue(this.customerInfo.booking.appoinmentId);
      }
      if (this.customerInfo.repairOrder) {
        // Lấy thông tin KHSC đối với xe đã có báo giá
        // this.kmBefore = this.customerInfo.repairOrder.km
        this.loadingService.setDisplay(true);
        this.repairPlanApi.repairOrderRoId(this.customerInfo.repairOrder.id).subscribe(res => {
          this.loadingService.setDisplay(false);
          if (res && res.length) {
            this.form.patchValue({
              dkgx: res[0].cardelivery, // DKGX
              openroDate: res[0].repairbegin, // BDSC
              closeroDate: res[0].repairend, // DKKT
              divName: res[0].divName, // Tổ
              wsName: res[0].wsName, // Khoang
              ktv: res[0].empName, // KTV
              ttgx: undefined,
              stateGx: undefined
            });
          }
        });
        this.copyRoNo();
        this.form.patchValue({
          isCusWait: this.customerInfo.repairOrder.isCusWait === 'Y' || null,
          isCarWash: this.customerInfo.repairOrder.isCarWash === 'Y' || null,
          isTakeParts: this.customerInfo.repairOrder.isTakeParts === 'Y' || null,
          isPriority: this.customerInfo.repairOrder.isPriority === 'Y' || null,
          isEm: this.customerInfo.repairOrder.isEm === 'Y' || null,
          qcLevel: this.customerInfo.repairOrder.qcLevel,
          roId: this.customerInfo.repairOrder.id,
          roNo: this.customerInfo.repairOrder ? this.customerInfo.repairOrder.repairorderno : null,
          rotype: this.customerInfo.repairOrder.rotype,
          roTypeTemp: this.customerInfo.repairOrder.rotype,
          rostate: this.customerInfo.repairOrder.rostate,
          km: this.customerInfo.repairOrder.km,
          reqdesc: this.customerInfo.repairOrder.reqdesc,
          rctypeId: this.customerInfo.repairOrder.rctypeId,
          arrivalDate: this.customerInfo.repairOrder.createDate,
          date: this.customerInfo.repairOrder ? this.customerInfo.repairOrder.modifyDate
            ? this.customerInfo.repairOrder.modifyDate : this.customerInfo.repairOrder.createDate : null,
          estimateTime: this.customerInfo.repairOrder.estimateTime,
          carDeliveryTime: this.customerInfo.repairOrder.carDeliveryTime ? this.customerInfo.repairOrder.carDeliveryTime : '',
          startCarWashTime: this.customerInfo.repairOrder.startCarWashTime ? this.dataFormatService.parseTimestampToFullDate(this.customerInfo.repairOrder.startCarWashTime) : '',
          startRepairTime: this.customerInfo.repairOrder.startRepairTime ? this.dataFormatService.parseTimestampToFullDate(this.customerInfo.repairOrder.startRepairTime) : '',
          campaignId: this.customerInfo.repairOrder ? this.customerInfo.repairOrder.campaignId : null
        });
      }
      if (this.customerInfo.vehicle) {
        this.repairOrderApi.getListRo(this.customerInfo.vehicle.id).subscribe(res => {
          this.listRoNo = [];
          if (res) {
            this.listRoNo = res;
            this.listRoNo.map(it => {
              const ro = this.RoState.find(itt => itt.id === it.roState);
              it.roName = ro ? ro.name : '';
              return it;
            });
          }
        });
      }
      if (this.customerInfo.cusVisit) {
        this.form.patchValue({
          cusvsId: this.customerInfo.cusVisit.id,
          pds: (this.customerInfo.cusVisit && this.customerInfo.cusVisit.pds === 'Y') || (this.customerInfo.vehicle && this.customerInfo.vehicle.registerno.indexOf('PDS') === 0)
        });
      }
      if (this.customerInfo.customerD && this.customerInfo.customerD.type && this.customerInfo.customerD.type !== '1') {
        this.form.patchValue({
          customerD: this.customerInfo.customerD.id,
          name: this.customerInfo.customerD.name,
          tel: this.customerInfo.customerD.tel,
          address: this.customerInfo.customerD.address,
          email: this.customerInfo.customerD.email,
          type: this.customerInfo.customerD.type
        });
      } else {
        this.form.patchValue({
          name: this.customerInfo.customer ? this.customerInfo.customer.carownername : null,
          tel: this.customerInfo.customer ? this.customerInfo.customer.carownermobil : null,
          address: this.customerInfo.customer ? this.customerInfo.customer.carowneradd : null,
          email: this.customerInfo.customer ? this.customerInfo.customer.carowneremail : null,
          type: '1'
        });

      }
      if (this.customerInfo.booking) {
        this.form.patchValue({
          reqdesc: this.customerInfo.booking.reqdesc,
          rotype: this.customerInfo.booking.apptype
        });
      }

      this.form.patchValue({
        vehiclesId: this.customerInfo.vehicle ? this.customerInfo.vehicle.id : null,
        customerId: this.customerInfo.customer ? this.customerInfo.customer.id : null,
        registerno: this.customerInfo.vehicle ? this.customerInfo.vehicle.registerno : null,
        vinno: this.customerInfo.vehicle ? this.customerInfo.vehicle.vinno : null,
        quotationprint: this.customerInfo.repairOrder ? this.customerInfo.repairOrder.quotationprint : null,
        cmCode: this.customerInfo.carModel ? this.customerInfo.carModel.cmCode : null,
        cmType: this.customerInfo.carModel ? this.customerInfo.carModel.cmType : null,
        cmName: this.customerInfo.carModel ? this.customerInfo.carModel.cmName : null,
        cmId: this.customerInfo.carModel ? this.customerInfo.carModel.id : null,
        cfId: this.customerInfo.carModel ? this.customerInfo.carModel.cfId : null,
        fullmodel: this.customerInfo.carModel ? this.customerInfo.carModel.doixe : null,
        vccode: this.customerInfo.vehicleColor ? this.customerInfo.vehicleColor.vcCode : null,
        enginetypeId: this.customerInfo.engineType ? this.customerInfo.engineType.id : undefined,
        enginecode: this.customerInfo.engineType ? this.customerInfo.engineType.engineCode : undefined,
        frameno: this.customerInfo.vehicle ? this.customerInfo.vehicle.frameno : null,
        engineno: this.customerInfo.vehicle ? this.customerInfo.vehicle.engineno : null,
        vcId: this.customerInfo.vehicle ? this.customerInfo.vehicle.vcId : null,
        doixe: this.customerInfo.carModel ? this.customerInfo.carModel.doixe : null,
        cusNote: this.customerInfo ? this.customerInfo.cusNote : null,
        calltime: (this.customerInfo.cusVisit && this.customerInfo.cusVisit.calltime !== null) ? this.customerInfo.cusVisit.calltime : 'H'
      });
      this.form.patchValue(this.customerInfo.customer ? this.customerInfo.customer : {});
    }
    // Lưu thông tin sau mỗi 30s
    // this.intervalSaveStorage = setInterval(() => {
    //   if (!this.form.getRawValue().rostate || this.form.getRawValue().rostate === '') {
    //     const data = localStorage.getItem(this.form.getRawValue().registerno);
    //     if (data) {
    //       localStorage.removeItem(this.form.getRawValue().registerno);
    //     }
    //     if (this.form.dirty) {
    //       localStorage.setItem(this.form.getRawValue().registerno, JSON.stringify(this.form.getRawValue()));
    //     }
    //   }
    // }, 30000);
    if (this.decode) {
      this.form.patchValue({
        jti: this.decode.jti
      });
    }
    if (this.customerInfo.repairOrder) {
      const userCreate = this.advisors.find(it => it.userId === this.customerInfo.repairOrder.createdBy);
      this.form.patchValue({
        cvdv: userCreate ? userCreate.empName : ''
      });
      if (this.decode.jti !== this.customerInfo.repairOrder.createdBy && !!this.isAdvisor) {
        this.swalAlertService.openWarningToast(`Báo giá được tạo bởi CVDV: ${userCreate ? userCreate.empName : ''}. Bạn không có quyền chỉnh sửa`);
      } else {
        this.form.enable();
        this.form.get('registerno').disable();
        this.form.get('vinno').disable();
        this.form.get('quotationprint').disable();
        if (Number(this.customerInfo.repairOrder.id) > 1) {
          this.form.get('rotype').disable();
          this.form.get('date').disable();
          this.form.get('rctypeId').disable();
        }
      }

      this.form.patchValue({
        createdBy: this.customerInfo.repairOrder.createdBy
      });
      if (this.decode.jti !== this.customerInfo.repairOrder.createdBy) {
        this.form.disable();
        this.form.get('rostate').enable();
        this.form.get('roId').enable();
      }
    }
    if (this.disableCustomer.includes(this.form.getRawValue().rostate)) {
      this.arrCustomer.forEach(it => this.form.get(it).disable());
    }
    this.patchJobAndPart();
    setTimeout(() => {
      this.form.markAsPristine();
    }, 200);
  }

  copyRoNo() {
    // const selBox = document.createElement('textarea');
    // selBox.style.position = 'fixed';
    // selBox.style.left = '0';
    // selBox.style.top = '0';
    // selBox.style.opacity = '0';
    // selBox.value = this.customerInfo.repairOrder ? this.customerInfo.repairOrder.repairorderno : '';
    // document.body.appendChild(selBox);
    // selBox.focus();
    // selBox.select();
    // document.execCommand('copy');
    //
    //
    // document.body.removeChild(selBox);
  }

  private patchJobAndPart() {
    this.arrObjGeneralRepair = [];
    this.arrObjBpRepair = [];
    this.arrObjPart = [];
    if (!this.customerInfo) {
      return;
    }
    if (this.customerInfo.repairOrderDetails) {
      // Dán phụ tùng cũ
      this.loadingService.setDisplay(true);
      this.partsInfoManagementApi.getPartListOfQuotation(this.customerInfo.repairOrder.id).subscribe(res => {
        const onHandPart = res || [];
        this.arrObjPart = this.customerInfo.repairOrderDetails.quotationPartList.map(part => {
          const data = onHandPart.find(partOnHand => partOnHand.id === part.part.id);
          return Object.assign({}, part.part, part.unit, part.quotationPart,
            {
              discountPercent: (part.quotationPart.discount && part.quotationPart.discount !== 0)
                ? (part.quotationPart.discount / (part.quotationPart.qty * part.quotationPart.sellPrice) * 100).toFixed(2) : 0,
              unit: part.unit ? part.unit.unitName : '',
              onhandQty: onHandPart.length > 0 ? (data ? data.onHandQty : 0) : 0, // SL tồn
              received: onHandPart.length > 0 ? (data && part.quotationPart.qty > 0 ? data.dxQty : 0) : 0// SL nhận
            }
          );
        });
        this.loadingService.setDisplay(false);
      });
      // Dán job cũ
      if (this.customerInfo.repairOrder.rotype === '1') {
        this.arrObjBpRepair = this.customerInfo.repairOrderDetails.quotationJobList.map(job => {
          return Object.assign({}, job.quotationJobDTO, job.srvDRcJobs, {
            discountPercent: (job.quotationJobDTO.discount && job.quotationJobDTO.discount !== 0)
              ? (job.quotationJobDTO.discount / (job.quotationJobDTO.costs) * 100).toFixed(2) : 0,
            status: job.quotationJobDTO.status
          });
        });
      } else {
        this.arrObjGeneralRepair = this.customerInfo.repairOrderDetails.quotationJobList.map(job => {
          return Object.assign({}, job.quotationJobDTO, job.srvDRcJobs, {
            discountPercent: (job.quotationJobDTO.discount && job.quotationJobDTO.discount !== 0)
              ? (job.quotationJobDTO.discount / (job.quotationJobDTO.costs) * 100).toFixed(2) : 0,
            status: job.quotationJobDTO.status
          });
        });
      }
    }
    this.getCampaignTMV();
    // this.getLocalStorage();
  }


  getCampaignTMV() {
    if (this.customerInfo && this.customerInfo.listCampaignId && this.customerInfo.listCampaignId.length > 0) {
      this.campaignApi.getCampaignJobs({
        listCampaignId: this.customerInfo.listCampaignId,
        cmId: this.customerInfo.carModel.id
      }).subscribe(res => {
        this.loadingService.setDisplay(true);
        if (res) {
          this.loadingService.setDisplay(false);
          if (this.form.getRawValue().rostate && Number(this.form.getRawValue().rostate) >= 0) {
            return;
          }
          const data = [];
          if (Number(this.form.getRawValue().rotype) === 2) {
            const dataGeneralRepair = [];
            this.arrObjGeneralRepair.forEach(it => dataGeneralRepair.push(it.jobsname));
            res.forEach(element => {
              if (element.actualJobTime) {
                element.costs = element.actualJobTime * (this.dlrConfig && this.dlrConfig.cost ? this.dlrConfig.cost : 1);
                element.actualtime = element.actualJobTime;
              } else {
                element.costs = element.dealerCost;
                element.actualtime = element.dealerCost / (this.dlrConfig && this.dlrConfig.cost ? this.dlrConfig.cost : 1);
              }
              if (!(dataGeneralRepair.includes(element.jobsname))) {
                element.taxRate = 10;
                data.push(element);
              }
            });
            this.arrObjGeneralRepair = [...this.arrObjGeneralRepair, ...data];
          }
        }
      });
      this.campaignApi.getCampaignParts({
        listCampaignId: this.customerInfo.listCampaignId
      }).subscribe(res => {
        this.loadingService.setDisplay(true);
        if (res) {
          this.loadingService.setDisplay(false);
          if (this.form.getRawValue().rostate && Number(this.form.getRawValue().rostate) >= 0) {
            return;
          }
          const data = [];
          res.forEach(it => {
            const dataArrPart = [];
            this.arrObjPart.forEach(item => dataArrPart.push(item.partsCode));
            if (!dataArrPart.includes(it.partsCode)) {
              data.push(it);
            }
          });
          this.arrObjPart = [...this.arrObjPart, ...data];
        }
      });
    }

  }

  getLocalStorage() {
    const dataChange = JSON.parse(localStorage.getItem('changeInfo' + this.form.getRawValue().registerno));
    if (!this.form.getRawValue().rostate || this.form.getRawValue().rostate === '') {
      let data = JSON.parse(localStorage.getItem(this.form.getRawValue().registerno));
      if (data) {
        this.confirmService.openConfirmModal('Xác nhận', 'Bạn có muốn load lại dữ liệu không ?').subscribe(() => {
          if (dataChange) {
            data = Object.assign({}, data, dataChange);
            localStorage.removeItem('changeInfo' + this.form.getRawValue().registerno);
          }
          this.form.patchValue(data);
          this.arrObjBpRepair = [...this.arrObjBpRepair, ...data.jobListDs || []];
          this.arrObjGeneralRepair = [...this.arrObjGeneralRepair, ...data.jobListScc || []];
          this.arrObjPart = [...this.arrObjPart, ...data.partList || []];
        }, () => {
          return;
        });
      }
    } else {
      if (dataChange) {
        localStorage.removeItem('changeInfo' + this.form.getRawValue().registerno);
      }
      this.form.get('rotype').disable();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      // header
      cusvsId: [null],
      typeEstimateTime: [0],
      vehiclesId: [undefined],
      customerId: [undefined],
      customerDId: [undefined],
      dlrNo: [{value: moment(new Date().setHours(0, 0, 0)).format('YYMMDD'), disabled: true}],
      roNo: [{value: undefined}],
      roId: [undefined],
      date: [{value: new Date(), disabled: true}],
      rostate: [{value: undefined, disabled: true}],
      pds: [undefined],
      roTypeTemp: ['2'],
      rotype: ['2'],
      rctypeId: [null],
      registerno: [undefined, GlobalValidator.required],
      vinno: [undefined],
      quotationprint: [{value: undefined, disabled: true}],

      // cus refer
      name: [undefined, GlobalValidator.required],

      type: ['1'],
      calltime: ['H'],
      tel: [undefined, Validators.compose([GlobalValidator.required])],
      tel2: [undefined],
      address: [undefined],
      email: [undefined],

      // cus
      carownername: [undefined, GlobalValidator.required],
      cusno: [{value: undefined, disabled: true}],
      callingHourOwner: [undefined],
      orgname: [undefined],
      custypeId: [undefined],
      carownermobil: [undefined, Validators.compose([GlobalValidator.required])],
      carownertel: [undefined],
      carownerfax: [undefined],
      carowneremail: [undefined],
      carowneradd: [undefined, GlobalValidator.required],
      provinceId: [''],
      districtId: [''],
      cusNote: [undefined],

      // vehicle
      cmId: [undefined],
      cfId: [undefined],
      cmType: [undefined],
      cmCode: [undefined],
      fullmodel: [undefined],
      vcId: [undefined],
      vccode: [undefined, GlobalValidator.required],
      enginetypeId: [undefined],
      enginecode: [undefined],
      km: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(6)])],
      lastKm: [{value: undefined, disabled: true}],
      lastKmDate: [{value: undefined, disabled: true}],
      frameno: [undefined],
      engineno: [undefined],
      cmName: [{value: undefined, disabled: true}],
      doixe: [{value: undefined, disabled: true}],

      // Bảo hiểm
      isInr: [false],
      inrComId: [undefined],
      inrEmpId: [undefined],
      inrEmpName: [undefined],
      inrEmpPhone: [undefined],

      reqdesc: [undefined, GlobalValidator.required],

      // Kế hoạch sửa chữa
      cvdv: [{value: undefined, disabled: true}],
      estimateTime: [undefined, Validators.compose([GlobalValidator.floatNumberFormat])],
      carDeliveryTime: [undefined, GlobalValidator.required],

      startRepairTime: [undefined],
      startCarWashTime: [undefined],

      beforeTaxWork: [undefined],
      discountTotalWork: [undefined],
      taxTotalWork: [undefined],
      // total:work

      notes: [undefined],
      beforeTaxTotal: [undefined],
      discountTotal: [undefined],
      totalTaxAmount: [undefined],
      total: [undefined],

      jobListScc: [undefined],
      jobListDs: [undefined],
      partList: [undefined],

      // fix
      isFix: [false],
      readjustFixnote: [undefined],
      readjustReason: [undefined],
      readjustRoid: [undefined],

      arrivalDate: [undefined],
      // appointment
      appointmentId: [undefined],

      // campaign
      campaignId: [undefined],
      groupJob: [undefined],
      packageJob: [undefined],


      isCarWash: [undefined],
      isCusWait: [undefined],
      isTakeParts: [undefined],
      isPriority: [undefined],
      isEm: [undefined],
      qcLevel: [1],
      jti: [null],
      createdBy: [null]
    });

    // tslint:disable-next-line:no-shadowed-variable
    this.form.get('cmType').valueChanges.subscribe(type => {
      if (type || type === 0) {
        this.carModelApi.getByCarFamilyType(type).subscribe((cmListByType) => {
          // @ts-ignore
          this.cmListByType = uniqBy(cmListByType, val => val.cmName) || [];
        });
      } else {
        this.cmListByType = [];
      }
    });
    this.form.get('jobListDs').valueChanges.subscribe(val => {
      if (val && !this.form.get('roNo').value && !this.form.get('rostate').value) {
        let totalActualTime = 0;
        val.forEach(it => totalActualTime += Number(it && it.actualtime ? it.actualtime : 0));
        this.form.patchValue({
          estimateTime: Math.round(totalActualTime * 60)
        });
      }
    });
    this.form.get('roId').valueChanges.subscribe(val => {
      if (val) {
        if (this.form.get('rctypeId').value === 50) {
          this.form.get('rctypeId').disable();
        }
        if (Number(val) > 1) {
          this.form.get('rotype').disable();
          this.form.get('date').disable();
          this.form.get('rctypeId').disable();
        }
      } else {
        this.form.get('rotype').enable();
        this.form.get('rctypeId').enable();
      }
    });
    this.form.get('jobListScc').valueChanges.subscribe(val => {
      if (val && !this.form.get('roNo').value && !this.form.get('rostate').value) {
        let totalActualTime = 0;
        val.forEach(it => totalActualTime += Number(it && it.actualtime ? it.actualtime : 0));
        this.form.patchValue({
          estimateTime: Math.round(totalActualTime * 60)
        });
      }
    });
    this.form.get('rostate').valueChanges.subscribe(val => {
      this.roState = val;
      if (Number(val) >= 2) {
        this.form.get('pds').disable();
      } else {
        this.form.get('pds').enable();
      }
    });
    this.form.get('campaignId').valueChanges.subscribe(val => {
      this.getCampaignMoney(val);
    });
    this.form.get('groupJob').valueChanges.subscribe(val => {
      if (!this.listJobGroup) {
        return;
      }
      this.listJobGroupFilter = val === '0' ? this.listJobGroup : this.listJobGroup.filter(it => it.jobType === Number(val));
    });

  }

  dateFormat(val) {
    return this.dataFormatService.parseTimestampToDate(val);
  }

  lsc() {
    return Number(this.form.getRawValue().rostate) >= 2;
  }

  private fillValue(formValue, roId) {
    const obj = {
      cusId: formValue.customerId,
      cusvsId: formValue.cusvsId,
      roId,
      vehiclesId: formValue.vehiclesId
    };
    this.customerApi.getCustomerDetail(obj).subscribe(res => {
      this.customerInfo = Object.assign({}, this.customerInfo, res);
      this.patchFormValue();
    });
  }

  private resetFormWhenNext() {
    this.arrObjPart = [];
    this.arrObjGeneralRepair = [];
    this.arrObjBpRepair = [];
    this.form.patchValue({
      isFix: false,
      cvdv: null,
      readjustFixnote: undefined,
      readjustReason: undefined,
      readjustRoid: undefined,
      isInr: false,
      inrComId: undefined,
      inrEmpId: undefined,
      inrEmpName: undefined,
      inrEmpPhone: undefined,
      typeEstimateTime: 0,
      roNo: null,
      date: null,
      rostate: null,
      reqdesc: null,
      roId: null,
      rotype: '2',
      roTypeTemp: '2',
      rctypeId: 50,
      openroDate: null,
      closeroDate: null,
      dkgx: null,
      ttgx: null,
      stateGx: null,
      quotationprint: null,
      calltime: 'H',
      isCusWait: null,
      isCarWash: null,
      isTakeParts: null,
      isPriority: null,
      isEm: null,
      qcLevel: null,
      // estimateTime: 0,
      carDeliveryTime: undefined,
      startRepairTime: undefined,
      startCarWashTime: undefined,
      jobListScc: [undefined],
      jobListDs: [undefined],
      partList: [undefined]
    });
    setTimeout(() => {
      this.form.markAsPristine();
    }, 200);
  }

  getPreviousRo() {
    const formValue = this.form.getRawValue();
    this.loadingService.setDisplay(true);
    this.repairOrderApi.getPrevious(formValue.roId, this.customerInfo.cusVisit ? this.customerInfo.cusVisit.id : null).subscribe(val => {
      this.loadingService.setDisplay(false);
      if (!val) {
        if (!this.form.getRawValue().vehiclesId) {
          this.repairOrderApi.findMaxKm(this.form.getRawValue().vehiclesId).subscribe(res => {
            this.kmBefore = (res) ? res : undefined;
          });
        }
        this.resetFormWhenNext();
        return;
      }
      this.kmBefore = undefined;
      this.fillValue(formValue, val);
    });
  }

  getNextRo() {
    const formValue = this.form.getRawValue();
    this.loadingService.setDisplay(true);
    this.repairOrderApi.getNext(formValue.roId, this.customerInfo.cusVisit ? this.customerInfo.cusVisit.id : null).subscribe(val => {
      this.loadingService.setDisplay(false);
      if (!val) {
        this.repairOrderApi.findMaxKm(this.form.getRawValue().vehiclesId).subscribe(res => {
          this.kmBefore = (res) ? res : undefined;
        });
        this.resetFormWhenNext();
        return;
      }
      this.kmBefore = undefined;
      this.fillValue(formValue, val);
    });
  }

  openWorkIncurred() {
    if (this.form.invalid) {
      this.swalAlertService.openWarningToast('Bạn chưa nhập đủ thông tin trường băt buộc hoặc giá trị nhập không hợp lệ');
      return;
    }
    this.workIncurred.open(this.form.get('roId').value);
  }

  addInCurredJob(data) {
    if (this.form.get('rotype').value === '1') {
      this.dsCurredJob = data;
    } else {
      this.sccCurredJob = data;
    }
  }

  // Lấy Phụ tùng khi chọn CV từ Khai báo công việc sửa chung
  findPart(rcJobId) {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.repairJobApi.getRepairPartsByJob(rcJobId, this.form.getRawValue().cmId, this.customerInfo.carFamily.id),
      this.srvDRcJobsApi.getDetailJobs(rcJobId, this.form.getRawValue().cmId)
    ]).subscribe(res => {
      if (res[0] && res[0].length) {
        this.arrObjPart = res[0].map(part => Object.assign({}, part, res[1].listParts.find(obj => obj.id === part.id), {
          partsNameVn: part.partsName,
          unit: part.unitName,
          qty: part.reqQty,
          amount: part.total,
          taxRate: part.tax,
          version: (this.form.getRawValue().quotationprint || 0) + 1,
          notes: part.remark,
          received: 0,
          discountPercent: 0,
          discount: 0
          // onhandQty // Số lượng tồn
        }));
        this.partsInfoManagementApi.getPartInfo4Quotation(this.arrObjPart.map(part => part.partsId))
          .subscribe((resp) => {
            if (resp && resp.length) {
              this.arrObjPart = this.arrObjPart.map(part => Object.assign({}, part, {
                onhandQty: resp.find(obj => obj.id === part.partsId).onHandQty
              }));
            }
          });
      }
      this.loadingService.setDisplay(false);
    });
  }

  onBtnLSC() {
    this.checkFieldNotDirty();
    if (!!this.form.dirty && !!this.checkDirty) {
      this.swalAlertService.openWarningToast('Có dữ liệu thay đổi. Bạn phải in lại báo giá');
      return;
    }
    const partList = this.form.getRawValue().partList;
    for (const part of partList) {
      if (part.pstate === 'N' || part.pstate === undefined) {
        this.swalAlertService.openWarningToast('Bạn phải in LXPT trước khi in LSC');
        return;
      }
    }

    const listPartNotQuotation = (this.form.value.partList) ? (this.form.value.partList).filter(it => !it.quotationprintVersion || it.quotationprintVersion < 1) : [];
    const listJobDsNotQuotation = (this.form.value.jobListDs && this.form.value.jobListDs.length > 0)
      ? (this.form.value.jobListDs).filter(it => it && (!it.quotationprintVersion || (it.quotationprintVersion && it.quotationprintVersion < 1)
        || !it.hasOwnProperty('quotationprintVersion'))) : [];
    const listJobSccNotQuotation = (this.form.value.jobListScc && this.form.value.jobListScc.length > 0)
      ? (this.form.value.jobListScc).filter(it => it && (!it.quotationprintVersion || (it.quotationprintVersion && it.quotationprintVersion < 1)
        || !it.hasOwnProperty('quotationprintVersion'))) : [];
    if (listPartNotQuotation.length > 0 || listJobDsNotQuotation.length > 0 || listJobSccNotQuotation.length > 0) {
      this.swalAlertService.openWarningToast('Vẫn còn phụ tùng hoặc công việc chưa báo giá');
      return;
    }
    this.isSubmit = true;
    const listInvalid = this.findInvalidControls();
    let stringNotify = 'Bạn đã sai hoặc thiếu thông tin trường: ';
    if (listInvalid && listInvalid.length > 0) {
      // tslint:disable-next-line:forin
      for (const field in listInvalid) {
        stringNotify = stringNotify + this.mapCodeByName[`${listInvalid[field]}`] + ', ';
      }
      stringNotify = stringNotify.slice(0, stringNotify.length - 2);
    }
    // const pds = this.form.get('pds').value ? 'Y' : 'N';
    // if (this.customerInfo && this.customerInfo.inGate !== 'Y' && pds !== 'Y') {
    //   this.swalAlertService.openWarningToast('Xe chưa vào cổng. Bạn không thể in lệnh sửa chữa');
    //   return;
    // }
    if (!this.checkKmAndQc()) {
      return;
    }
    if (this.form.invalid) {
      this.swalAlertService.openWarningToast(stringNotify + ' .Chú ý dữ liệu trong các FORM: Thông tin khách hàng và thông tin xe...');
      return;
    }
    if (Number(this.form.getRawValue().estimateTime) === 0) {
      this.swalAlertService.openWarningToast('Bạn phải nhâp TGSC trong kế hoạch công việc');
    } else {
      this.reportTypeModal.open(3);
    }
  }

  onBtnLXPT() {
    this.checkFieldNotDirty();
    if (!!this.form.dirty && !!this.checkDirty) {
      this.swalAlertService.openWarningToast('Có dữ liệu thay đổi. Bạn phải in lại báo giá');
      return;
    }
    const listPartNotQuotation = (this.form.value.partList) ? (this.form.value.partList).filter(it => !it.quotationprintVersion || it.quotationprintVersion < 1) : [];
    const listJobDsNotQuotation = (this.form.value.jobListDs && this.form.value.jobListDs.length > 0)
      ? (this.form.value.jobListDs).filter(it => it && (!it.quotationprintVersion || (it.quotationprintVersion && it.quotationprintVersion < 1)
        || !it.hasOwnProperty('quotationprintVersion'))) : [];
    const listJobSccNotQuotation = (this.form.value.jobListScc && this.form.value.jobListScc.length > 0)
      ? (this.form.value.jobListScc).filter(it => it && (!it.quotationprintVersion || (it.quotationprintVersion && it.quotationprintVersion < 1)
        || !it.hasOwnProperty('quotationprintVersion'))) : [];
    if (listPartNotQuotation.length > 0 || listJobDsNotQuotation.length > 0 || listJobSccNotQuotation.length > 0) {
      this.swalAlertService.openWarningToast('Vẫn còn phụ tùng hoặc công việc chưa báo giá');
      return;
    }
    this.reportTypeModal.open(2);
  }

  checkFieldNotDirty() {
    const arrFieldDirty = this.getChangedProperties(this.form);
    this.checkDirty = false;
    const size = arrFieldDirty.length;
    for (let i = 0; i < size; i++) {
      if (!this.arrNotCheckDirty.includes(arrFieldDirty[i])) {
        this.checkDirty = true;
        return;
      }
    }
  }

  downloadReport(event) {
    switch (event.type) {
      case 1:
        this.repairOrderApi.printQuotation({
          extension: event.extension,
          customersId: this.form.get('customerId').value,
          customerDId: this.form.get('customerDId').value,
          vehiclesId: this.form.get('vehiclesId').value,
          roId: this.form.get('roId').value
        }).subscribe(data => {
          if (data) {
            this.downloadService.downloadFile(data);
          }
          this.loadingService.setDisplay(false);
        });
        break;
      case 2:
        this.printLXPT(event.extension);
        break;
      case 3:
        this.printLSC(event.extension);
        break;
      case 5:
        this.printInQT(event.extension);
        break;
      default:
        break;
    }
  }

  onSelectRo() {
    const val = this.form.value.roId;
    if (!this.isAdvisor) {
      this.swalAlertService.openWarningToast('Bạn không phải CVDV nên không được phép tạo báo giá');
    }
    if (!val) {
      if (![null, ''].includes(this.form.getRawValue().vehiclesId)) {
        this.repairOrderApi.findMaxKm(this.form.getRawValue().vehiclesId).subscribe(res => {
          this.kmBefore = (res) ? res : undefined;
        });
      }
      this.firstFocus.nativeElement.focus();
      this.form.enable();
      this.form.get('registerno').disable();
      this.form.get('vinno').disable();
      this.form.get('quotationprint').disable();
      this.resetFormWhenNext();
      // this.getLocalStorage();
    } else {
      const ro = this.listRoNo.find(it => it.roId === val);
      const formValue = this.form.getRawValue();
      if (ro) {
        this.fillValue(formValue, ro.roId);
      }
    }
  }

  getJobGroupJobType() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobGroupJobType).subscribe(res => {
      this.listJobGroupJobType = res ? res : [];
    });
  }

  getJobType() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobType).subscribe(res => {
      this.listJobType = res ? res : [];
    });
  }

  openRepairProcess() {
    if (this.form.value.rotype === '2' || this.form.value.roTypeTemp === '2') {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.generalRepairProgress
      });
    }
  }

  onPrint(obj) {
    this.mrsTmssRoDTO = obj;
    this.reportTypeModal.open(5);
  }

  public deleteClickedRow(): void {
    if (clickedRow) {
      clickedRow.params.api.updateRowData({remove: [clickedRow.selectedNode.data]});
    }
  }

  // Tự động loại bỏ khoảng trắng trước và sau chuỗi
  onFocusOut(event) {
    event.target.value = event.target.value.trim();
  }
}
