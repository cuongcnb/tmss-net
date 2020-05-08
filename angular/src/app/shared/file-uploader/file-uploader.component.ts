import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  Injector,
} from '@angular/core';
import { LoadingService } from '../loading/loading.service';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastService } from '../swal-alert/toast.service';
import { ErrorCodes } from '../../core/interceptors/error-code';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent extends AppComponentBase implements OnInit, OnChanges {
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @Input() placeholder = '';
  @Input() acceptType: string;
  // tslint:disable-next-line:ban-types
  @Input() apiCallUpload: Function;
  // tslint:disable-next-line:ban-types
  @Input() isCallResetUploader: Function;
  @Input() multiple: boolean;
  @Input() maximumFileSize = 5 * 1000000; // 2MB
  @Output() responseUpload = new EventEmitter();
  @Output() errorUpload = new EventEmitter();
  fileUrl = '';
  uploader: FileUploader;


  constructor(
    injector: Injector,
    private loading: LoadingService,
    private swalAlertService: ToastService,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.initUploader();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isCallResetUploader && this.isCallResetUploader) {
      this.resetUploader();
    }
  }

  checkFile() {
    this.fileUrl = this.uploader.queue[this.uploader.queue.length - 1].file.name;
  }

  importExcel() {
    this.fileInput.nativeElement.click();
  }

  checkFileSize(uploader) {
    const queue = uploader.queue;
    if (queue[queue.length - 1].file.size > this.maximumFileSize) {
      this.swalAlertService.openWarningToast('Kích thước file tối đa cho phép là 2MB');
      return false;
    }
    return true;
  }

  importApi() {
    if (!this.checkFileSize(this.uploader)) {
      return;
    }
    this.loading.setDisplay(true);
    this.apiCallUpload(this.uploader);
    this.uploader.onErrorItem = ((item: FileItem, res: string, status: number): any => {
      this.loading.setDisplay(false);

      switch (status) {
        default: {
          this.swalAlertService.openWarningToast(ErrorCodes[status] || 'Có lỗi xảy ra', 'Thông Báo');
          break;
        }
      }

      try {
        this.errorUpload.emit(JSON.parse(res));
      } catch (e) {
        this.errorUpload.emit(e);
      }
    });
    this.uploader.onSuccessItem = ((item: FileItem, res: string): any => {
      try {
        this.responseUpload.emit(JSON.parse(res));
      } catch (e) {
        this.responseUpload.emit(e);
      }
      this.loading.setDisplay(false);
    });
  }

  private resetUploader() {
    this.uploader = new FileUploader({url: '/', queueLimit: 1});
    this.fileUrl = undefined;
  }

  private initUploader() {
    this.uploader = new FileUploader({url: '/'});
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
    const token = CurrentUser.token;
    this.uploader.setOptions({
      authToken: `Bearer ${token}`,
    });
  }
}
