import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './image-cropper.component';
import { ImageCropperControlComponent } from './image-cropper-control/image-cropper-control.component';
import { ImageCropperModalComponent } from './image-cropper-modal/image-cropper-modal.component';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
  ],
  exports: [
    ImageCropperComponent,
    ImageCropperControlComponent,
    ImageCropperModalComponent,
  ],
  declarations: [
    ImageCropperComponent,
    ImageCropperControlComponent,
    ImageCropperModalComponent,
  ]
})
export class ImageCropperModule { }
