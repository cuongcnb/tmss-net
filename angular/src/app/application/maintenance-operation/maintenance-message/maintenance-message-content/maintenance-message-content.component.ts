import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaintenanceMessageModel } from '../../../../core/models/maintenance-operation/maintenance-message.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-message-content',
  templateUrl: './maintenance-message-content.component.html',
  styleUrls: ['./maintenance-message-content.component.scss']
})
export class MaintenanceMessageContentComponent implements OnInit, OnChanges {

  selectedData: MaintenanceMessageModel;
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
        estimatedDay: [undefined],
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
      }
    );
  }

  onSubmit() {
  }
}
