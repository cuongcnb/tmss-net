import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LocationOfYardService} from '../../../../../api/dlr-master-data/location-of-yard.service';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {StorageKeys} from '../../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../../shared/common-service/form-storing.service';
import {GlobalValidator} from '../../../../../shared/form-validation/validators';
import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'location-of-yard-modal',
  templateUrl: './location-of-yard-modal.component.html',
  styleUrls: ['./location-of-yard-modal.component.scss']
})
export class LocationOfYardModalComponent implements OnInit {
  @ViewChild('locationOfYardModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private setModalHeightService: SetModalHeightService,
    private formStoringService: FormStoringService,
    private locationOfYardService: LocationOfYardService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(false);
    const value = Object.assign({}, this.form.value, {
      dealerId: this.formStoringService.get(StorageKeys.currentUser).dealerId
    });
    const apiCall = this.selectedData ?
      this.locationOfYardService.updateLocationOfYard(value) : this.locationOfYardService.createLocationOfYard(value);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      code: ['', GlobalValidator.required],
      ordering: ['', GlobalValidator.numberFormat],
      status: ['Y'],
      description: [''],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
