import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LogisticsCompanyService} from '../../../../api/master-data/logistics-company.service';
import {TruckService} from '../../../../api/master-data/truck.service';
import {YardLocationService} from '../../../../api/master-data/yard-location.service';
import {TransportTypeService} from '../../../../api/master-data/transport-type.service';
import {ColorListService} from '../../../../api/master-data/color-list.service';
import {ColorAssignmentService} from '../../../../api/master-data/color-assignment.service';
import {InteriorAssignmentService} from '../../../../api/master-data/interior-assignment.service';
import {YardAreaService} from '../../../../api/master-data/yard-area.service';
import {AudioManagementService} from '../../../../api/master-data/audio-management.service';
import {InsuranceCompanyService} from '../../../../api/master-data/insurance-company.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {DealerAddressDeliveryService} from '../../../../api/master-data/dealer-address-delivery.service';
import {VehicleConditionService} from '../../../../api/daily-sale/vehicle-condition.service';
import {ChangeDataValue} from '../../../../core/constains/cbu-ckd-change-value';
import {MaxLength} from '../../../../core/constains/cbu-ckd-max-length';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {FleetCustomerService} from '../../../../api/fleet-sale/fleet-customer.service';
import {CompareDataService} from '../../../../shared/common-service/compare-data.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cbu-ag-edit-modal',
  templateUrl: './cbu-ag-edit-modal.component.html',
  styleUrls: ['./cbu-ag-edit-modal.component.scss']
})
export class CbuAgEditModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  column;
  editType = 'text';
  sourceData;
  selectedData;
  selectedDate: Date;
  value = [];
  gridField = [];
  displayField: string;
  minDate: Date;
  maxDate: Date;
  cbuCkd;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private compareDataService: CompareDataService,
    private audioManagementService: AudioManagementService,
    private insuranceCompanyService: InsuranceCompanyService,
    private truckService: TruckService,
    private transportTypeService: TransportTypeService,
    private logisticsCompanyService: LogisticsCompanyService,
    private yardLocationService: YardLocationService,
    private yardAreaService: YardAreaService,
    private colorListService: ColorListService,
    private colorAssignmentService: ColorAssignmentService,
    private interiorAssignmentService: InteriorAssignmentService,
    private dealerListService: DealerListService,
    private dealerAddressDeliveryService: DealerAddressDeliveryService,
    private fleetCustomerService: FleetCustomerService,
    private vehicleConditionService: VehicleConditionService
  ) {
  }

  fillDatePicker(selectedDate ?) {
    this.selectedDate = selectedDate ? selectedDate : undefined;
    this.form.patchValue({
      [this.column.field]: this.selectedDate
    });
  }

  open(isCbu, column, selectedData) {
    this.cbuCkd = isCbu ? 'cbu' : 'ckd';
    this.column = column ? column : undefined;
    this.column.maxLength = MaxLength[this.column.field] ? MaxLength[this.column.field] : undefined;
    this.editType = column.editType ? column.editType : 'text';
    this.sourceData = selectedData ? Object.assign({}, selectedData) : undefined;
    this.selectedData = selectedData ? selectedData : undefined;
    if (column.apiCall) {
      if (!isCbu && column.field === 'pdiLoc') {
        // 'TSC location': yard location của YBD
        this.getYardLocationBD();
      } else if (!isCbu && column.field === 'pdiYardAreaName') {
        // 'TSC yard area': yard region của YBD
        this.getYardRegionBD();
        this.column.displayField = 'name';
      } else {
        this[column.apiCall]();
      }
    } else {
      this.value = column.value;
    }
    this.gridField = column.gridField;
    this.displayField = column.displayField;
    this.buildForm();
    switch (column.field) {
      // INTERNAL_TRANSPORTATION Groups
      case 'interAssignDesId':
      // Swapping Groups
      case 'swapAssignDesId':
      case 'swapRouteId':
      case 'swappingDispatchPlan':
      // Dlr_Delivery Groups
      case 'dealer':
      case 'assAlloMonth':
      case 'dlrDispatchPlan':
      case 'dlrLog':
      case 'dlrTruckType':
      case 'dlrTransportWay':
      case 'mlOtherDlrName':
      case 'dlrTransRoute':
      case 'assDealerChangeFromName':
        this.loadingService.setDisplay(true);
        this.vehicleConditionService.checkChooseVehicle(this.selectedData.id)
          .subscribe(() => {
            this.loadingService.setDisplay(false);
            this.modal.show();
          }, err => {
            this.loadingService.setDisplay(false);
            if (err) {
              this.swalAlertService.openFailModal(err.error);
            }
            this.modal.show();
          });
        break;
      // case 'selfDrivingTripRequest':
      //   this.loadingService.setDisplay(true);
      //   this.vehicleConditionService.getMlPlanDeliveryDate(this.cbuCkd, this.selectedData.id)
      //     .subscribe(dateResponse => {
      //       this.loadingService.setDisplay(false);
      //       if (dateResponse) {
      //         const fieldToCheck = isCbu ? 'dlrDispatchPlan' : 'mlPlanDeliveryDate';
      //         this.selectedData[fieldToCheck] = dateResponse;
      //         const sourceDate = new FirefoxDate(dateResponse).newDate();
      //         const conditionDate = sourceDate.getDay() === 0
      //           ? this.compareDataService.calculateDate(sourceDate, -2)
      //           : this.compareDataService.calculateDate(sourceDate, -1);
      //         const currentDate = new Date();
      //         const currentTime = new Date().getHours() + ':' + new Date().getMinutes();
      //
      //         if (this.compareDataService.compareTwoDate(conditionDate, currentDate) < 0
      //           || (this.compareDataService.compareTwoDate(conditionDate, currentDate) === 0
      //             && this.compareDataService.compareTwoTime(currentTime, '8:00') > 0)) {
      //           this.swalAlertService.openFailModal('Đã quá hạn cập nhật');
      //         } else {
      //           this.modal.show();
      //         }
      //       } else {
      //         this.swalAlertService.openFailModal(isCbu ? 'Chưa có thông tin Dlr Dispatch Plan' : 'Chưa có thông tin ML Plan Dispatch Date');
      //       }
      //     });
      //   break;
      default:
        this.modal.show();
        break;
    }
  }

  removeDate() {
    this.form.patchValue({
      [this.column.field]: undefined
    });
  }

  isString() {
    if (this.value) {
      return typeof this.value[0] === 'string';
    }
    return false;
  }

  getData(params) {
    this.value
      ? params.api.setRowData(this.value)
      : params.api.setRowData();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    let val;
    switch (this.column.editType) {
      case 'timePicker':
        val = this.dataFormatService.formatHoursMinutesToNumber(this.form.value.hours, this.form.value.minutes);
        break;
      case 'list':
      case 'select':
        const dataValue = this.form.value[this.column.fieldSubmit]
          ? this.form.value[this.column.fieldSubmit][this.column.displayField] || this.selectedData[this.column.field]
          : null;
        const idValue = this.form.value[this.column.fieldSubmit]
          ? this.form.value[this.column.fieldSubmit].id || this.selectedData[this.column.fieldSubmit]
          : null;
        this.selectedData[this.column.fieldSubmit] = idValue;
        val = dataValue;
        break;
      case 'datePicker':
      case 'monthPicker':
        val = this.dataFormatService.formatDateSale(this.form.value[this.column.field]);
        break;
      default:
        val = Object.values(this.form.value)[0];
        break;
    }
    if (this.column.field === 'payVnAmount' || this.column.field === 'payUsdAmount') {
      this.selectedData[this.column.field] = this.convertStringMoneyToInt(val);
    } else {
      this.selectedData[this.column.field] = val;
    }

    if (ChangeDataValue[this.column.field]) {
      ChangeDataValue[this.column.field].forEach(fieldChange => {
        if (Array.isArray(fieldChange.requestData)) {
          if (typeof fieldChange.requestData[1] === 'string') {
            this[fieldChange.callFunc](fieldChange.field, this.selectedData[fieldChange.requestData[0]], this.selectedData[fieldChange.requestData[1]]);
          } else {
            this[fieldChange.callFunc](fieldChange.field, this.selectedData[fieldChange.requestData[0]], fieldChange.requestData[1]);
          }
        }
        if (!fieldChange.field) {
          this[fieldChange.callFunc](this.column.field);
        }
      });
    }
    this.loadingService.setDisplay(true);
    setTimeout(() => {
      this.close.emit({data: this.selectedData, fieldSubmit: this.column.fieldSubmit || this.column.field});
      this.modal.hide();
    });
  }

  reset() {
    this.form = undefined;
    this.sourceData = undefined;
    this.column = undefined;
    this.editType = 'text';
    this.selectedData = undefined;
    this.selectedDate = undefined;
    this.value = [];
    this.gridField = [];
    this.displayField = undefined;
    this.minDate = undefined;
    this.maxDate = undefined;
  }

  private convertStringMoneyToInt(val) {
    if (val) {
      if (typeof val === 'string') {
        return parseInt(val.replace(/,/g, ''), 10);
      } else {
        return val;
      }
    }
    return null;
  }

  private getAudiosAvailable() {
    this.loadingService.setDisplay(true);
    this.audioManagementService.getAvailableAudios()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getInsuranceCompanies() {
    this.loadingService.setDisplay(true);
    this.insuranceCompanyService.getInsuranceCompanyAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getTrucksAvailable() {
    this.loadingService.setDisplay(true);
    this.truckService.getAllTrucksAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getTransportTypeAvailable() {
    this.loadingService.setDisplay(true);
    this.transportTypeService.getTransportTypeAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getLogisticCompanyAvailable() {
    this.loadingService.setDisplay(true);
    this.logisticsCompanyService.getLogisticCompanyAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardAreaAvailable() {
    this.loadingService.setDisplay(true);
    this.yardAreaService.getAllYardAreaAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardNo() {
    this.loadingService.setDisplay(true);
    this.yardAreaService.getYardNo()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardRegionVP() {
    this.loadingService.setDisplay(true);
    this.yardAreaService.getYardRegionVP()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardRegionBD() {
    this.loadingService.setDisplay(true);
    this.yardAreaService.getYardRegionBD()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardLocationAvailable() {
    this.loadingService.setDisplay(true);
    this.yardLocationService.getAllYardLocationAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardLocationParkingNotNo() {
    this.loadingService.setDisplay(true);
    this.yardLocationService.getYardLocationParkingNotNo()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardLocationVP() {
    this.loadingService.setDisplay(true);
    this.yardLocationService.getYardLocationOfYVP()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getYardLocationBD() {
    this.loadingService.setDisplay(true);
    this.yardLocationService.getYardLocationOfYBD()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getColorsAvailable() {
    this.loadingService.setDisplay(true);
    this.colorListService.getColorsAvailable()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getColorsForCbuCkd() {
    this.loadingService.setDisplay(true);
    this.colorAssignmentService.getColorsForCbuCkd(this.selectedData.graProId)
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getIntColorsForCbuCkd() {
    this.loadingService.setDisplay(true);
    this.interiorAssignmentService.getIntColorsForCbuCkd(this.selectedData.graProId)
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getDealersAvailable() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getAvailableDealers()
      .subscribe(value => {
        // const val
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getDlrDeliverAt() {
    this.loadingService.setDisplay(true);
    this.dealerAddressDeliveryService.getAvailableList(this.selectedData.mlOtherDlr ? this.selectedData.mlOtherDlr : this.selectedData.dealerId)
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private getFleetCustomer() {
    this.loadingService.setDisplay(true);
    this.fleetCustomerService.getAllFleetCustomer()
      .subscribe(value => {
        this.value = value;
        this.patchValueSelectByGrid();
        this.loadingService.setDisplay(false);
      });
  }

  private patchValueSelectByGrid() {
    if (this.column.editType === 'list') {
      this.form.patchValue({
        [this.column.fieldSubmit]:
          {
            id: this.selectedData[this.column.fieldSubmit],
            [this.displayField]: this.selectedData[this.column.field]
          }
      });
    }
    if (this.column.editType === 'select' && this.value) {
      let matchValue;
      if (this.selectedData && this.selectedData[this.column.fieldSubmit]) {
        // matchValue = this.value.unshift({code: '', portOfLoadingId: null});
        matchValue = this.value.find(obj => obj && obj.id === this.selectedData[this.column.fieldSubmit]);
      }
      this.form.patchValue({[this.column.fieldSubmit]: matchValue ? matchValue : this.selectedData[this.column.fieldSubmit]});
    }
  }

  private findMaxDate(dateArr) {
    let maxDate = new Date();
    dateArr.forEach(date => {
      if (date < maxDate) {
        maxDate = date;
      }
    });
    return maxDate;
  }

  private checkCondition() {
    switch (this.column.field) {
      case 'invoiceRequestDate':
        const assAlloMonth = new Date(this.selectedData.assAlloMonth);
        let minDateArr = [new Date(assAlloMonth.getFullYear(), assAlloMonth.getMonth(), 1)];
        if (this.cbuCkd === 'ckd' && this.selectedData.lineOffDate) {
          minDateArr = minDateArr.concat([
            new Date(
              new Date(this.selectedData.lineOffDate).getFullYear(),
              new Date(this.selectedData.lineOffDate).getMonth(),
              (new Date(this.selectedData.lineOffDate).getDate() + 1)
            )
          ]);
        }
        if (this.cbuCkd === 'cbu' && this.selectedData.cbuDocumentDate) {
          minDateArr = minDateArr.concat([
            new Date(
              new Date(this.selectedData.cbuDocumentDate).getFullYear(),
              new Date(this.selectedData.cbuDocumentDate).getMonth(),
              (new Date(this.selectedData.cbuDocumentDate).getDate() + 1)
            )
          ]);
        }
        if (this.compareDataService.compareTwoTime(new Date().getHours() + ':' + new Date().getMinutes(), '10:30') > 0) {
          minDateArr = minDateArr.concat([new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate() + 1))]);
        } else {
          minDateArr = minDateArr.concat([new Date()]);
        }
        this.minDate = this.findMaxDate(minDateArr);
        this.maxDate = new Date(assAlloMonth.getFullYear(), assAlloMonth.getMonth() + 1, 1 - 1);
        break;
      default:
        break;
    }
  }

  private getMaintPlanDate(fieldName, pdiDate, num: number) {
    const val = num === 0 ? new Date() : new Date(new Date(pdiDate).getFullYear(), +new Date(pdiDate).getMonth() + num, new Date(pdiDate).getDate());
    this.selectedData[fieldName] = this.dataFormatService.formatDateSale(val);
  }

  private checkConditionToUpdateDeliveryAt(): boolean {
    const dataValue = this.form.value[this.column.fieldSubmit];
    const fieldSubmitName = this.column.fieldSubmit;
    return dataValue && (
      (fieldSubmitName === 'mlOtherDlr' && dataValue.id !== this.sourceData.mlOtherDlr) ||
      (fieldSubmitName === 'dealerId' && dataValue.id !== this.sourceData.dealerId && !this.sourceData.mlOtherDlr)
    );
  }

  private setDlrDeliveryAt(fieldName) {
    if (this.checkConditionToUpdateDeliveryAt()) {
      this.dealerAddressDeliveryService.getAvailableList(this.selectedData.mlOtherDlr ? this.selectedData.mlOtherDlr : this.selectedData.dealerId)
        .subscribe(res => {
          this.selectedData[fieldName] = res && res.length === 1 ? res[0].address : null;
        });
    } else {
      this.selectedData[fieldName] = this.selectedData.dlrDeliveryAt;
    }
  }

  private setDlrDeliveryAtId(fieldName) {
    if (this.checkConditionToUpdateDeliveryAt()) {
      this.dealerAddressDeliveryService.getAvailableList(this.selectedData.mlOtherDlr ? this.selectedData.mlOtherDlr : this.selectedData.dealerId)
        .subscribe(res => {
          this.selectedData[fieldName] = res && res.length === 1 ? res[0].id : null;
        });
    } else {
      this.selectedData[fieldName] = this.selectedData.dlrDeliveryAtId;
    }
  }

  private getAffectedData(fieldName, fromField, endField) {
    if (fromField && endField) {
      this.selectedData[fieldName] = this.compareDataService.compareTwoDate(new Date(fromField), new Date(endField));
    }
  }

  private getTransRoute(fieldName) {
    const setRoute = (fromRoute, toRoute) => {
      return fromRoute + '->' + toRoute;
    };
    switch (fieldName) {
      case 'interTransRouteId':
        this.selectedData[fieldName] = this.selectedData.arivalPortId && this.selectedData.interAssignDesId
          ? setRoute(this.selectedData.arivalPortId, this.selectedData.interAssignDesId)
          : '';
        break;
      case 'swapRouteId':
        this.selectedData[fieldName] = this.selectedData.interAssignDesId && this.selectedData.swapAssignDesId
          ? setRoute(this.selectedData.interAssignDesId, this.selectedData.swapAssignDesId)
          : '';
        break;
      case 'dlrTransRouteId':
        if (this.selectedData.swapAssignDesId === 'TSC' || this.selectedData.swapAssignDesId === 'TMV') {
          this.selectedData[fieldName] = this.selectedData.dealer
            ? setRoute(this.selectedData.swapAssignDesId, this.selectedData.dealer)
            : '';
        } else {
          this.selectedData[fieldName] = this.selectedData.interAssignDesId
            ? (this.selectedData.dealer ? setRoute(this.selectedData.interAssignDesId, this.selectedData.dealer) : '')
            : (this.selectedData.dealer && this.selectedData.arivalPortId ? setRoute(this.selectedData.arivalPortId, this.selectedData.dealer) : '');
        }
        break;
      default:
        break;
    }
  }

  private getRoute(fieldSourceName) {
    const sourceData = this.selectedData[fieldSourceName] ? this.selectedData[fieldSourceName].split('->') : [];
    switch (fieldSourceName) {
      case 'interTransRouteId':
        this.selectedData.arivalPortId = sourceData[0];
        this.selectedData.interAssignDesId = sourceData[1];
        break;
      case 'swapRouteId':
        this.selectedData.interAssignDesId = sourceData[0];
        this.selectedData.swapAssignDesId = sourceData[1];
        break;
      case 'dlrTransRouteId':
        this.selectedData.dealer = sourceData[1];
        if (sourceData[0] === 'Other') {
          if (this.selectedData.interAssignDesId) {
            this.selectedData.interAssignDesId = sourceData[0];
          } else {
            this.selectedData.arivalPortId = sourceData[0];
          }
        } else {
          this.selectedData.swapAssignDesId = sourceData[0];
        }
        break;
      default:
        break;
    }
  }

  private buildForm() {
    this.checkCondition();
    const value = this.selectedData && (this.selectedData[this.column.field] !== null || this.selectedData[this.column.field] !== undefined)
      ? this.selectedData[this.column.field] : null;
    let formControlName;
    switch (this.column.editType) {
      case 'number':
        if (this.column.field === 'payVnAmount' || this.column.field === 'payUsdAmount') {
          formControlName = {
            [this.column.field]: [this.dataFormatService.formatMoney(value),
              Validators.compose([GlobalValidator.numberFormat, this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength + 3) : null])]
          };
        } else {
          formControlName = {
            [this.column.field]: [value, Validators.compose([
              GlobalValidator.numberFormat,
              this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength) : null])
            ]
          };
        }
        break;
      case 'monthPicker':
        this.selectedDate = value ? new Date(value) : null;
        formControlName = {[this.column.field]: [this.selectedDate, this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength) : null]};
        break;
      case 'timePicker':
        formControlName = {
          hours: [value ? Math.floor(value / 3600) : null,
            Validators.compose([GlobalValidator.numberFormatAcceptZero, GlobalValidator.maxLength(2), Validators.max(23)])],
          minutes: [value ? Math.floor(value % 3600 / 60) : null,
            Validators.compose([GlobalValidator.numberFormatAcceptZero, GlobalValidator.maxLength(2), Validators.max(59)])]
        };
        break;
      case 'text':
        formControlName = {
          [this.column.field]: [value, Validators.compose([
            GlobalValidator.specialCharacter,
            this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength) : null])
          ]
        };
        formControlName = {
          [this.column.field]: [value, Validators.compose([
            GlobalValidator.specialCharacter, this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength) : null])
          ]
        };
        break;
      case 'list':
      case 'select':
        formControlName = {
          [this.column.fieldSubmit]: [value, this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength) : null]
        };
        break;
      default:
        formControlName = {[this.column.field]: [value, this.column.maxLength ? GlobalValidator.maxLength(this.column.maxLength) : null]};
        break;
    }
    this.form = this.formBuilder.group(formControlName);
  }
}
