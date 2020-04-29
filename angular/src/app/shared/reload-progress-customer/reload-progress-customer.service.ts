import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {forkJoin, from, Observable, timer} from 'rxjs';
import {concatMap, delay, map, shareReplay, switchMap, tap, toArray} from 'rxjs/operators';

import { EnvConfigService } from '../../env-config.service';
import { BaseApiService } from '../../api/base-api.service';
import { AudioData, AudioRequest, Customers, TextSpeech } from './reload-progress-customer';
import { GoogleApi } from '../../core/constains/google-api';

const REFRESH_INTERVAL = 15000;
const REFRESH_INTERVAL_SPEAKER = 8000;

@Injectable()
export class ReloadProgressCustomerService extends BaseApiService {
  private customers$: Observable<Customers> | null | undefined;
  pageNumber: number;
  limitPage = 1;
  startPage = 1;
  size = 10;

  constructor(injector: Injector, envConfigService: EnvConfigService, private httpClient: HttpClient) {
    super(injector, envConfigService);
    this.setBaseUrl('/queuing');
  }

  get customers() {
    if (!this.customers$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.customers$ = timer$.pipe(
        switchMap(_ => this.requestCustomers()),
        shareReplay(1)
      );
    }

    return this.customers$;
  }

  getSpeakers(): Observable<AudioData> {
    const timer$ = timer(0, 1000);
    return timer$.pipe(
      switchMap(_ => this.requestTexts()),
      shareReplay(1),
      concatMap((speakers: Array<TextSpeech>) => {
        speakers.forEach((speaker: TextSpeech, index: number) => speaker.callDelay = index ? REFRESH_INTERVAL_SPEAKER : 1000);

        return from(speakers)
          .pipe(
            concatMap((speaker: TextSpeech) => this.getVoice(speaker.text)
              .pipe(delay(speaker.callDelay))),
          );
      }),
    );
  }

  private requestCustomers() {
    this.startPage = this.startPage < this.limitPage ? ++this.startPage : 1;

    return this.post('/vehicle-status', { page: this.startPage, size: this.size })
      .pipe(
        tap(response => {
          this.limitPage = Math.floor(response.total / this.size) + 1;
          response.list.forEach(element => {
            const imgFolder = 'assets/imgs';
            switch (element.state) {
              case '5':
                element.text = 'Kiểm tra sửa chữa';
                element.img = `${imgFolder}/insurrance.png`;
                break;
              case '6':
                element.text = 'Chờ sửa chữa';
                element.img = `${imgFolder}/car-wait-repair.png`;
                break;
              case '7':
                element.text = 'Đang sửa chữa';
                element.img = `${imgFolder}/car-repairing.png`;
                break;
              case '8':
                element.text = 'Dừng trong khoang';
                element.img = `${imgFolder}/stop-in-compartment.png`;
                break;
              case '9':
                element.text = 'Dừng ngoài khoang';
                element.img = `${imgFolder}/stop-out-compartment.png`;
                break;
              case '10':
                element.text = 'Chờ rửa xe';
                element.img = `${imgFolder}/car-wait-wash.png`;
                break;
              case '11':
                element.text = 'Đang rửa xe';
                element.img = `${imgFolder}/car-washing.png`;
                break;
              case '12':
                element.text = 'Chờ thanh toán';
                element.img = `${imgFolder}/car-wait-delivered.png`;
                break;
              case '13':
                element.text = 'Chờ giao xe';
                element.img = `${imgFolder}/wait-pay.png`;
                break;
            }
          });
        })
      );
  }

  private requestTexts(): Observable<Array<TextSpeech>> {
    return this.get('/receipt-voice');
  }

  getVoice(text: string): Observable<AudioData> {
    const params = new HttpParams().set('key', GoogleApi.texttospeech.key);
    const ssml = `<speak>${text.replace('-', '<break time=\"0.5s\"/>')}</speak>`;
    const body: AudioRequest = {
      input: { ssml },
      audioConfig: { audioEncoding: 'MP3', pitch: '0.00', speakingRate: '1.00' },
      voice: { languageCode: 'vi-VN', ssmlGender: 'NEUTRAL' }
    };

    return this.httpClient.post<AudioData>(GoogleApi.texttospeech.url, body, { params });
  }
}
