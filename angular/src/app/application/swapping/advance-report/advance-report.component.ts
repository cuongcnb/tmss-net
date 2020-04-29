import { Component, OnInit } from '@angular/core';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdvanceReportService} from '../../../api/master-data/advance-report.service';
import { GridExportService } from '../../../shared/common-service/grid-export.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'advance-report',
  templateUrl: './advance-report.component.html',
  styleUrls: ['./advance-report.component.scss']
})
export class AdvanceReportComponent implements OnInit {
  fieldGrid;
  dealerGridField;
  params;
  form: FormGroup;
  dealers;

  constructor(
    private loadingService: LoadingService,
    private advanceReportService: AdvanceReportService,
    private swalAlertService: ToastService,
    private dealerListService: DealerListService,
    private gridExportService: GridExportService,
    private formBuilder: FormBuilder
  ) {
    this.dealerGridField = [
      { field: 'abbreviation' }
    ];

    this.fieldGrid = [
      { headerName: 'Dealer', field: 'dealerName', minWidth: 100},
      { headerName: 'Grade', field: 'gradeName', minWidth: 100},
      { headerName: 'Color', field: 'colorName', minWidth: 100},
      { field: 'tmssNo', minWidth: 100},
      { headerName: 'Allocation Month', field: 'allocationMonthDate', minWidth: 100},
      { headerName: 'Latest Dispatch Plan', field: 'lastestDispatchPlanDate', minWidth: 100},
      { headerName: 'Advance Request', field: 'advanceRequestDate', minWidth: 100},
      { headerName: 'Original Dispatch Plan', field: 'originDispatchPlanDate', minWidth: 120},
      { headerName: 'Original Allocation Month', field: 'originAllocationMonthDate', minWidth: 120},
      { field: 'requestDate', minWidth: 120},
      { field: 'confirmDate', minWidth: 120},
      { field: 'status', minWidth: 100},
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.dealerListService.getAvailableDealers().subscribe(dealers => this.dealers = dealers);
  }

  runReport() {
    const { fromDate, toDate, dealerId } = this.form.value;
    if (!fromDate || !toDate || !dealerId) {
      this.swalAlertService.openFailModal('You must fill all field to run report');
      return;
    }

    if (fromDate > toDate) {
      this.swalAlertService.openFailModal('To Date must greater than From Date');
      return;
    }

    this.loadingService.setDisplay(true);
    this.advanceReportService.runReport(this.form.value).subscribe(list => {
      this.params.api.setRowData(list);
      this.loadingService.setDisplay(false);
    });
  }

  callbackGrid(params) {
    this.params = params;
  }

  export() {
    this.gridExportService.export(this.params, 'Advance Report');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDate: [undefined],
      toDate: [undefined],
      dealerControl: [undefined],
      dealerId: [undefined]
    });

    this.form.get('dealerControl').valueChanges.subscribe(val => {
      this.form.patchValue({
        dealerId: val ? val.id : null
      });
    });
  }

}
