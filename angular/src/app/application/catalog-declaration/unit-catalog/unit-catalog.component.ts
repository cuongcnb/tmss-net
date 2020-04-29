import { Component, OnInit, ViewChild } from '@angular/core';
import { ITreeOptions } from 'angular-tree-component';
import { DivisionCommonModel } from '../../../core/models/common-models/division-common.model';
import { DivisionCommonApi } from '../../../api/common-api/division-common.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'unit-catalog',
  templateUrl: './unit-catalog.component.html',
  styleUrls: ['./unit-catalog.component.scss'],
})
export class UnitCatalogComponent implements OnInit {
  @ViewChild('unitDetail', {static: false}) unitDetail;
  @ViewChild('divisionTree', {static: false}) divisionTree;
  selectedData: DivisionCommonModel;
  unitsTreeData: Array<DivisionCommonModel>;
  unitsOptions: ITreeOptions = {
    displayField: 'divName',
  };

  selectedNode;

  constructor(
    private loadingService: LoadingService,
    private unitCatalogApi: DivisionCommonApi,
    private confirm: ConfirmService,
    private swalAlert: ToastService,
  ) {
  }

  ngOnInit() {
    this.getUnitDivision();
  }

  active(e) {
    this.selectedData = e.node.data;
    this.selectedNode = this.divisionTree.treeModel.getFocusedNode();
  }

  deleteUnit() {
    if (this.selectedData) {
      this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.unitCatalogApi.remove(this.selectedData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.removeSelection();
          this.getUnitDivision();
          this.swalAlert.openSuccessToast();
        });
      });
    }
  }

  refresh() {
    this.getUnitDivision();
  }

  save() {
    this.unitDetail.save();
  }

  removeSelection() {
    this.selectedData = null;
    if (this.divisionTree.treeModel.getFocusedNode()) {
      this.divisionTree.treeModel.getFocusedNode().setIsActive(false);
    }
  }

  private getUnitDivision(newData?) {
    this.loadingService.setDisplay(true);
    this.unitCatalogApi.getDivisionByCurrentDlr().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.unitsTreeData = this.setChildren(res || []);
      if (this.selectedNode && newData) {
        this.divisionTree.treeModel.setActiveNode(this.selectedNode, newData);
      }
    });
  }

  private setChildren(sourceData, parentDivId?) {
    return (parentDivId
      ? sourceData.filter(res => res.parentDivId === parentDivId)
      : sourceData.filter(res => !res.parentDivId))
      .map(res => {
        return Object.assign({}, res, {
          children: this.setChildren(sourceData, res.id),
        });
      });
  }
}
