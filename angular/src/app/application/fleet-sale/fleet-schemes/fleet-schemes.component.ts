import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { FleetSchemesService} from '../../../api/fleet-sale/fleet-schemes.service';
import { GradeListService} from '../../../api/master-data/grade-list.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-schemes',
  templateUrl: './fleet-schemes.component.html',
  styleUrls: ['./fleet-schemes.component.scss']
})
export class FleetSchemesComponent implements OnInit {
  @ViewChild('modifyFleetSchemes', {static: false}) modifyFleetSchemes;
  @Input() isDlrFleetSchemes;
  fieldGrid;
  fleetSchemesParams;
  grades;
  selectedFleetSchemes;
  fleetSchemes;

  constructor(
    private loadingService: LoadingService,
    private fleetSchemesService: FleetSchemesService,
    private gradeListService: GradeListService,
    private toastService: ToastService
  ) {
    this.fieldGrid = [
      { field: 'min' },
      { field: 'max' },
      { field: 'available' },
      {
        headerName: 'FWSP',
        field: 'fwsp'
      },
      {
        headerName: 'FRSP',
        field: 'frsp'
      },
      { field: 'holdbackAmount' },
      { field: 'discount' },
      {
        headerName: '% Margin',
        field: 'marginPercent'
      },
      { field: 'margin' },
      { field: 'description' },
    ];
  }

  ngOnInit() {
    this.gradeListService.getGrades(true).subscribe(grades => {
      this.grades = grades;
    });
  }

  callbackGridFleetSchemes(params) {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach(column => {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
    this.loadingService.setDisplay(true);
    this.fleetSchemesService.getAllFleetSchemes().subscribe(fleetSchemes => {
      this.fleetSchemes = fleetSchemes;
      params.api.setRowData(this.fleetSchemes);
      this.loadingService.setDisplay(false);
    });
    this.fleetSchemesParams = params;
  }

  getParamsFleetSchemes() {
    const selectedFleetSchemes = this.fleetSchemesParams.api.getSelectedRows();
    if (selectedFleetSchemes) {
      this.selectedFleetSchemes = selectedFleetSchemes[0];
    }
  }

  refreshList() {
    this.callbackGridFleetSchemes(this.fleetSchemesParams);
  }

  updateFleetSchemes() {
    !this.selectedFleetSchemes
      ? this.toastService.openWarningForceSelectData()
      : this.modifyFleetSchemes.open(this.selectedFleetSchemes);
  }
}
