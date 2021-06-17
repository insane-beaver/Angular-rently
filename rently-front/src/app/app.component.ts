import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from './services/local-storage.service';
import {Inf} from './classes/Inf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  constructor (private storage: LocalStorageService, public translate: TranslateService) {
    this.storage.getInf();

    translate.addLangs(['en', 'ua', 'ru']);
    translate.setDefaultLang(Inf.language);
  }
  title = 'rently-front';

}
