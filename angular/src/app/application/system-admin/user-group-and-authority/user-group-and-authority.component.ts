import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {UserGroupAuthorityCheckboxComponent} from './user-group-authority-checkbox/user-group-authority-checkbox.component';
import {groupBy, remove, uniq} from 'lodash';
import {of} from 'rxjs';
import {tap} from 'rxjs/internal/operators';
import {SystemFunctionListApi} from '../../../api/system-admin/system-function-list.api';
import {SystemUserGroupDefinitionApi} from '../../../api/system-admin/system-user-group-definition.api';
import {AuthorizeApi} from '../../../api/system-admin/authorize.api';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-group-authority',
  templateUrl: './user-group-and-authority.component.html',
  styleUrls: ['./user-group-and-authority.component.scss'],
})
export class UserGroupAndAuthorityComponent implements OnInit {
  @ViewChild('addUserGroupModal', {static: false}) addUserGroupModal;
  fieldGridUserGroup;
  userGroupParams;
  selectedGroup;
  dlrList;
  fieldGridFunctionDetail;
  functionDetailParams;
  displayedFunctionDetail;
  selectedSystemFunction;
  functions: Array<any> = [];
  functionControls: Array<any> = [];
  currentUser;
  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private systemUserGroupDefinitionApi: SystemUserGroupDefinitionApi,
    private systemFunctionListApi: SystemFunctionListApi,
    private authorizeApi: AuthorizeApi,
    private formStoringService: FormStoringService,
    private dealerApi: DealerApi
  ) {
    this.fieldGridUserGroup = [
      {
        headerName: 'Tên Nhóm',
        headerTooltip: 'Tên Nhóm',
        field: 'groupName',
        minWidth: 200},
      {
        headerName: 'TMV?',
        headerTooltip: 'TMV?',
        field: 'tmv',
        cellRendererFramework: UserGroupAuthorityCheckboxComponent
      },
      {
        headerName: 'Active?',
        headerTooltip: 'Active?',
        field: 'active',
        cellRendererFramework: UserGroupAuthorityCheckboxComponent},
      {
        headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description', minWidth: 200},
      {
        headerName: 'Tên đại lý',
        headerTooltip: 'Tên đại lý',
        field: 'dealerId',
        cellRenderer: params => this.dlrList ? (this.dlrList.filter(dlr => dlr.id === params.data.dealerId).length > 0 ?
            this.dlrList.filter(dlr => dlr.id === params.data.dealerId)[0].abbreviation : null) : null,
        minWidth: 100
      },
    ];
    this.fieldGridFunctionDetail = [
      {headerName: 'Tên Chức Năng', headerTooltip: 'Tên Chức Năng', field: 'functionName', minWidth: 200},
      {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description', minWidth: 200},
      {headerName: 'Thêm', headerTooltip: 'Thêm', field: 'add', cellRendererFramework: UserGroupAuthorityCheckboxComponent},
      {headerName: 'Sửa', headerTooltip: 'Sửa', field: 'modify', cellRendererFramework: UserGroupAuthorityCheckboxComponent},
      {headerName: 'Xóa', headerTooltip: 'Xóa', field: 'delete', cellRendererFramework: UserGroupAuthorityCheckboxComponent},
      {headerName: 'Truy vấn', headerTooltip: 'Truy vấn', field: 'query', cellRendererFramework: UserGroupAuthorityCheckboxComponent},
    ];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);

  }

  ngOnInit() {
    this.getDlrList();
    this.authorizeApi.getAllFunctions().subscribe(functions => this.functions = this.currentUser.dealerId > 0 ? functions.filter(it => it.isTmv !== 'Y') : functions);
  }

  callbackGridUserGroup(params) {
    this.userGroupParams = params;
    this.refreshUserGroup();
  }

  getDlrList() {
    this.dealerApi.getDealers().subscribe(res => {
      this.dlrList = res;
      this.callbackGridUserGroup(this.userGroupParams);
    });
  }

  getParamsUserGroup() {
    const selectedGroup = this.userGroupParams.api.getSelectedRows();
    if (selectedGroup) {
      this.selectedGroup = selectedGroup[0];
      this.loadingService.setDisplay(true);
      this.authorizeApi.getFuncOfGroup(this.selectedGroup.groupId).subscribe((list) => {
        this.loadingService.setDisplay(false);
        this.functionDetailParams.api.setRowData(list);
      });
    }
  }

  updateUserGroup() {
    this.addUserGroupModal.open(this.selectedGroup);
  }

  refreshUserGroup() {
    this.loadingService.setDisplay(true);
    this.systemUserGroupDefinitionApi.getAllSystemGroup().subscribe(systemGroup => {
      this.userGroupParams.api.setRowData(this.currentUser.dealerId > 0 ?  systemGroup.filter(it => [null, -1, -2, this.currentUser.dealerId].includes(it.dealerId)) : systemGroup);
      this.selectedGroup = undefined;
      this.loadingService.setDisplay(false);
    });
  }

  callbackGridFunctionDetail(params) {
    this.functionDetailParams = params;
  }

  getParamsFunctionDetail() {
    const selectedSystemFunction = this.functionDetailParams.api.getSelectedRows();
    if (selectedSystemFunction) {
      this.selectedSystemFunction = selectedSystemFunction[0];
    }
  }

  setFunctionToGrid(functionDetails) {
    this.getDisplayedFunctionDetail();

    if (functionDetails.length) {
      functionDetails.forEach(item => {
        if (!this.displayedFunctionDetail.find(func => func.functionId === item.functionId)) {
          if (item.menuControl) {
            this.functionControls.push(item);
          }

          this.functionDetailParams.api.updateRowData({
            add: [{
              description: item.functionDescription,
              functionId: item.functionId,
              functionName: item.functionName,
              menuId: item.menuControl ? item.menuControl.menuId : item.menuId,
              query: false,
              modify: false,
              delete: false,
              add: false,
            }],
          });
        }
      });
    }
  }

  removeSelectedFunction() {
    remove(this.functionControls, ctrl => ctrl.functionId === this.selectedSystemFunction.functionId);
    this.functionDetailParams.api.updateRowData({remove: [this.selectedSystemFunction]});
    this.getDisplayedFunctionDetail();
    this.selectedSystemFunction = undefined;

    this.functionDetailParams.api.forEachNode(node => {
      if (!node.rowIndex) {
        node.setSelected(true);
        this.functionDetailParams.api.setFocusedCell(0, 'functionName');
      }
    });
  }

  saveFunctionsToMenu() {
    const listFuncByMenuIds = groupBy(this.functionControls, func => func.menuControl.menuId);
    this.functionControls = [];

    of(1).pipe(tap(() => {
      Object.keys(listFuncByMenuIds).forEach(menuId => {
        const functionIds = uniq(listFuncByMenuIds[menuId].map((item: any) => item.functionId));

        this.systemFunctionListApi.getFunctionByMenu(menuId).subscribe(menus => {
          const arr = menus && menus.length ? menus.map(item => item.functionId) : [];
          const result = uniq(arr.concat(functionIds));

          this.systemFunctionListApi.addFunctionToMenu(menuId, result).subscribe(() => {
          });
        });
      });
    }), tap(() => {
      this.saveUserGroupDetail();
    })).subscribe(() => {
    });
  }

  save() {
    this.loadingService.setDisplay(true);
    if (this.functionControls.length) {
      return this.saveFunctionsToMenu();
    } else {
      return this.saveUserGroupDetail();
    }
  }

  saveUserGroupDetail() {
    this.getDisplayedFunctionDetail();
    this.authorizeApi.saveFuncOfGroup(this.selectedGroup.groupId, this.displayedFunctionDetail).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  private getDisplayedFunctionDetail() {
    const displayedData = [];
    this.functionDetailParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedFunctionDetail = displayedData;
  }
}
