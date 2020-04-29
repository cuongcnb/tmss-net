import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaintenanceLetterModel } from '../../../../core/models/maintenance-operation/maintenance-letter.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-letter-content',
  templateUrl: './maintenance-letter-content.component.html',
  styleUrls: ['./maintenance-letter-content.component.scss'],
})
export class MaintenanceLetterContentComponent implements OnInit, OnChanges {

  selectedData: MaintenanceLetterModel;
  @Input() dataSearch;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataSearch) {
      this.form.patchValue(this.dataSearch);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
        // thông tin xe
        licensePlate: [undefined],
        model: [undefined],
        vinno: [undefined],
        // thông tin khách hàng
        driversName: [undefined],
        driversAddress: [undefined],
        driversPhone: [undefined],
        driversEmail: [undefined],
        companyName: [undefined],
        companyAddress: [undefined],
        companyPhone: [undefined],
        carrierName: [undefined],
        carrierAddress: [undefined],
        carrierPhone: [undefined],
        carrierEmail: [undefined],
        // nội dung lần sửa gần nhất
        dateIn: [undefined],
        km: [undefined],
        milestonesBD: [undefined],
        expectedDateBD: [undefined],
        cvdv: [undefined],
        contentSC: [undefined],
        // nội dung lần sửa gần nhất tại đại lý khác
        dateInK: [undefined],
        supplier: [undefined],
        kmK: [undefined],
        contentSCK: [undefined],
      },
    );
  }

  onSubmit() {
  }
}
