import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'active-cr',
    templateUrl: './active-cr.component.html',
    styleUrls: ['./active-cr.component.scss'],
})
export class ActiveCrComponent implements OnInit {
    @ViewChild('submitBtn', { static: false }) submitBtn;
    @Input() form: FormGroup;
    @Input() isSubmit: boolean;
    constructor() {
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (this.isSubmit && this.submitBtn) {
    //         this.submitBtn.nativeElement.click();
    //     }
    // }
    ngOnInit() {

    }
}
