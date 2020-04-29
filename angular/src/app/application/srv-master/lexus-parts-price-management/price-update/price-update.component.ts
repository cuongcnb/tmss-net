import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { MasterLexusApi } from '../../../../api/srv-master-lexus/master-lexus.api';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'price-update',
  templateUrl: './price-update.component.html',
  styleUrls: ['./price-update.component.scss']
})
export class PriceUpdateComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  ratio;
  ratioId;

  constructor(
    private formBuilder: FormBuilder,
    private comfirmService: ConfirmService,
    private loadingService: LoadingService,
    private setHeightModalService: SetModalHeightService,
    private masterLexusApi: MasterLexusApi,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setHeightModalService.onResize();
  }

  open() {
    this.buildForm();
    this.modal.show();
    this.onResize();
    this.showRatio();
  }

  reset() {
    this.form.reset();
  }

  update() {
    this.loadingService.setDisplay(true);
    this.masterLexusApi.updateRatio(this.ratioId , this.form.getRawValue().ratio)
      .subscribe(res => {
        this.close.emit();
        this.loadingService.setDisplay(false);
      });
    this.modal.hide();
  }

  private showRatio() {
    this.loadingService.setDisplay(true);
    this.masterLexusApi.showRatio().subscribe(res => {
      this.ratio = res.ratio;
      this.ratioId = res.id;
      this.form.controls.ratio.patchValue(this.ratio);
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      ratio: [undefined, Validators.compose([GlobalValidator.numberFormat])],
    });
  }
}
