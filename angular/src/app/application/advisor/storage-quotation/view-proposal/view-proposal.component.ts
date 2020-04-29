import {
  Component, Input, ViewChild, Output,
  EventEmitter, ChangeDetectorRef, OnChanges, ViewRef, OnInit
} from '@angular/core';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {forkJoin} from 'rxjs';
import {CarModelApi} from '../../../../api/common-api/car-model.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {RepairPlanApi} from '../../../../api/repair-plan/repair-plan.api';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {RoStateOfProposal} from '../../../../core/constains/ro-state';
import {AppoinmentApi} from '../../../../api/appoinment/appoinment.api';
import {CampaignManagementApi} from '../../../../api/master-data/warranty/campaign-management.api';
import {state} from '../../../../core/constains/ro-state';
import {SrvDRcJobsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {RepairJobApi} from '../../../../api/common-api/repair-job.api';
import {invalid} from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.scss']
})
export class ViewProposalComponent implements OnChanges, OnInit {
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
  @ViewChild('workNeedFastModal', {static: false}) workNeedFastModal;
  @ViewChild('storageModal', {static: false}) storageModal;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  campaignMoney = 0;
  kmBefore;
  RoState = RoStateOfProposal;
  State = state;
  form: FormGroup;
  repairMoney: MoneyStatusModel;
  partMoney: MoneyStatusModel;
  isRefresh: boolean;
  rcTypes: Array<RcTypeModel>;
  isSubmit: boolean;
  arrObjPart;
  arrObjGeneralRepair;
  arrObjBpRepair;
  cmListByType;
  isVisible = false;
  dsCurredJob;
  sccCurredJob;
  roState;
  timeStartComponent;
  listCampaign;
  listJobGroup;
  listJobGroupFilter;
  dataParts: any;
  listJobGroupJobType;
  partJobGroup = [];
  generalJobGroup = [];
  listJobType;
  time = new Date().getTime();
  campJobs: Array<any>;
  claimVehicleOld = 'BH xe cũ';

  screenHeight: number;
  listRoNo = [];

  onResize() {
    this.screenHeight = window.innerHeight - 180;
  }

  constructor(private formBuilder: FormBuilder,
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
  ) {
    setTimeout(() => {
      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, 100);
  }

  ngOnInit() {
    this.refreshInfo();
  }

  ngOnChanges() {
    this.refreshInfo();
  }

  refreshInfo() {
    this.buildForm();
    if (this.carInformation) {
      const obj = {
        cusId: this.carInformation.cusId,
        cusvsId: this.carInformation.cusvsId,
        roId: this.carInformation.id,
        vehiclesId: this.carInformation.vhcId
      };
      this.customerApi.getCustomerDetail(obj).subscribe(res => {
        this.getRcType();
        this.customerInfo = res;
        this.getCampaignByCar(res);
        this.getJobGroup();
        this.form.patchValue(this.carInformation);
        this.form.patchValue({
          rctypeId: res.repairOrder.rctypeId,
          roNo: res.repairOrder.repairorderno,
          dlrNo: res.cusVisit.dlrno,
          cmName: res.carModel.cmName,
          quotationprint: this.carInformation.version,
          rostate: this.carInformation.rostate
        });
        this.arrObjPart = [];
        this.arrObjGeneralRepair = [];
        this.arrObjBpRepair = [];

        if (res.repairOrderDetails) {
          res.repairOrderDetails.quotationPartList.forEach(it => {
            this.arrObjPart.push(Object.assign(it.part, it.unit, it.quotationPart, {
              discountPercent: (it.quotationPart.discount / (it.quotationPart.qty * it.quotationPart.sellPrice) * 100).toFixed(2)
            }));
          });

          if (res.repairOrder.rotype === '1') {
            this.arrObjBpRepair = res.repairOrderDetails.quotationJobList.map(job => {
              return Object.assign({}, job.srvBQuotationJobs, job.srvDRcJobs, {
                discountPercent: !!job.srvBQuotationJobs.discount ? (job.srvBQuotationJobs.discount / (job.srvBQuotationJobs.costs) * 100).toFixed(2) : 0
              });
            });
          } else {
            this.arrObjGeneralRepair = res.repairOrderDetails.quotationJobList.map(job => {
              return Object.assign({}, job.srvBQuotationJobs, job.srvDRcJobs, {
                discountPercent: (job.srvBQuotationJobs && job.srvBQuotationJobs.discount || 0 / (job.srvBQuotationJobs && job.srvBQuotationJobs.costs) * 100).toFixed(2)
              });
            });
          }

        }
      });
    }
  }

  getCampaignByCar(customer) {
    const obj = {
      cmName: customer && customer.carModel ? customer.carModel.cmName : '',
      modelName: customer && customer.carModel ? customer.carModel.doixe : ''

    };
    this.partsInfoManagementApi.getCampaignByCar(obj).subscribe(res => {
      this.listCampaign = res ? res : [];
      this.listCampaign.unshift({campaignDlrId: null, campaignDlrName: ''});
    });
  }

  getJobGroup() {
    const obj = {
      cmId: this.customerInfo.carModel ? this.customerInfo.carModel.id : null,
      cfId: this.customerInfo.carModel ? this.customerInfo.carModel.cfId : null,
      deleteFlag: 'N'

    };
    this.repairJobApi.searchJobsGroup(obj).subscribe(res => {
      this.listJobGroup = res ? res : [];
      this.listJobGroup.unshift({id: null, gjName: ''});
      this.listJobGroupFilter = this.listJobGroup;
    });
  }

  changeSelectJobGroup() {
    if (!this.form.value.packageJob) {
      if (this.partJobGroup) {
        const data = [];
        this.partJobGroup.forEach(it => data.push(it.partsCode));
        this.arrObjPart = this.arrObjPart.filter(it => !data.includes(it.partsCode));
      }
      if (this.generalJobGroup) {
        const data = [];
        this.generalJobGroup.forEach(it => data.push(it.rccode));
        this.arrObjGeneralRepair = this.arrObjGeneralRepair.filter(it => !data.includes(it.rccode));
      }
      return;
    }
    const obj = {
      cmId: this.customerInfo.carModel ? this.customerInfo.carModel.id : null,
      cfId: this.customerInfo.carModel ? this.customerInfo.carModel.cfId : null,
      id: this.form.value.packageJob
    };
    this.repairJobApi.getJobsGroupQuotation(obj).subscribe(res => {
      if (this.partJobGroup) {
        this.partJobGroup.map(it => it.id);
        this.arrObjPart = this.arrObjPart.filter(it => !this.partJobGroup.includes(it.id));
      }
      if (this.generalJobGroup) {
        this.generalJobGroup.map(it => it.id);
        this.arrObjGeneralRepair = this.arrObjGeneralRepair.filter(it => !this.generalJobGroup.includes(it.id));
      }
      this.partJobGroup = [];
      this.generalJobGroup = [];
      if (res) {
        res.map(it => it.listPartsDetail.forEach(item => this.partJobGroup.push(item)));
        this.generalJobGroup = res.map(it => {
          it.jobsname = it.rcname;
          it.timework = it.jobtime;
          it.actualtime = it.actualJobTime;
          it.taxRate = 0;
          it.costs = it.cost;
          delete it.listPartsDetail;
          return it;
        });
      }
      this.partJobGroup.map(it => {
        it.partsNameVn = it.partsName;
        it.qty = it.amount;
        it.amount = it.payment;
        it.taxRate = 0;
        return it;
      });
      this.arrObjPart = [...this.arrObjPart, ...this.partJobGroup];
      this.arrObjGeneralRepair = [...this.arrObjGeneralRepair, ...this.generalJobGroup];
    });
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
    this.getCampaignMoney(this.form.value.campaign);
  }

  getPartMoney(val: MoneyStatusModel) {
    this.partMoney = val;
    this.getCampaignMoney(this.form.value.campaign);
  }

  getCampaignMoney(val) {
    if (val && val.campaignOpemDlrId) {
      const totalMoney = Number(this.repairMoney ? this.repairMoney.beforeTax : 0) + Number(this.partMoney ? this.partMoney.beforeTax : 0);
      this.campaignMoney = Number(val.discountType) === 0 ? totalMoney * (val.percentDiscount) / 100 : totalMoney - (val.priceDiscount);
    } else {
      this.campaignMoney = 0;
    }
  }

  get notExistRepairMoney() {
    return !this.repairMoney || (this.repairMoney && this.repairMoney.total === 0 && this.repairMoney.beforeTax === 0);
  }

  changeType(val) {
    this.arrObjPart = [];
    this.arrObjGeneralRepair = [];
    this.arrObjBpRepair = [];
    const type = val.substr(3);
    if (!this.notExistRepairMoney) {
      this.swalAlertService.openWarningToast('Công việc đã tồn tại sẽ bị xóa khi bạn chuyển loại công việc');
      this.form.patchValue({roTypeTemp: type === '2' ? '1' : '2'});
      return;
    }
    this.form.patchValue({
      roType: type,
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

  private patchFormValue() {
    this.form.reset();
    this.form.patchValue({
      dlrNo: this.customerInfo && this.customerInfo.cusVisit ? this.customerInfo.cusVisit.dlrno : null,
      roTypeTemp: '2',
      roType: '2',
      rctypeId: 50,
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
        this.form.patchValue({
          isCusWait: this.customerInfo.repairOrder.isCusWait === 'Y' || null,
          isCarWash: this.customerInfo.repairOrder.isCarWash === 'Y' || null,
          isTakeParts: this.customerInfo.repairOrder.isTakeParts === 'Y' || null,
          isPriority: this.customerInfo.repairOrder.isPriority === 'Y' || null,
          qcLevel: this.customerInfo.repairOrder.qcLevel,
          roId: this.customerInfo.repairOrder.id,
          roNo: this.customerInfo.repairOrder ? this.customerInfo.repairOrder.repairorderno : null,
          roType: this.customerInfo.repairOrder.rotype,
          rostate: this.customerInfo.repairOrder.rostate,
          km: this.customerInfo.repairOrder.km,
          reqdesc: this.customerInfo.repairOrder.reqdesc,
          rctypeId: this.customerInfo.repairOrder.rctypeId,
          arrivalDate: this.customerInfo.repairOrder.createDate,
          typeEstimateTime: 0,
          estimateTime: this.customerInfo.repairOrder.estimateTime,
          carDeliveryTime: this.customerInfo.repairOrder.carDeliveryTime ? this.dataFormatService.parseTimestampToFullDate(this.customerInfo.repairOrder.carDeliveryTime) : '',
          startCarWashTime: this.customerInfo.repairOrder.startCarWashTime ? this.dataFormatService.parseTimestampToFullDate(this.customerInfo.repairOrder.startCarWashTime) : '',
          startRepairTime: this.customerInfo.repairOrder.startRepairTime ? this.dataFormatService.parseTimestampToFullDate(this.customerInfo.repairOrder.startRepairTime) : ''

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
      if (this.customerInfo.customer) {
        this.form.patchValue(this.customerInfo.customer);
      }
      if (this.customerInfo.cusVisit) {
        this.form.patchValue({
          cusvsId: this.customerInfo.cusVisit.id
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
          roType: this.customerInfo.booking.apptype
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
        fullmodel: this.customerInfo.carModel ? this.customerInfo.carModel.doixe : null,
        vccode: this.customerInfo.vehicleColor ? this.customerInfo.vehicleColor.vcCode : null,
        enginetypeId: this.customerInfo.engineType ? this.customerInfo.engineType.id : undefined,
        enginecode: this.customerInfo.engineType ? this.customerInfo.engineType.engineCode : undefined,
        frameno: this.customerInfo.vehicle ? this.customerInfo.vehicle.frameno : null,
        engineno: this.customerInfo.vehicle ? this.customerInfo.vehicle.engineno : null,
        cmId: this.customerInfo.vehicle ? this.customerInfo.vehicle.cmId : null,
        doixe: this.customerInfo.carModel ? this.customerInfo.carModel.doixe : null,
        date: this.customerInfo.cusVisit ? this.customerInfo.cusVisit.createDate : null,
        cusNote: this.customerInfo.customer ? this.customerInfo.customer.cusNote : null,
        calltime: (this.customerInfo.cusVisit && this.customerInfo.cusVisit.calltime !== null) ? this.customerInfo.cusVisit.calltime : 'H'
      });
    }
    this.cusInfoOfProposal.getDistricts(this.form.getRawValue().provinceId ? this.form.getRawValue().provinceId : null);
    this.patchJobAndPart();
  }

  private patchJobAndPart() {
    this.arrObjGeneralRepair = [];
    this.arrObjBpRepair = [];
    this.arrObjPart = [];
    if (this.customerInfo.repairOrderDetails) {
      // Dán phụ tùng cũ
      this.loadingService.setDisplay(true);
      this.partsInfoManagementApi.getPartListOfQuotation(this.customerInfo.repairOrder.id).subscribe(res => {
        const onHandPart = res || [];
        this.arrObjPart = this.customerInfo.repairOrderDetails.quotationPartList.map(part => {
          return Object.assign({}, part.part, part.unit, part.quotationPart,
            {
              discountPercent: (part.quotationPart.discount && part.quotationPart.discount !== 0)
                ? (part.quotationPart.discount / (part.quotationPart.qty * part.quotationPart.sellPrice) * 100).toFixed(2) : 0,
              unit: part.unit.unitName,
              onhandQty: onHandPart.find(partOnHand => partOnHand.id === part.part.id) ? onHandPart.find(partOnHand => partOnHand.id === part.part.id).onHandQty : 0, // SL tồn
              received: onHandPart.find(partOnHand => partOnHand.id === part.part.id) ? onHandPart.find(partOnHand => partOnHand.id === part.part.id).dxQty : 0 // SL nhận
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
              ? (job.quotationJobDTO.discount / (job.quotationJobDTO.costs) * 100).toFixed(2) : 0
          });
        });
      } else {
        this.arrObjGeneralRepair = this.customerInfo.repairOrderDetails.quotationJobList.map(job => {
          return Object.assign({}, job.quotationJobDTO, job.srvDRcJobs, {
            discountPercent: (job.quotationJobDTO.discount && job.quotationJobDTO.discount !== 0)
              ? (job.quotationJobDTO.discount / (job.quotationJobDTO.costs) * 100).toFixed(2) : 0
          });
        });
      }
    } else {
      if (this.customerInfo && this.customerInfo.campId && this.customerInfo.vehicle && this.customerInfo.vehicle.vinno) {
        this.campaignManagementApi.findJobByCampaignAndVinNo(
          this.customerInfo.campId, this.customerInfo.vehicle.vinno, this.customerInfo.vehicle.cmId)
          .subscribe(res => {
            if (res && res.jobs) {
              const listJobs = res.jobs || [];
              const jobs = listJobs.map(job => {
                return Object.assign({}, job, {
                  isCampaign: true,
                  rccode: job.rccode,
                  jobsname: job.rcname,
                  timework: job.jobtime,
                  actualtime: job.actualJobTime,
                  costs: (job.actualJobTime || job.jobtime) * (job.dealerCost || 0),
                  taxRate: 10,
                  discountPercent: 0,
                  version: (this.form.getRawValue().quotationprint || 0) + 1
                });
              });
              this.campJobs = jobs;
              this.arrObjGeneralRepair = jobs.concat(this.arrObjGeneralRepair);
            }
          });
      }
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
      roType: ['2'],
      rctypeId: [null],
      registerno: [undefined, GlobalValidator.required],
      vinno: [undefined],
      quotationprint: [{value: undefined, disabled: true}],

      // cus refer
      name: [undefined, GlobalValidator.required],

      type: ['1'],
      calltime: ['H'],
      tel: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])],
      tel2: [undefined, GlobalValidator.phoneFormat],
      address: [undefined],
      email: [undefined, GlobalValidator.emailFormat],

      // cus
      carownername: [undefined, GlobalValidator.required],
      cusno: [{value: undefined, disabled: true}],
      callingHourOwner: [undefined],
      orgname: [undefined],
      custypeId: [undefined],
      carownermobil: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])],
      carownertel: [undefined, GlobalValidator.phoneFormat],
      carownerfax: [undefined, GlobalValidator.phoneFormat],
      carowneremail: [undefined, GlobalValidator.emailFormat],
      carowneradd: [undefined, GlobalValidator.required],
      provinceId: [''],
      districtId: [''],
      cusNote: [undefined],

      // vehicle
      cmId: [undefined],
      cmType: [undefined],
      cmCode: [undefined],
      fullmodel: [undefined],
      vcId: [undefined],
      vccode: [undefined],
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
      // cvdv: [{value: undefined}],
      estimateTime: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat])],
      carDeliveryTime: [undefined],

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
      campaign: [undefined],
      groupJob: [undefined],
      packageJob: [undefined],


      startRepairTime: [undefined],
      startCarWashTime: [undefined],


      isCarWash: [undefined],
      isCusWait: [undefined],
      isTakeParts: [undefined],
      isPriority: [undefined],
      qcLevel: [undefined]
    });
    this.form.disable();
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
      readjustFixnote: undefined,
      readjustReason: undefined,
      readjustRoid: undefined,
      isInr: false,
      inrComId: undefined,
      inrEmpId: undefined,
      inrEmpName: undefined,
      inrEmpPhone: undefined,
      estimateTime: undefined,
      typeEstimateTime: 0,
      roNo: null,
      date: null,
      rostate: null,
      reqdesc: null,
      roId: null,
      roType: '2',
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
      qcLevel: null
    });
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

  onSelectRo() {
    const val = this.form.value.roId;
    if (!val) {
      this.repairOrderApi.findMaxKm(this.form.value.vehiclesId).subscribe(res => {
        this.kmBefore = (res) ? res : undefined;
      });
      this.resetFormWhenNext();
    } else {
      const ro = this.listRoNo.find(it => it.roId === val);
      const formValue = this.form.getRawValue();
      if (ro) {
        this.fillValue(formValue, ro.roId);
      }
    }
  }


}
