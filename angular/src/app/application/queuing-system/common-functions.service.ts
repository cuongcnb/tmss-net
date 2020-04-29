import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor() {
  }

  tranformRegisterNo(reg): string {
    return (typeof reg === 'string' || reg instanceof String) ?
      [].concat(reg.split(/[^A-Za-z0-9]/))
        .filter(item => item !== '')
        .map(item => item.toString().toUpperCase())
        .join('')
      : '';
  }

  getCarJobs(car): string {
    if (!car.jobs) {
      return '';
    }

    switch (car.jobs) {
      case '1':
        return 'BP';
      case '2':
        return 'GJ';
      case '3':
        return 'PM';
      case '4':
        return '1K';
      case '12':
        return 'BP+GJ';
      case '13':
        return 'BP+PM';
      case '14':
        return 'BP+1K';
      case '23':
        return 'GJ+PM';
      case '24':
        return 'GJ+1K';
      case '34':
        return 'PM+1K';
      case '123':
        return 'BP+GJ+PM';
      case '124':
        return 'BP+GJ+1K';
      case '134':
        return 'BP+PM+1K';
      case '234':
        return 'GJ+PM+1K';
      case '1234':
        return 'BP+GJ+PM+1K';
    }
  }

  getTypeByCarJobs(car) {
    if (!car.jobs) {
      return {};
    }

    switch (car.jobs) {
      case '1':
        return {
          isBp: true
        };
      case '2':
        return {
          isGj: true
        };
      case '3':
        return {
          isMa: true
        };
      case '4':
        return {
          is1K: true
        };
      case '12':
        return {
          isBp: true,
          isGj: true
        };
      case '13':
        return {
          isBp: true,
          isMa: true
        };
      case '14':
        return {
          isBp: true,
          is1K: true
        };
      case '23':
        return {
          isGj: true,
          isMa: true
        };
      case '24':
        return {
          isGj: true,
          is1K: true
        };
      case '34':
        return {
          isMa: true,
          is1K: true
        };
      case '123':
        return {
          isBp: true,
          isGj: true,
          isMa: true
        };
      case '124':
        return {
          isBp: true,
          isGj: true,
          is1K: true
        };
      case '134':
        return {
          isBp: true,
          isMa: true,
          is1K: true
        };
      case '234':
        return {
          isGj: true,
          isMa: true,
          is1K: true
        };
      case '1234':
        return {
          isBp: true,
          isGj: true,
          isMa: true,
          is1K: true
        };
    }
  }

  getCarStatus(car) {
    if (!car.vehicleStatus) {
      return '';
    }

    switch (car.vehicleStatus) {
      case '0':
        return 'Chờ tiếp nhận';
      case '1':
        return 'Đang tiếp nhận';
      case '2':
        return 'Tiếp nhận xong';
      case '3':
        return 'Dừng tiếp nhận';
      case '4':
        return 'Báo giá';
      case '5':
        return 'Kiểm tra sửa chữa';
      case '6':
        return 'Chờ sửa chữa';
      case '7':
        return 'Đang sửa chữa';
      case '8':
        return 'Dừng trong khoang';
      case '9':
        return 'Dừng ngoài khoang';
      case '10':
        return 'Chờ rửa xe';
      case '11':
        return 'Đang rửa xe';
      case '12':
        return 'Chờ thanh toán';
      case '13':
        return 'Chờ giao xe';
    }
  }

  getCarStatusReception(car) {
    switch (car.vehicleStatus) {
      case 0:
        return 'Chờ tiếp nhận';
      case 1:
        return 'Đang tiếp nhận';
    }
  }

  getTypeOfCustomer(car): string {
    if (car.isAppointment === 'Y') {
      return 'Hẹn';
    }
    if (car.isWarranty === 'Y') {
      return 'Bảo hành';
    }
    if (car.isReRepair === 'Y') {
      return 'Sửa chữa lại';
    }
    if (car.jobs === '4' || car.is1K === 'Y') {
      return '1K';
    }
    return 'KHDV';
  }

  getLogo(id): string {
    if (!id) {
      return '';
    }
    switch (id) {
      case 414:
        return 'assets/imgs/logoToyotaGiaiPhong.png';
      case 724:
        return 'assets/imgs/logoToyotaThaiNguyen.png';
      case 845:
        return 'assets/imgs/logoToyotaBacNinh.png';
      case 987:
        return 'assets/imgs/logoToyotaHue.png';
    }
  }

  getWebAdress(id): string {
    if (!id) {
      return '';
    }
    switch (id) {
      case 414:
        return 'cskh@toyotagiaiphong.com';
      case 724:
        return 'cskh@toyotathainguyen.com';
      case 845:
        return 'cskh@toyotabacninh.com';
      default:
        return 'Đang cập nhật';
    }
  }

  getPhoneNumber(id): string {
    if (!id) {
      return '';
    }
    switch (id) {
      case 414:
        return '+84 1234 5678';
      case 724:
        return '0912480777';
      case 845:
        return '(0222) 3 68 66 66';
      default:
        return 'Đang cập nhật';
    }
  }
}
