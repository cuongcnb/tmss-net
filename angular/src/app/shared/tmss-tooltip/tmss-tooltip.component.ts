import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewRef} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tmss-tooltip',
  templateUrl: './tmss-tooltip.component.html',
  styleUrls: ['./tmss-tooltip.component.scss']
})
export class TmssTooltipComponent implements OnInit, OnDestroy {
  @ViewChild('tooltip', {static: true}) tooltip;
  @Input() contentElem;
  top: number;
  left: number;

  distanceTop = 10;
  distanceLeft = 22;
  numberMatrix = 115;

  constructor(
    private cdr: ChangeDetectorRef,
    private elem: ElementRef
  ) {
    // setTimeout(() => {
    //   this.elem.nativeElement.addEventListener('mousedown', (event) => {
    //     this.onMouseMove(event);
    //   });
    // }, 100);
  }

  ngOnInit() {
    const contentElemRect = this.contentElem.getBoundingClientRect();
    const elemRect = this.tooltip.nativeElement.getBoundingClientRect();
    this.top = contentElemRect.top - elemRect.height - this.distanceTop;

    let left_style = parseFloat(this.contentElem.style.left.split('%')[0]);
    // 118 là 2/3 độ rộng của tootltip
    if (left_style >= 0) this.left = contentElemRect.left;
    else left_style = contentElemRect.left + contentElemRect.width - 118;
  }

  ngOnDestroy(): void {
    // this.elem.nativeElement.removeEventListener('mousedown', (event) => {
    //   this.onMouseMove(event);
    // });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // if (!this.left) {
    this.left = event.clientX - this.numberMatrix;
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
    // }
  }

}
