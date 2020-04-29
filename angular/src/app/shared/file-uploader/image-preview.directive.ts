import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[imagePreview]'
})
export class ImagePreviewDirective implements OnChanges {
  @Input() image: any;

  constructor(
    private el: ElementRef,
  ) { }

  ngOnChanges(): void {
    const reader = new FileReader();
    const el = this.el;

    reader.onloadend = e => el.nativeElement.src = reader.result;

    if (this.image) {
      return reader.readAsDataURL(this.image);
    }
  }

  /*
    <ng-container *ngIf="uploader?.queue">
      <div *ngFor="let item of uploader.queue" class="media">
        <div>
          <img src="" imagePreview [image]="item?._file" class="media-object" />
        </div>
        <div>
          <p>{{ item?.file?.name }}</p>
        </div>
      </div>
    </ng-container>
  */

}
