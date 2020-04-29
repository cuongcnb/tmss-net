import {Component, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {DealerOrderConfigModel} from '../../../../core/models/master-data/dealer-order-config.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DealerOrderConfigService} from '../../../../api/dealer-order/dealer-order-config.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {DataOrderConfigType} from '../../../../core/constains/dataOrderConfigType';
import {DealerModel} from '../../../../core/models/base.model';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {DealerVersionTypeService} from '../../../../api/dealer-order/dealer-version-type.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-order-config-modal',
  templateUrl: './dealer-order-config-modal.component.html',
  styleUrls: ['./dealer-order-config-modal.component.scss']
})
export class DealerOrderConfigModalComponent {
  @ViewChild('dealerOrderConfigModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: DealerOrderConfigModel;
  form: FormGroup;
  dealers: Array<DealerModel>;
  modalHeight: number;
  dealerVersionTypes: [];
  dealerVersionTypesSelect: [];
  dataOrderConfigType = DataOrderConfigType;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private dealerOrderConfigService: DealerOrderConfigService,
    private swalAlertService: ToastService,
    private dealerVersionTypeService: DealerVersionTypeService,
    private dealerListService: DealerListService,
    private formStoringService: FormStoringService) {
  }

  private getDealers() {
    this.dealerListService.getDealers().subscribe(dealers => {
      this.dealers = dealers;
      if (!this.selectedData && dealers.length > 0) {
        this.form.controls['dlrId'].setValue(-1);
      }
    });
  }

  private getVersionType() {
    this.dealerVersionTypeService.getAll().subscribe(dealerVersionTypes => {
      this.dealerVersionTypes = dealerVersionTypes;
      this.loadVerionTypeByDataType();
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.getDealers();
    this.getVersionType();
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dataType: [undefined, GlobalValidator.required],
      dealerVersionTypeId: [undefined],
      month: [new Date(), GlobalValidator.required],
      importDate: [new Date(), GlobalValidator.required],
      deadline: [this.formStoringService.get(StorageKeys.deadlineDate), GlobalValidator.required],
      dlrId: [undefined, GlobalValidator.required],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

  changeDataType() {
    this.loadVerionTypeByDataType();
    this.form.controls["dealerVersionTypeId"].setValue(null);
  }

  loadVerionTypeByDataType() {
    this.dealerVersionTypesSelect = [];
    for (let i = 0; i < this.dealerVersionTypes.length; i++) {
      let item = this.dealerVersionTypes[i];
      if (item['dataType'] === this.form.value.dataType) {
        this.dealerVersionTypesSelect.push(item);
      }
    }
  }

  reset() {
    this.form = undefined;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;

    this.formStoringService.set(StorageKeys.deadlineDate, new Date(data.deadline));

    for (let i = 0; i < this.dealerVersionTypes.length; i++) {
      let item = this.dealerVersionTypes[i];
      if (item['id'] === data.dealerVersionTypeId) {
        data.versionType = item['versionType'];
      }
    }
    const apiCall = !this.selectedData ?
      this.dealerOrderConfigService.createNewDealerOrderConfig(data) : this.dealerOrderConfigService.updateDealerOrderConfig(data);

    this.loadingService.setDisplay(true);
    apiCall.subscribe((res) => {
      this.loadingService.setDisplay(false);
      if (res.message === 'Success') {
        this.close.emit();
        this.modal.hide();
        this.swalAlertService.openSuccessModal();
      } else {
        this.swalAlertService.openFailModal(res.message);
      }
    });
  }

}
