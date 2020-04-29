import Cropper from 'cropperjs';
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss'],
})

export class ImageCropperModalComponent {
  @Input() imageUrl;
  @Input() loadImageErrorText: string;
  @Input() settings;
  @Output() ready = new EventEmitter();
  @Output() saved = new EventEmitter<any>();
  @Output() dismiss = new EventEmitter<any>();
  @ViewChild('image', {static: false}) image;
  @ViewChild('modal', {static: false}) modal: ModalDirective;

  loadError: any;

  private cropper: Cropper;
  private imageElement: HTMLImageElement;

  open(imageUrl: any) {
    this.modal.show();
    this.loadImage(imageUrl);
  }

  hide() {
    this.modal.hide();
  }

  imageLoaded(ev: Event) {
    this.loadError = false;

    const image = ev.target as HTMLImageElement;
    this.imageElement = image;
    image.crossOrigin = 'anonymous';

    image.addEventListener('ready', () => {
      this.ready.emit(true);
      window.dispatchEvent(new Event('resize'));
    });
    if (this.cropper) {
      this.cropper.destroy();
    }
    this.cropper = new Cropper(image, this.cropperOptions);
  }

  imageLoadError() {
    this.loadError = true;
  }

  loadImage(imageUrl: string) {
    window.setTimeout(() => {
      this.imageUrl = imageUrl;
    }, 1000);
  }

  exportCanvas(base64 ?) {
    const imageData = this.cropper.getImageData();
    const cropData = this.cropper.getCropBoxData();
    const canvas = this.cropper.getCroppedCanvas();
    const data = {
      imageData,
      cropData,
    };

    const promise = new Promise(resolve => {
      if (base64) {
        return resolve({
          dataUrl: canvas.toDataURL('image/png'),
        });
      }
      canvas.toBlob(blob => resolve({
        blob,
      }));
    });
    promise.then(res => {
      this.saved.emit(Object.assign(data, res));
      this.hide();
    }, err => {
    });
  }

  private get cropperOptions(): Cropper.Options {
    let aspectRatio = NaN;
    if (this.settings) {
      const {
        width,
        height,
      } = this.settings;
      aspectRatio = width / height;
    }
    const extra = this.settings ? this.settings.extra : {};
    return Object.assign({
      aspectRatio,
      movable: false,
      scalable: false,
      zoomable: false,
      viewMode: 1,
    }, extra);
  }

}
