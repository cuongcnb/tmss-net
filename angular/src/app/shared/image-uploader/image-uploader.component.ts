import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../loading/loading.service';
import { ToastService } from '../swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit, OnChanges {
  @ViewChild('imgInput', {static: false}) imgInput: ElementRef;
  // tslint:disable-next-line:ban-types
  @Input() apiCallUpload: Function;
  @Input() maxHeight;
  // tslint:disable-next-line:ban-types
  @Input() apiCallGetImg: Function;
  @Input() isCallGetImg = false;
  @Output() resUpload = new EventEmitter();
  imgUrl: Array<string> = [];

  constructor(
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isCallGetImg) {
      this.isCallGetImg ? this.getImg() : this.imgUrl = [];
    }
  }

  previewImg(event) {
    this.imgUrl = [];
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size > 1000000) {
          this.swalAlertService.openWarningToast('Your image must be less than 1Mb');
          this.getImg();
        } else {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.loadingService.setDisplay(true);
            this.callApiUploadImg().subscribe(imgURL => {
              this.resUpload.emit(imgURL);
              this.imgUrl.push(e.target.result);
              this.loadingService.setDisplay(false);
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  private callApiUploadImg() {
    const file: File = this.imgInput.nativeElement.files[0];
    if (file) {
      return this.apiCallUpload(file);
    } else {
      return of(0);
    }
  }

  private getImg() {
    this.imgUrl = [];
    this.loadingService.setDisplay(true);
    this.apiCallGetImg().subscribe(res => {
      if (res && res.img_content) {
        this.imgUrl.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/PNG;base64,' + res.img_content) as string);
      }
      this.loadingService.setDisplay(false);
      // this.isCallGetImg = false;
    });
  }
}
