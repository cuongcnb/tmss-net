import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {CommonService} from '../../../shared/common-service/common.service';
import {SystemFunctionListApi} from '../../../api/system-admin/system-function-list.api';
import {AuthorizeApi} from '../../../api/system-admin/authorize.api';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'system-function-list',
  templateUrl: './system-function-list.component.html',
  styleUrls: ['./system-function-list.component.scss']
})
export class SystemFunctionListComponent implements OnInit {
  @ViewChild('modifyMenuModal', {static: false}) modifyMenuModal;
  @ViewChild('forceSelectData', {static: false}) forceSelectData;
  @ViewChild('forceSelectMenu', {static: false}) forceSelectMenu;
  @ViewChild('addSystemFucntionListModal', {static: false}) addSystemFucntionListModal;
  @ViewChild('errorAddFunction', {static: false}) errorAddFunction;
  form: FormGroup;
  fieldGridSystemFunction;
  systemFunctionParams;
  displayedData: Array<any> = [];
  selectedSystemFunction: Array<any>;
  functions: Array<any>;
  // functionsByMenu: Array<any> = []
  menuGridField;
  menuListParams;
  selectedMenu;
  currentUser;

  constructor(
    private authorizeApi: AuthorizeApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private systemFunctionListApi: SystemFunctionListApi,
    private formStoringService: FormStoringService,
    private commonService: CommonService) {
    this.menuGridField = [
      {headerName: 'Mã Menu', headerTooltip: 'Mã Menu', field: 'menuCode', minWidth: 170},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'menuName', minWidth: 170},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'menuDescription', minWidth: 200}
    ];

    this.fieldGridSystemFunction = [
      {headerName: 'Mã Menu', headerTooltip: 'Mã Menu', field: 'functionCode', minWidth: 170},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'functionName', minWidth: 170},
      {headerName: 'Nhãn', headerTooltip: 'Nhãn', field: 'functionLabel', minWidth: 170},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'functionDescription', minWidth: 200}
    ];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);

  }

  ngOnInit() {
    this.authorizeApi.getAllFunctions().subscribe(functions => {
      this.functions = this.currentUser.dealerId > 0 ? functions.filter(it => it.isTmv !== 'Y') : functions;
    });
  }

  callbackGridSystemFunction(params) {
    this.systemFunctionParams = params;
  }

  getParamsSystemFunction() {
    const selectedSystemFunction = this.systemFunctionParams.api.getSelectedRows();
    if (selectedSystemFunction) {
      this.selectedSystemFunction = selectedSystemFunction[0];
    }
  }

  callbackGridMenu(params) {
    this.menuListParams = params;
    this.loadingService.setDisplay(true);
    this.systemFunctionListApi.getAll().subscribe(menus => {
      if (this.currentUser.dealerId > 0) {
        const data = menus.filter(it => [null, -1, -2, this.currentUser.dealerId].includes(it.dealerId));
        this.menuListParams.api.setRowData(data);
      } else {
        this.menuListParams.api.setRowData(menus);
      }
      this.loadingService.setDisplay(false);
    });
  }

  getParamsMenu() {
    const selectedMenu = this.menuListParams.api.getSelectedRows();
    if (selectedMenu) {
      this.selectedMenu = selectedMenu[0];
      this.loadingService.setDisplay(true);
      this.systemFunctionListApi.getFunctionByMenu(this.selectedMenu.menuId).subscribe(functions => {
        this.systemFunctionParams.api.setRowData(functions);
        this.getDisplayedData();
        this.loadingService.setDisplay(false);
      });
    }
  }

  setFunctionToGrid(functionDetail) {
    if (this.commonService.isObjectInListByKey(this.displayedData, functionDetail[0].functionControl, 'functionId')) {
      this.swalAlertService.openFailToast('Chức năng này đã tồn tại trong menu');
      return;
    }
    this.systemFunctionParams.api.updateRowData({add: [functionDetail[0].functionControl]});
    this.getDisplayedData();
  }

  removeSelectedFunction() {
    this.systemFunctionParams.api.updateRowData({remove: [this.selectedSystemFunction]});
    this.getDisplayedData();
    this.selectedSystemFunction = undefined;

    this.systemFunctionParams.api.forEachNode(node => {
      if (!node.rowIndex) {
        node.setSelected(true);
        this.systemFunctionParams.api.setFocusedCell(0, 'functionCode');
      }
    });
  }

  refreshList() {
    this.callbackGridMenu(this.menuListParams);
    this.selectedMenu = null;
    this.displayedData = [];
  }

  updateMenu() {
    if (this.selectedMenu) {
      this.getDisplayedData();
      this.modifyMenuModal.open(this.displayedData, this.selectedMenu);
    } else {
      this.forceSelectData.show();
    }
  }

  getDisplayedData() {
    const displayedData = [];
    this.systemFunctionParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
  }

  save() {
    const data = Object.assign({}, this.selectedMenu, {
      functions: this.displayedData.map(item => item.functionId)
    });

    this.loadingService.setDisplay(true);
    this.systemFunctionListApi.updateMenu(data).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  addFunction() {
    if (this.selectedMenu) {
      this.addSystemFucntionListModal.open(this.functions);
    } else {
      this.forceSelectMenu.show();
    }

  }
}
