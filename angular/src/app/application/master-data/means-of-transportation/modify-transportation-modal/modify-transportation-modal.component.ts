import {Component, EventEmitter, Injector, Output, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCropperControlComponent } from '../../../../shared/image-cropper/image-cropper-control/image-cropper-control.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MeansOfTransportationService} from '../../../../api/master-data/means-of-transportation.service';
import { TransportImageUploaderService} from '../../../../api/master-data/transport-image-uploader.service';
import { of } from 'rxjs';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { ToastService } from '../../../../shared/common-service/toast.service';
import { EnvConfigService } from '../../../../env-config.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-transportation-modal',
  templateUrl: './modify-transportation-modal.component.html',
  styleUrls: ['./modify-transportation-modal.component.scss']
})
export class ModifyTransportationModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('imageCropperControl', {static: false}) cropper: ImageCropperControlComponent;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  imgUrl: string;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private meansOfTransportationService: MeansOfTransportationService,
    private modalHeightService: SetModalHeightService,
    private transportImageUploadService: TransportImageUploaderService,
    private swalAlertService: ToastService,
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService,
    private envConfigService: EnvConfigService
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.uploadImage().subscribe(img => {
      const value = Object.assign({}, this.form.value, {
        logo: img && img.data ? img.data : this.form.value.logo
      });
      this.meansOfTransportationService.createNewTransportMean(value).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.imgUrl = null;
        this.close.emit();
        this.modal.hide();
        this.swalAlertService.openSuccessModal();
      });
    });
  }

  uploadImage() {
    this.loadingService.setDisplay(true);
    if (this.form.value.imageData) {
      return this.transportImageUploadService.uploadNewImage(this.form.value.imageData);
    }
    return of(0);
  }

  saveImage(event) {
    if (!event) {
      return;
    }
    this.form.patchValue({imageData: event.blob});
    this.cropper.displayedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(event.blob)) as string;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      description: ['', GlobalValidator.maxLength(255)],
      imageData: [''],
      logo: [''],
      status: ['Y']
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      if (this.selectedData.logo) {
        this.imgUrl = `${this.envConfigService.getConfig().backEnd}/image_upload?url_image=${this.selectedData.logo}`;
      }
    }
  }
}
