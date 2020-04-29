import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { BoOrderFollowupApi } from '../../../../api/parts-management/bo-order-followup.api';
import { ModalDirective } from 'ngx-bootstrap';
import { BoPartsFollowupNvptModel } from '../../../../core/models/parts-management/bo-parts-followup-nvpt.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-followup-nvpt-edit-modal',
  templateUrl: './bo-followup-nvpt-edit-modal.component.html',
  styleUrls: ['./bo-followup-nvpt-edit-modal.component.scss'],
})
export class BoFollowupNvptEditModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  selectedPart: BoPartsFollowupNvptModel;

  form: FormGroup;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private boOrderFollowupApi: BoOrderFollowupApi,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedPart) {
    this.selectedPart = selectedPart;
    this.modal.show();
    this.buildForm();
    this.getDataToEdit();
  }

  getDataToEdit() {
    const val = {
      custOrdPartNo: this.selectedPart.custOrdPartNo,
      repairOrder: this.selectedPart.lenhsuachua,
      custOrderNo: this.selectedPart.custOrderNo,
      bienso: this.selectedPart.bienso,
      cvdv: this.selectedPart.cvdv,
    };
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.getEditDataNvpt(val).subscribe(res => {
      this.loadingService.setDisplay(false);
      res.isNotFollow = res.isNotFollow === 'Y';
      this.form.patchValue(res);
    });
  }

  reset() {
    this.form = undefined;
  }

  save() {
    this.loadingService.setDisplay(true);
    const val = this.form.getRawValue();
    val.isNotFollow = val.isNotFollow ? 'Y' : 'N';

    this.boOrderFollowupApi.editPartForNvpt(val).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
      this.close.emit();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      vitrigiahangsop: [undefined],
      ghichu: [undefined],
      isNotFollow: [false],

      bienso: [{ value: undefined, disabled: true }],
      cvdv: [{ value: undefined, disabled: true }],
      lenhsuachua: [{ value: undefined, disabled: true }],
      matmvxuly: [{ value: undefined, disabled: true }], // k dung
      custOrderNo: [{ value: undefined, disabled: true }],
      custOrdPartNo: [{ value: undefined, disabled: true }],
      id: [undefined],
    });
  }
}
