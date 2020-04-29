import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FleetSaleApplicationService} from '../../../../api/fleet-sale/fleet-sale-application.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {EventBusType} from '../../../../core/constains/eventBusType';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent implements OnInit {
  @ViewChild('historyModal', {static: false}) modal: ModalDirective;
  @Input() isDlrFleetSaleApplication: boolean;
  @Input() selectedFleetApp;
  form: FormGroup;
  fieldGridHistory;
  historyParams;
  selectedFleetAppHistory;
  modalHeight: number;
  gradeList;
  colorList;
  historyOfSelectedFAH;

  constructor(
    private formBuilder: FormBuilder,
    private fleetSaleApplicationService: FleetSaleApplicationService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private setModalHeightService: SetModalHeightService,
    private eventBusService: EventBusService,
    private swalAlertService: ToastService
  ) {
    this.fieldGridHistory = [
      { field: 'status', minWidth: 200 },
      {
        headerName: 'Date', field: 'changeDate',
        cellRenderer: params => {
          return `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`;
        },
        minWidth: 200
      }
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedFleetApp, gradeList, colorList) {
    this.gradeList = gradeList;
    this.colorList = colorList;
    this.selectedFleetApp = selectedFleetApp;
    setTimeout(() => {
      this.getHistoryData();
    });
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  getHistoryData() {
    this.loadingService.setDisplay(true);
    this.fleetSaleApplicationService.getFleetAppHistoryByFleetAppId(this.selectedFleetApp).subscribe(fleetAppHistory => {
      this.historyParams.api.setRowData(fleetAppHistory);
      this.loadingService.setDisplay(false);
    });
  }

  callbackGridHistory(params) {
    this.historyParams = params;
  }

  getParamsHistory() {
    const selectedFleetAppHistory = this.historyParams.api.getSelectedRows();
    if (selectedFleetAppHistory) {
      this.selectedFleetAppHistory = selectedFleetAppHistory[0];
      this.loadingService.setDisplay(true);
      this.fleetSaleApplicationService.getHistoryTablesByFleetAppHistory(this.selectedFleetAppHistory).subscribe(historyOfSelectedFAH => {
        this.historyOfSelectedFAH = historyOfSelectedFAH;
        this.form.patchValue({
          noteDealer: historyOfSelectedFAH.noteDealer,
          noteTmv: historyOfSelectedFAH.noteTmv
        });
        this.loadingService.setDisplay(false);
        // this.eventBusService.emit({
        //   type: EventBusType.fleetAppHistorySent,
        //   value: historyOfSelectedFAH
        // });
      });
    }
  }

  refresh() {
    // this.getHistoryData();
    this.eventBusService.emit({
      type: EventBusType.fleetAppHistorySent,
      value: { activeDeliveryList: [], activeDTLSList: [], previousDeliveryList: [], previousDTLSList: [] }
    });
  }

  convertIdToString(historyOfSelectedFAH) {
    const matchValue = {
      matchGradeActive: undefined,
      matchColorActive: undefined,
      matchGradePrevious: undefined,
      matchColorPrevious: undefined
    };
    if (historyOfSelectedFAH) {
      historyOfSelectedFAH.activeDTLSList.forEach(activeIntention => {
        matchValue.matchGradeActive = this.gradeList.find(grade => grade.id = activeIntention.gradeId);
        matchValue.matchColorActive = this.colorList.find(color => color.id = activeIntention.colorId);
        activeIntention.gradeId = matchValue.matchGradeActive.marketingCode;
        activeIntention.colorId = matchValue.matchColorActive.code;
      });
      historyOfSelectedFAH.activeDeliveryList.forEach(activeDelivery => {
        matchValue.matchGradeActive = this.gradeList.find(grade => grade.id = activeDelivery.gradeId);
        activeDelivery.gradeId = matchValue.matchGradeActive.marketingCode;
      });
      historyOfSelectedFAH.previousDTLSList.forEach(previousIntention => {
        matchValue.matchGradePrevious = this.gradeList.find(grade => grade.id = previousIntention.gradeId);
        matchValue.matchColorPrevious = this.colorList.find(color => color.id = previousIntention.colorId);
        previousIntention.gradeId = matchValue.matchGradePrevious.marketingCode;
        previousIntention.colorId = matchValue.matchColorPrevious.code;
      });
      historyOfSelectedFAH.activeDeliveryList.forEach(previousDelivery => {
        matchValue.matchGradePrevious = this.gradeList.find(grade => grade.id = previousDelivery.gradeId);
        previousDelivery.gradeId = matchValue.matchGradePrevious.marketingCode;
      });
    }
  }

  saveNote() {
    this.loadingService.setDisplay(true);
    const note = !this.isDlrFleetSaleApplication ? this.form.value.noteTmv : this.form.value.noteDealer;
    this.fleetSaleApplicationService.saveHistoryNote(this.selectedFleetAppHistory, !this.isDlrFleetSaleApplication, note).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      noteDealer: [{ value: undefined, disabled: !this.isDlrFleetSaleApplication }, GlobalValidator.maxLength(255)],
      noteTmv: [{ value: undefined, disabled: this.isDlrFleetSaleApplication }, GlobalValidator.maxLength(255)]
    });
  }
}
