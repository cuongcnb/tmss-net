import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

@Injectable()
export class NextShortcutService {
    constructor() { }

    // tslint:disable-next-line: new-parens
    private selectedType = new BehaviorSubject<string>('');
    private listnersShortcut = new BehaviorSubject<Array<ShortcutInput>>([]);
    private checkShortcut = new BehaviorSubject(null);

    listenType(): Observable<string> {
        return this.selectedType.asObservable();
    }

    nextType(data: string) {
        this.selectedType.next(data);
    }

    listenShortcut(): Observable<Array<ShortcutInput>> {
        return this.listnersShortcut.asObservable();
    }

    nextShortcut(data: Array<ShortcutInput>) {
        this.listnersShortcut.next(data);
    }
    listenCheckShortcut(): Observable<any> {
        return this.checkShortcut.asObservable();
    }
    nextCheckShortcut(check) {
        this.checkShortcut.next(check);
    }
}
