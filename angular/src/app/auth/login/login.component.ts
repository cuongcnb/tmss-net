import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {groupBy, sortBy} from 'lodash';
import {StorageKeys} from '../../core/constains/storageKeys';
import {Router} from '@angular/router';
import {FormStoringService} from '../../shared/common-service/form-storing.service';
import {DealerApi} from '../../api/sales-api/dealer/dealer.api';
import {LoadingService} from '../../shared/loading/loading.service';
import {GlobalValidator} from '../../shared/form-validation/validators';
import {AuthApi} from '../../api/auth/auth.api';
import {DealerModel} from '../../core/models/sales/dealer.model';
import {DlrConfigApi} from '../../api/common-api/dlr-config.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  dealers;
  // currentUser = CurrentUser;
  menuListSale = [
    // {
    //   code: 'TMV MASTER DATA',
    //   list: [
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 240,
    //       functionName: 'Dealer List Management',
    //       functionLabel: 'Dealer List Management',
    //       functionCode: 'DEALER_OUTLET',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 241,
    //       functionName: 'Model List Management',
    //       functionLabel: 'Model List Management',
    //       functionCode: 'MODEL_GRADE',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 243,
    //       functionName: 'Petrol Management',
    //       functionLabel: 'Petrol Management',
    //       functionCode: 'GASOLINE_ASSIGNMENT_DEALERS',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 244,
    //       functionName: 'Yard Region Management',
    //       functionLabel: 'Yard Region Management',
    //       functionCode: 'YARD_AREA',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 245,
    //       functionName: 'Yard Location Management',
    //       functionLabel: 'Yard Location Management',
    //       functionCode: 'YARD_LOCATION',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 246,
    //       functionName: 'Color List Management',
    //       functionLabel: 'Color List Management',
    //       functionCode: 'COLORS_MASTER',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 248,
    //       functionName: 'Color Assignment Management',
    //       functionLabel: 'Color Assignment Management',
    //       functionCode: 'COLOR_ASSIGNMENT',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 249,
    //       functionName: 'Insurance Company Management',
    //       functionLabel: 'Insurance Company Management',
    //       functionCode: 'INSURANCE_MASTER',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 250,
    //       functionName: 'Logistics Company',
    //       functionLabel: 'Logistics Company',
    //       functionCode: 'LOGISTICS_MASTER',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 253,
    //       functionName: 'Means of Transportation Management',
    //       functionLabel: 'Means of Transportation Management',
    //       functionCode: 'TRAINSPORT_VEHICLE_MANAGEMENT',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 254,
    //       functionName: 'Yard Management',
    //       functionLabel: 'Yard Management',
    //       functionCode: 'YARD_MANAGEMENT',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 281,
    //       functionName: 'Dealer Group Management',
    //       functionLabel: 'Dealer Group Management',
    //       functionCode: 'DEALER_GROUPS',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 284,
    //       functionName: 'Invoice Plan Lead-Time Management',
    //       functionLabel: 'Invoice Plan Lead-Time Management',
    //       functionCode: 'INVOICE_LEAD_TIMES',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 661,
    //       functionName: 'District List Managment',
    //       functionLabel: 'District List Managment',
    //       functionCode: 'DISTRICTS',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 731,
    //       functionName: 'Bank List Management',
    //       functionLabel: 'Bank List Management',
    //       functionCode: 'BANKS',
    //       functionDescription: 'Bank List Management'
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 1015,
    //       functionName: 'TMV Day Off',
    //       functionLabel: 'TMV Day Off Management',
    //       functionCode: 'TMV_DAY_OFF_MANAGEMENT',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 1017,
    //       functionName: 'GRADE_PRODUCTION',
    //       functionLabel: 'Grade Production',
    //       functionCode: 'GRADE_PRODUCTION',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 1024,
    //       functionName: 'Arrival Plan Lead Time',
    //       functionLabel: 'Arrival Plan Lead Time',
    //       functionCode: 'PLAN_DELIVERY_DATE_TIME',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 1244,
    //       functionName: 'Audio Management',
    //       functionLabel: 'Audio Management',
    //       functionCode: 'AUDIO_MASTER',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 1825,
    //       functionName: 'Money Definition',
    //       functionLabel: 'Money Definition',
    //       functionCode: 'MONEY_DEFINITION',
    //       functionDescription: 'Money Definition'
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 1936,
    //       functionName: 'Dealer Day Off',
    //       functionLabel: 'Dealer Day Off Management',
    //       functionCode: 'DLR_DAY_OFF_MANAGEMENT',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 3682,
    //       functionName: 'Dealer Address Print Delivery',
    //       functionLabel: 'Dealer Address Print Delivery',
    //       functionCode: 'DLR_ADDRESS_RC_VEH',
    //       functionDescription: 'Dealer Address Print Delivery'
    //     },
    //     {
    //       menuId: 8,
    //       menuName: 'TMV MASTER DATA',
    //       menuCode: 'TMV_MASTER_DATA',
    //       menuDescription: '',
    //       functionId: 239,
    //       functionName: 'Province List Management',
    //       functionLabel: 'Province List Management',
    //       functionCode: 'PROVINCES',
    //       functionDescription: null
    //     }
    //   ]
    // },
    // {
    //   code: 'TMV FLEET SALE',
    //   list: [
    //     {
    //       menuId: 21,
    //       menuName: 'TMV FLEET SALE',
    //       menuCode: 'TMV_FLEET_SALE',
    //       menuDescription: null,
    //       functionId: 353,
    //       functionName: 'Fleet Sales Application Management',
    //       functionLabel: 'Fleet Sales Application Management',
    //       functionCode: 'FLEET_SALES_BY_TMV',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 21,
    //       menuName: 'TMV FLEET SALE',
    //       menuCode: 'TMV_FLEET_SALE',
    //       menuDescription: null,
    //       functionId: 1291,
    //       functionName: 'Fleet Customer',
    //       functionLabel: 'Fleet Customer',
    //       functionCode: 'FLEET_CUSTOMER',
    //       functionDescription: 'Fleet Customer'
    //     },
    //     {
    //       menuId: 21,
    //       menuName: 'TMV FLEET SALE',
    //       menuCode: 'TMV_FLEET_SALE',
    //       menuDescription: null,
    //       functionId: 24257,
    //       functionName: 'TMV Sales target',
    //       functionLabel: 'TMV Sales target',
    //       functionCode: 'TMV_SALES_TARGET',
    //       functionDescription: ''
    //     }
    //   ]
    // },
    // {
    //   code: 'TMV DAILY SALE',
    //   list: [
    //     {
    //       menuId: 10,
    //       menuName: 'TMV DAILY SALE',
    //       menuCode: 'TMV_DAILY_SALE',
    //       menuDescription: null,
    //       functionId: 357,
    //       functionName: 'Vehicle Arrival',
    //       functionLabel: 'Vehicle Arrival',
    //       functionCode: 'VEHICLES_ARRIVAL',
    //       functionDescription: 'Vehicle Arrival'
    //     },
    //     {
    //       menuId: 10,
    //       menuName: 'TMV DAILY SALE',
    //       menuCode: 'TMV_DAILY_SALE',
    //       menuDescription: null,
    //       functionId: 359,
    //       functionName: 'Contract Management',
    //       functionLabel: 'Contract Management',
    //       functionCode: 'CONTRACT_MANAGEMENT',
    //       functionDescription: 'Contract Management'
    //     },
    //     {
    //       menuId: 10,
    //       menuName: 'TMV DAILY SALE',
    //       menuCode: 'TMV_DAILY_SALE',
    //       menuDescription: null,
    //       functionId: 1978,
    //       functionName: 'CS_CHANGE_INFORMATION',
    //       functionLabel: 'CS_CHANGE_INFORMATION',
    //       functionCode: 'CS_CHANGE_INFORMATION',
    //       functionDescription: 'CS_CHANGE_INFORMATION'
    //     },
    //     {
    //       menuId: 10,
    //       menuName: 'TMV DAILY SALE',
    //       menuCode: 'TMV_DAILY_SALE',
    //       menuDescription: null,
    //       functionId: 2349,
    //       functionName: 'CBU Vehicle Information',
    //       functionLabel: 'CBU Vehicle Information',
    //       functionCode: 'CBU_VEHICLES',
    //       functionDescription: 'CBU Vehicle Information'
    //     },
    //     {
    //       menuId: 10,
    //       menuName: 'TMV DAILY SALE',
    //       menuCode: 'TMV_DAILY_SALE',
    //       menuDescription: null,
    //       functionId: 2350,
    //       functionName: 'CKD Vehicle Information',
    //       functionLabel: 'CKD Vehicle Information',
    //       functionCode: 'CKD_VEHICLES',
    //       functionDescription: 'CKD Vehicle Information'
    //     },
    //     {
    //       menuId: 10,
    //       menuName: 'TMV DAILY SALE',
    //       menuCode: 'TMV_DAILY_SALE',
    //       menuDescription: null,
    //       functionId: 3282,
    //       functionName: 'Change Delivery',
    //       functionLabel: 'Change Delivery',
    //       functionCode: 'CHANGE_DELIVERY',
    //       functionDescription: 'Change Delivery'
    //     }
    //   ]
    // },
    // {
    //   code: 'SWAPPING',
    //   list: [
    //     {
    //       menuId: 20,
    //       menuName: 'SWAPPING',
    //       menuCode: 'TMV_SWAPPING',
    //       menuDescription: null,
    //       functionId: 600,
    //       functionName: 'Sell-Buy Matching',
    //       functionLabel: 'Sell-Buy Matching',
    //       functionCode: 'SELL_BUY_MATCHING',
    //       functionDescription: null
    //     },
    //     {
    //       menuId: 20,
    //       menuName: 'SWAPPING',
    //       menuCode: 'TMV_SWAPPING',
    //       menuDescription: null,
    //       functionId: 3986,
    //       functionName: '1.3  Swapping vehicle',
    //       functionLabel: '1.3  Swapping vehicle',
    //       functionCode: 'SWAPPING_VEHICLE',
    //       functionDescription: '1.3  Swapping vehicle'
    //     },
    //     {
    //       menuId: 20,
    //       menuName: 'SWAPPING',
    //       menuCode: 'TMV_SWAPPING',
    //       menuDescription: null,
    //       functionId: 3987,
    //       functionName: '1.4  Dispatch Change Request',
    //       functionLabel: '1.4  Dispatch Change Request',
    //       functionCode: 'DISPATCH_CHANGE_REQUEST',
    //       functionDescription: '1.4  Dispatch Change Request'
    //     },
    //     {
    //       menuId: 20,
    //       menuName: 'SWAPPING',
    //       menuCode: 'TMV_SWAPPING',
    //       menuDescription: null,
    //       functionId: 3988,
    //       functionName: '1.5  Sell/ Swap report',
    //       functionLabel: '1.5  Sell/ Swap report',
    //       functionCode: 'TMV_SELL_REPORT',
    //       functionDescription: '1.5 Sell/ Swap report'
    //     },
    //     {
    //       menuId: 20,
    //       menuName: 'SWAPPING',
    //       menuCode: 'TMV_SWAPPING',
    //       menuDescription: null,
    //       functionId: 3990,
    //       functionName: '1.1 TMV\'s Vehicle Information',
    //       functionLabel: '1.1 TMV\'s Vehicle Information',
    //       functionCode: 'STOCK_CAR_AT_DEALER',
    //       functionDescription: '1.1 TMV\'s Vehicle Information'
    //     },
    //     {
    //       menuId: 20,
    //       menuName: 'SWAPPING',
    //       menuCode: 'TMV_SWAPPING',
    //       menuDescription: null,
    //       functionId: 3994,
    //       functionName: '1.6 Advance Report',
    //       functionLabel: '1.6 Advance Report',
    //       functionCode: 'TMV_ADVANCE_REPORT',
    //       functionDescription: '1.6 Advance Report'
    //     }
    //   ]
    // },
    // {
    //   code: 'TFS',
    //   list: [
    //     {
    //       menuId: 25,
    //       menuName: 'TFS',
    //       menuCode: 'TFS',
    //       menuDescription: null,
    //       functionId: 1350,
    //       functionName: 'Dealer\'s Balance',
    //       functionLabel: 'Dealer\'s Balance',
    //       functionCode: 'TFS_PAY_BY',
    //       functionDescription: 'Dealer\'s Balance'
    //     },
    //     {
    //       menuId: 25,
    //       menuName: 'TFS',
    //       menuCode: 'TFS',
    //       menuDescription: null,
    //       functionId: 1351,
    //       functionName: 'Payment follow-up',
    //       functionLabel: 'Payment follow-up',
    //       functionCode: 'TFS_APPROVE',
    //       functionDescription: 'Payment follow-up'
    //     }
    //   ]
    // },
    // {
    //   code: 'TMV ADMIN',
    //   list: [
    //     {
    //       menuId: 9,
    //       menuName: 'TMV ADMIN',
    //       menuCode: 'TMV_ADMIN',
    //       menuDescription: '',
    //       functionId: 1491,
    //       functionName: 'Check Log Vehicles',
    //       functionLabel: 'Check Log Vehicles',
    //       functionCode: 'CHECK_LOG_VEHICLES',
    //       functionDescription: 'Check Log Vehicles'
    //     },
    //     {
    //       menuId: 9,
    //       menuName: 'TMV ADMIN',
    //       menuCode: 'TMV_ADMIN',
    //       menuDescription: '',
    //       functionId: 2342,
    //       functionName: 'Danh sách cột số liệu',
    //       functionLabel: 'Danh sách cột số liệu',
    //       functionCode: 'SLE_COLUMN_LIST',
    //       functionDescription: 'Danh sách c?t s? li?u'
    //     },
    //     {
    //       menuId: 9,
    //       menuName: 'TMV ADMIN',
    //       menuCode: 'TMV_ADMIN',
    //       menuDescription: '',
    //       functionId: 2343,
    //       functionName: 'Gán cột dữ liệu cho form',
    //       functionLabel: 'Gán cột dữ liệu cho form',
    //       functionCode: 'SLE_FORM_COLUMN',
    //       functionDescription: 'Gán c?t d? li?u cho form'
    //     },
    //     {
    //       menuId: 9,
    //       menuName: 'TMV ADMIN',
    //       menuCode: 'TMV_ADMIN',
    //       menuDescription: '',
    //       functionId: 2344,
    //       functionName: 'Tạo nhóm cột số liệu',
    //       functionLabel: 'Tạo nhóm cột số liệu',
    //       functionCode: 'SLE_GROUP_LIST',
    //       functionDescription: 'T?o nhóm c?t s? li?u'
    //     },
    //     {
    //       menuId: 9,
    //       menuName: 'TMV ADMIN',
    //       menuCode: 'TMV_ADMIN',
    //       menuDescription: '',
    //       functionId: 2345,
    //       functionName: 'Phân quyền dữ liệu',
    //       functionLabel: 'Phân quyền dữ liệu',
    //       functionCode: 'SLE_S_USER_COLUMN',
    //       functionDescription: 'Phân quy?n d? li?u'
    //     },
    //     {
    //       menuId: 9,
    //       menuName: 'TMV ADMIN',
    //       menuCode: 'TMV_ADMIN',
    //       menuDescription: '',
    //       functionId: 3772,
    //       functionName: 'Dealer IP Config',
    //       functionLabel: 'Dealer IP Config',
    //       functionCode: 'IP_DEALER_CONFIG',
    //       functionDescription: 'Dealer IP Config'
    //     }
    //   ]
    // },
    // {
    //   code: 'REPORT',
    //   list: [
    //     {
    //       menuId: 11,
    //       menuName: 'REPORT',
    //       menuCode: 'TMV_REPORT',
    //       menuDescription: null,
    //       functionId: 1959,
    //       functionName: 'Báo cáo xe sai khác ngày Delivery Date',
    //       functionLabel: 'Báo cáo xe sai khác ngày Delivery Date',
    //       functionCode: 'P_DEFERENT_DELIVERY_DATE_101',
    //       functionDescription: 'Báo cáo xe sai khác ngày Delivery Date'
    //     },
    //     {
    //       menuId: 11,
    //       menuName: 'REPORT',
    //       menuCode: 'TMV_REPORT',
    //       menuDescription: null,
    //       functionId: 1977,
    //       functionName: 'Special cases confirmation request form',
    //       functionLabel: 'Special cases confirmation request form',
    //       functionCode: 'P_SPECIAL_CASE_REQUEST_102',
    //       functionDescription: 'Special cases confirmation request form'
    //     },
    //     {
    //       menuId: 11,
    //       menuName: 'REPORT',
    //       menuCode: 'TMV_REPORT',
    //       menuDescription: null,
    //       functionId: 2023,
    //       functionName: 'Xe không có ngày Delivery Date',
    //       functionLabel: 'Xe không có ngày Delivery Date',
    //       functionCode: 'P_NO_DELIVERY_DATE',
    //       functionDescription: 'Xe không có ngày Delivery Date'
    //     }
    //   ]
    // },
    // {
    //   code: 'CRM',
    //   list: [
    //     {
    //       menuId: 13,
    //       menuName: 'CRM',
    //       menuCode: 'CRM',
    //       menuDescription: null,
    //       functionId: 1979,
    //       functionName: 'Change contact Infomation',
    //       functionLabel: 'Change contact Infomation',
    //       functionCode: 'CS_CHANGE_INFORMATION',
    //       functionDescription: 'Change contact Infomation'
    //     }
    //   ]
    // },
    // {
    //   code: 'DEALER FLEET SALE',
    //   list: [{
    //     menuId: 16,
    //     menuName: 'DEALER FLEET SALE',
    //     menuCode: 'DLR_FLEET_SALE',
    //     menuDescription: null,
    //     functionId: 60,
    //     functionName: 'DLR Fleet Sale Management',
    //     functionLabel: 'DLR Fleet Sale Management',
    //     functionCode: 'FLEET_SALES_BY_DLR',
    //     functionDescription: 'Fleet sale management by DLR'
    //   }]
    // },
    // {
    //   code: 'DEALER MASTER DATA',
    //   list: [{
    //     menuId: 15,
    //     menuName: 'DEALER MASTER DATA',
    //     menuCode: 'DLR_MASTER_DATA',
    //     menuDescription: null,
    //     functionId: 287,
    //     functionName: 'Sales Person Management',
    //     functionLabel: 'Sales Person Management',
    //     functionCode: 'SALES_PERSON',
    //     functionDescription: null
    //   }, {
    //     menuId: 15,
    //     menuName: 'DEALER MASTER DATA',
    //     menuCode: 'DLR_MASTER_DATA',
    //     menuDescription: null,
    //     functionId: 288,
    //     functionName: 'Sales Group Management',
    //     functionLabel: 'Sales Group Management',
    //     functionCode: 'SALES_GROUP',
    //     functionDescription: null
    //   }]
    // },
    // {
    //   code: 'DEALER DAILY SALE',
    //   list: [{
    //     menuId: 17,
    //     menuName: 'DEALER DAILY SALE',
    //     menuCode: 'DLR_DAILY_SALE',
    //     menuDescription: null,
    //     functionId: 357,
    //     functionName: 'Vehicle Arrival',
    //     functionLabel: 'Vehicle Arrival',
    //     functionCode: 'VEHICLES_ARRIVAL',
    //     functionDescription: 'Vehicle Arrival'
    //   }, {
    //     menuId: 17,
    //     menuName: 'DEALER DAILY SALE',
    //     menuCode: 'DLR_DAILY_SALE',
    //     menuDescription: null,
    //     functionId: 359,
    //     functionName: 'Contract Management',
    //     functionLabel: 'Contract Management',
    //     functionCode: 'CONTRACT_MANAGEMENT',
    //     functionDescription: 'Contract Management'
    //   }]
    // }, {
    //   code: 'REPORT',
    //   list: [{
    //     menuId: 12,
    //     menuName: 'REPORT',
    //     menuCode: 'DLR_REPORT',
    //     menuDescription: null,
    //     functionId: 1977,
    //     functionName: 'Special cases confirmation request form',
    //     functionLabel: 'Special cases confirmation request form',
    //     functionCode: 'P_SPECIAL_CASE_REQUEST_102',
    //     functionDescription: 'Special cases confirmation request form'
    //   }]
    // }, {
    //   code: 'SWAPPING',
    //   list: [{
    //     menuId: 18,
    //     menuName: 'SWAPPING',
    //     menuCode: 'DLR_SWAPPING',
    //     menuDescription: null,
    //     functionId: 3915,
    //     functionName: '1.4 Searching vehicle',
    //     functionLabel: '1.4 Searching vehicle',
    //     functionCode: 'SWAPPING_SEARCH_VEHICLE',
    //     functionDescription: '1.4 Searching vehicle'
    //   }, {
    //     menuId: 18,
    //     menuName: 'SWAPPING',
    //     menuCode: 'DLR_SWAPPING',
    //     menuDescription: null,
    //     functionId: 3916,
    //     functionName: '1.5 Swapping vehicle',
    //     functionLabel: '1.5 Swapping vehicle',
    //     functionCode: 'SWAPPING_VEHICLE',
    //     functionDescription: '1.5 Swapping vehicle'
    //   }, {
    //     menuId: 18,
    //     menuName: 'SWAPPING',
    //     menuCode: 'DLR_SWAPPING',
    //     menuDescription: null,
    //     functionId: 3923,
    //     functionName: '1.1 DLR\'s Vehicle Information',
    //     functionLabel: '1.1 DLR\'s Vehicle Information',
    //     functionCode: 'STOCK_CAR_AT_DEALER',
    //     functionDescription: '1.1 DLR\'s Vehicle Information'
    //   }, {
    //     menuId: 18,
    //     menuName: 'SWAPPING',
    //     menuCode: 'DLR_SWAPPING',
    //     menuDescription: null,
    //     functionId: 3924,
    //     functionName: '1.3 Nationwide buying list',
    //     functionLabel: '1.3 Nationwide buying list',
    //     functionCode: 'NATIONWIDE_BUYING_LIST',
    //     functionDescription: '1.3 Nationwide buying list'
    //   }, {
    //     menuId: 18,
    //     menuName: 'SWAPPING',
    //     menuCode: 'DLR_SWAPPING',
    //     menuDescription: null,
    //     functionId: 3925,
    //     functionName: '1.2  Nationwide selling list',
    //     functionLabel: '1.2  Nationwide selling list',
    //     functionCode: 'NATIONWIDE_SELLING_LIST',
    //     functionDescription: '1.2  Nationwide selling list'
    //   }, {
    //     menuId: 18,
    //     menuName: 'SWAPPING',
    //     menuCode: 'DLR_SWAPPING',
    //     menuDescription: null,
    //     functionId: 3949,
    //     functionName: '1.6 Sell/ Swap report',
    //     functionLabel: '1.6 Sell/ Swap report',
    //     functionCode: 'TMV_SELL_REPORT',
    //     functionDescription: '1.6 Sell/ Swap report'
    //   }]
    // },
    // {
    //   code: 'Đại lý đặt hàng TMV',
    //   list: [{
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24268,
    //     functionName: 'Nenkei',
    //     functionLabel: 'Nenkei',
    //     functionCode: 'DEALER_NENKEI',
    //     functionDescription: 'Nenkei'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24270,
    //     functionName: 'Danh mục version',
    //     functionLabel: 'Danh mục version',
    //     functionCode: 'DEALER_VERSION_TYPE',
    //     functionDescription: 'Danh mục version'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24269,
    //     functionName: 'Khai báo deadline đặt hàng',
    //     functionLabel: 'Khai báo deadline đặt hàng',
    //     functionCode: 'DEALER_ORDER_CONFIG',
    //     functionDescription: 'Khai báo deadline đặt hàng'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24262,
    //     functionName: '1. Chỉ tiêu BH TMV',
    //     functionLabel: 'Chỉ tiêu BH TMV',
    //     functionCode: 'DEALER_SALES_TARGET',
    //     functionDescription: 'Chỉ tiêu BH TMV'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24271,
    //     functionName: '1. Chỉ tiêu BH TMV fleet',
    //     functionLabel: 'Chỉ tiêu BH TMV fleet',
    //     functionCode: 'DEALER_SALES_TARGET_FLEET',
    //     functionDescription: 'Chỉ tiêu BH TMV fleet'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24263,
    //     functionName: '2. Dữ liệu rundown',
    //     functionLabel: 'Dữ liệu rundown',
    //     functionCode: 'DEALER_RUNDOWN',
    //     functionDescription: 'Dữ liệu rundown'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24264,
    //     functionName: '3. Kế hoạch BH đại lý',
    //     functionLabel: 'Kế hoạch BH đại lý',
    //     functionCode: 'DEALER_SALES_PLAN',
    //     functionDescription: 'Kế hoạch BH đại lý'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24265,
    //     functionName: '3. Đặt hàng đại lý',
    //     functionLabel: 'Đặt hàng đại lý',
    //     functionCode: 'DEALER_ORDER',
    //     functionDescription: 'Đặt hàng đại lý'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24266,
    //     functionName: '4. Phân xe đại lý',
    //     functionLabel: 'Phân xe đại lý',
    //     functionCode: 'DEALER_ALLOCATION',
    //     functionDescription: 'Phân xe đại lý'
    //   }, {
    //     menuId: 10069,
    //     menuName: 'Đại lý đặt hàng TMV',
    //     menuCode: 'DLR_ORDER',
    //     menuDescription: null,
    //     functionId: 24267,
    //     functionName: '5. Đặt màu CBU',
    //     functionLabel: 'Đặt màu CBU',
    //     functionCode: 'DEALER_CBU_COLOR_ORDER',
    //     functionDescription: 'Đặt màu CBU'
    //   }]
    // }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private formStoringService: FormStoringService,
    private router: Router,
    // private dealerApi: DealerApi,
    private authApi: AuthApi,
    private loadingService: LoadingService,
    private dlrConfigApi: DlrConfigApi
  ) {
  }

  ngOnInit() {
    if (!this.formStoringService.get(StorageKeys.currentUser)) {
      document.body.classList.add('login');
    }
    this.buildForm();

    this.loadingService.setDisplay(true);
    this.authApi.getAvailableDealersByIp().subscribe( response => {
      this.loadingService.setDisplay(false);
      this.dealers = response && response.dealers && response.dealers.length ? sortBy(response.dealers, dlr => dlr.code) : [];
    });
  }

  // formatSubmenuList(list) {
  //   const group = groupBy(list, item => item.subMenuName);
  //   const subMenu = [];
  //   Object.keys(group).forEach(subKey => {
  //     subMenu.push({
  //       code: subKey === 'undefined' ? null : subKey,
  //       list: group[subKey],
  //     });
  //   });
  //   return sortBy(subMenu, item => item.code);
  // }

  formatMenuList(menuList) {
    // const list = [{
    //   'subMenuId': 1,
    //   'subMenuName': 'Xuất hàng',
    //   'subMenuCode': 'XUAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4042,
    //   'functionName': 'Xuất phụ tùng',
    //   'functionLabel': 'Xuất phụ tùng',
    //   'functionCode': 'XUAT_PHU_TUNG',
    //   'functionDescription': 'Xuất phụ tùng'
    // }, {
    //   'subMenuId': 2,
    //   'subMenuName': 'Đặt hàng',
    //   'subMenuCode': 'DAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4043,
    //   'functionName': 'Đặt hàng BO cho lệnh sửa chữa',
    //   'functionLabel': 'Đặt hàng BO cho lệnh sửa chữa',
    //   'functionCode': 'DAT_HANG_BO',
    //   'functionDescription': ' Đặt hàng BO cho lệnh sửa chữa'
    // }, {
    //   'subMenuId': 2,
    //   'subMenuName': 'Đặt hàng',
    //   'subMenuCode': 'DAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4044,
    //   'functionName': 'Theo dõi đơn hàng BO',
    //   'functionLabel': 'Theo dõi đơn hàng BO',
    //   'functionCode': 'THEO_DOI_BO',
    //   'functionDescription': 'Theo dõi đơn hàng BO'
    // }, {
    //   'subMenuId': 1,
    //   'subMenuName': 'Xuất hàng',
    //   'subMenuCode': 'XUAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4045,
    //   'functionName': 'Xuất phụ tùng cho RO thiếu phụ tùng',
    //   'functionLabel': 'Xuất phụ tùng cho RO thiếu phụ tùng',
    //   'functionCode': 'XUAT_PHU_TUNG_RO',
    //   'functionDescription': 'Xuất phụ tùng cho RO thiếu phụ tùng'
    // }, {
    //   'subMenuId': 2,
    //   'subMenuName': 'Đặt hàng',
    //   'subMenuCode': 'DAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4046,
    //   'functionName': 'Đặt hàng cho dự trữ tồn kho',
    //   'functionLabel': 'Đặt hàng cho dự trữ tồn kho',
    //   'functionCode': 'DAT_HANG_DU_TRU',
    //   'functionDescription': 'Đặt hàng cho dự trữ tồn kho'
    // }, {
    //   'subMenuId': 2,
    //   'subMenuName': 'Đặt hàng',
    //   'subMenuCode': 'DAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4047,
    //   'functionName': 'Đặt hàng thủ công',
    //   'functionLabel': 'Đặt hàng thủ công',
    //   'functionCode': 'DAT_HANG_THU_CONG',
    //   'functionDescription': 'Đặt hàng thủ công'
    // }, {
    //   'subMenuId': 2,
    //   'subMenuName': 'Đặt hàng',
    //   'subMenuCode': 'DAT_HANG',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4048,
    //   'functionName': 'Đặt hàng đặc biệt',
    //   'functionLabel': 'Đặt hàng đặc biệt',
    //   'functionCode': 'DAT_HANG_DAC_BIET',
    //   'functionDescription': 'Đặt hàng đặc biệt'
    // }, {
    //   'subMenuId': 3,
    //   'subMenuName': 'Quản lý',
    //   'subMenuCode': 'QUAN_LY',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4049,
    //   'functionName': 'Bán lẻ phụ tùng',
    //   'functionLabel': 'Bán lẻ phụ tùng',
    //   'functionCode': 'BAN_LE_PHU_TUNG',
    //   'functionDescription': 'Bán lẻ phụ tùng'
    // }, {
    //   'subMenuId': 3,
    //   'subMenuName': 'Quản lý',
    //   'subMenuCode': 'QUAN_LY',
    //   'menuId': 28,
    //   'menuName': 'Quản lý phụ tùng',
    //   'menuCode': 'PARTS_MANAGEMENT',
    //   'menuDescription': null,
    //   'functionId': 4050,
    //   'functionName': 'Điều chỉnh tăng giảm phụ tùng',
    //   'functionLabel': 'Điều chỉnh tăng giảm phụ tùng',
    //   'functionCode': 'DIEU_CHINH_PHU_TUNG',
    //   'functionDescription': 'Điều chỉnh tăng giảm phụ tùng'
    // }, {
    //   'subMenuId': 4,
    //   'subMenuName': 'Thông tin khách hàng',
    //   'subMenuCode': 'Thông tin khách hàng',
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 4078,
    //   'functionName': 'Thông tin khách hàng',
    //   'functionLabel': 'Thông tin khách hàng',
    //   'functionCode': 'CUSTOMER_INFO',
    //   'functionDescription': 'Thông tin khách hàng'
    // }, {
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 4080,
    //   'functionName': 'Phiếu hẹn',
    //   'functionLabel': 'Phiếu hẹn',
    //   'functionCode': 'PHIEU_HEN',
    //   'functionDescription': 'Phiếu hẹn'
    // }, {
    //   'subMenuId': 4,
    //   'subMenuName': 'Thông tin khách hàng',
    //   'subMenuCode': 'THONG_TIN_KHACH_HANG',
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 4081,
    //   'functionName': 'Chuẩn hóa thông tin khách hàng',
    //   'functionLabel': 'Chuẩn hóa thông tin khách hàng',
    //   'functionCode': 'CHUAN_HOA_KH',
    //   'functionDescription': 'Chuẩn hóa thông tin khách hàng'
    // }, {
    //   'subMenuId': 4,
    //   'subMenuName': 'Thông tin khách hàng',
    //   'subMenuCode': 'THONG_TIN_KHACH_HANG',
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 4082,
    //   'functionName': 'Sửa thông tin khách hàng',
    //   'functionLabel': 'Sửa thông tin khách hàng',
    //   'functionCode': 'SUA_KH',
    //   'functionDescription': 'Sửa thông tin khách hàng'
    // }, {
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 4084,
    //   'functionName': 'Công việc dang dở của CVDV',
    //   'functionLabel': 'Công việc dang dở của CVDV',
    //   'functionCode': 'CONG_VIEC_DANG_DO_CVDV',
    //   'functionDescription': 'Công việc dang dở của CVDV'
    // }, {
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 4085,
    //   'functionName': 'Hồ sơ sửa chữa',
    //   'functionLabel': 'Hồ sơ sửa chữa',
    //   'functionCode': 'REPAIR_PROFILE',
    //   'functionDescription': 'Hồ sơ sửa chữa'
    // }, {
    //   'subMenuId': 5,
    //   'subMenuName': 'Báo giá',
    //   'subMenuCode': 'BAO_GIA',
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 14084,
    //   'functionName': 'Tạo báo giá/ Quyết toán kết hợp',
    //   'functionLabel': 'Tạo báo giá/ Quyết toán kết hợp',
    //   'functionCode': 'BAO_GIA_QUYET_TOAN',
    //   'functionDescription': 'Tạo báo giá/ Quyết toán kết hợp'
    // }, {
    //   'subMenuId': 5,
    //   'subMenuName': 'Báo giá',
    //   'subMenuCode': 'BAO_GIA',
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 14086,
    //   'functionName': 'Lưu trữ báo giá',
    //   'functionLabel': 'Lưu trữ báo giá',
    //   'functionCode': 'STORAGE_QUOTATION',
    //   'functionDescription': 'Lưu trữ báo giá'
    // }, {
    //   'menuId': 30,
    //   'menuName': 'Cố vấn dịch vụ',
    //   'menuCode': 'ADVISOR',
    //   'menuDescription': null,
    //   'functionId': 14088,
    //   'functionName': 'Xem thông tin tiến độ',
    //   'functionLabel': 'Xem thông tin tiến độ',
    //   'functionCode': 'PROGRESS_TRACKING_TABLE',
    //   'functionDescription': 'Xem thông tin tiến độ'
    // }]
    // const listGroupByMenu = groupBy(list, item => item.menuName)
    // const menu = []
    // Object.keys(listGroupByMenu).forEach(key => {
    //   menu.push({
    //     code: key,
    //     submenu: this.formatSubmenuList(listGroupByMenu[key])
    //   })
    // })
    // return menu

    const result = [];
    const listGroupByName = groupBy(menuList, item => item.menuName);
    Object.keys(listGroupByName).forEach(key => {
      result.push({
        code: key,
        list: listGroupByName[key]
      });
    });
    return result;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.setDisplay(true);
    const value = this.form.value;
    this.authApi.login(value).subscribe(response => {
      localStorage.setItem(StorageKeys.dlrId, JSON.stringify(this.form.value.dealerId));
      // Check if user login with two account on the same machine
      if (this.formStoringService.get(StorageKeys.currentUser)
        && response.userName !== this.formStoringService.get(StorageKeys.currentUser).userName) {
        localStorage.clear();
      }

      const currentDealer: DealerModel = this.dealers.find(dlr => dlr.id === value.dealerId);
      const user = Object.assign(response, {
        isAdmin: response.admin,
        isLexus: response.dlrLexus ? response.dlrLexus : false,
        userName: value.username,
        dealerName: currentDealer.abbreviation,
        token: response.token,
        dealerId: value.dealerId,
        dealerCode: currentDealer.code,
        dealerVnName: currentDealer.vnName
      });
      this.formStoringService.set(StorageKeys.currentUser, user);
      // this.authApi.getFunctionList('SERVICE').subscribe(list => {
      this.authApi.getAllFunctionList().subscribe(list => {
        console.log({menuList: [...this.formatMenuList(list), ...this.menuListSale]});
        this.loadingService.setDisplay(false);
        this.formStoringService.set(StorageKeys.currentUser, Object.assign(user, {
          menuList: [...this.formatMenuList(list), ...this.menuListSale]
        }));
        this.router.navigate(['/']);

        setTimeout(() => {
          const loadingComponent = document.getElementById('loading-component');
          if (loadingComponent) {
            loadingComponent.parentNode.removeChild(loadingComponent);
          }
        });
        // this.dlrConfigApi.getByCurrentDealer().subscribe(res => {
        //   if (res) {
        //     this.formStoringService.set(StorageKeys.dlrConfig, res[0]);
        //   }
        // });
        this.dlrConfigApi.getCurrentByDealer().subscribe(res => {
          if (res) {
            this.formStoringService.set(StorageKeys.dlrConfig, res);
          }
        });
      });
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: ['', GlobalValidator.required],
      username: [undefined, GlobalValidator.required],
      password: [undefined, GlobalValidator.required]
    });
    const dealerId = JSON.parse(localStorage.getItem(StorageKeys.dlrId));
    if (dealerId) {
      this.form.get('dealerId').setValue(dealerId);
    }
  }

  changeUsername() {
    const data = this.form.get('username').value;
    if (data) {
      // this.form.get('username').setValue(data.toUpperCase());
    }
  }
}
