import {
  Component, forwardRef, Input, ViewChild, ElementRef,
  Renderer2, OnDestroy, AfterViewInit, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageCropperModalComponent } from '../image-cropper-modal/image-cropper-modal.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'image-cropper-control',
  templateUrl: './image-cropper-control.component.html',
  styleUrls: ['./image-cropper-control.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImageCropperControlComponent),
    multi: true,
  }],
})

export class ImageCropperControlComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() imageData: any;
  @Input() imageUrl: string;
  @Input() modalInside = true;
  @Input() settings;
  @Output() openImageModal = new EventEmitter();
  @Output() ready = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() saved = new EventEmitter();
  @ViewChild('container', {static: false}) private containerRef: ElementRef;
  @ViewChild('cropperModal', {static: false}) public cropperModal: ImageCropperModalComponent;

  image = null;
  displayedUrl: string;

  // tslint:disable-next-line:ban-types
  private onChange: Function;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
  ) {
  }

  // writeValue(file?) {
  //   file = file || undefined;
  //   this.image = file;
  //   if (file) {
  //     this.displayedUrl = file.url as string;
  //   }
  // }
  //
  // registerOnChange(fn) {
  //   this.onChange = fn;
  // }
  //
  // registerOnTouched(fn) {
  //   this.onTouched = fn;
  // }

  open(input: HTMLInputElement) {
    const inputFile = input.files[0];
    input.value = '';
    if (!inputFile) {
      return;
    }
    this.image = {};
    this.image.name = inputFile.name;
    const imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(inputFile));

    if (this.modalInside) {
      this.cropperModal.open(imageUrl);
    } else {
      this.openImageModal.emit(imageUrl);
    }
  }

  ngOnDestroy() {
    URL.revokeObjectURL(this.displayedUrl);
  }

  ngOnChanges() {
    if (this.imageData) {
      this.saveData(this.imageData);
    }
  }

  ngAfterViewInit() {
    const label = this.containerRef.nativeElement as HTMLDivElement;
    const setLabelSize = ({ width, height }) => {
      this.renderer.setStyle(label, 'height', `${height}px`);
      this.renderer.setStyle(label, 'width', `${width}px`);
    };
    if (this.settings) {
      let width = label.offsetWidth;
      if (!width) {
        setLabelSize(this.settings);
        return;
      }

      const height = Math.min(this.settings.height / this.settings.width * width, this.settings.height);
      width = height * this.settings.width / this.settings.height;
      setLabelSize({ width, height });
    }
  }

  remove(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    this.image = undefined;
    this.displayedUrl = undefined;
    this.imageUrl = undefined;
    URL.revokeObjectURL(this.displayedUrl);
    this.onChange(undefined);
    this.removed.emit();
  }

  get isEmpty(): boolean {
    return !this.image && !this.imageUrl;
  }

  saveData(data) {
    if (!data) { return; }
    this.updateValue(data);
    URL.revokeObjectURL(this.displayedUrl);
    this.saved.emit();
  }

  private updateValue(result: any) {
    if (!result) { return; }
    this.transform(result);
    if (this.onChange) { this.onChange(this.image); }
  }

  private transform(result: any): any {
    if (this.displayedUrl) { URL.revokeObjectURL(this.displayedUrl); }
    this.displayedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(result.blob)) as string;
    this.imageUrl = result.blob;
    this.image.url = result.blob;
  }

}
