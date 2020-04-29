import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { PartsUpcommingApi } from '../../../api/parts-management/parts-upcomming.api';
import { PartsUpcommingModel } from '../../../core/models/parts-management/parts-upcomming.model';
import { DataFormatService } from '../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-upcomming-info',
  templateUrl: './parts-upcomming-info.component.html',
  styleUrls: ['./parts-upcomming-info.component.scss'],
})
export class PartsUpcommingInfoComponent implements OnInit {
  fieldPartsUpcommingList;
  partsUpcommingParams;
  partsUpcommingList: PartsUpcommingModel[];
  searchForm: FormGroup;
  partsData = new Observable(observer => {
    setTimeout(() => {
      observer.next([
        {
          partsCode: '23212132143',
          partsId: 1,
          qty: 12,
          lotNo: 'AGV',
          comeDate: 43423512,
        },

      ]);
    });
  });

  constructor(private formBuilder: FormBuilder,
              private partsUpcommingApi: PartsUpcommingApi,
              private dataFormatService: DataFormatService) {
    this.fieldPartsUpcommingList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
      },
      {
        headerName: 'SL sắp về',
        headerTooltip: 'Số lượng sắp về',
        field: 'qty',
      },
      {
        headerName: 'Lô hàng',
        headerTooltip: 'Lô hàng',
        field: 'lotNo',
      },
      {
        headerName: 'Ngày về',
        headerTooltip: 'Ngày về',
        field: 'comeDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      partsCode: [undefined],
      orderNo: [undefined],
      arrivalDate: [undefined],
    });
  }

  callbackPartsUpcomming(params) {
    this.partsUpcommingParams = params;
  }

  getParamsPartsUpcomming() {

  }

  search() {
    // this.partsUpcommingApi.findUpcoming(this.searchForm.value).subscribe(val => {
    this.partsData.subscribe((val: PartsUpcommingModel[]) => {
      if (val) {
        this.partsUpcommingList = val;
        this.partsUpcommingParams.api.setRowData(this.partsUpcommingList);
      }
    });
  }
}
