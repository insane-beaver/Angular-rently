import {Component, OnInit} from '@angular/core';
import {Inf} from '../../classes/Inf';
import {NgForm} from '@angular/forms';
import {Person} from '../../classes/person';
import {Help} from '../../classes/help';
import {DatabaseProviderService} from '../../services/database-provider.service';

@Component({
  selector: 'app-faq-and-help',
  templateUrl: './faq-and-help.component.html',
  styleUrls: ['./faq-and-help.component.sass']
})
export class FaqAndHelpComponent implements OnInit {
  person!: Person;
  commentM!: string;

  constructor(private database: DatabaseProviderService) {
  }

  ngOnInit(): void {
    this.person = Inf.person;
  }

  getWidth() {
    if (Inf.isDesktop) {
      return 'width: 70vw;';
    } else {
      return 'width: 98vw;';
    }
  }

  contact(form: NgForm): void {
    let help: Help = new Help();
    help.id = Date.now() + '-help';
    help.personName = form.value.name;
    help.personEmail = form.value.email;
    help.personMobile = form.value.mobile;
    help.text = form.value.comment;
    this.database.saveHelp(help);

    form.reset();
  }

  static showSuccess() {
    let alert = <HTMLElement> document.getElementById('alert');
    alert.style.display = 'block';


  }
}
