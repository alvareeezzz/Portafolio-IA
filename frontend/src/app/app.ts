import { Component, inject } from '@angular/core';
import { IdiomaService } from './i18n/idioma.service';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Hero } from './sections/hero/hero';
import { Timeline } from './sections/timeline/timeline';
import { Projects } from './sections/projects/projects';
import { Contact } from './sections/contact/contact';
import { ContactModal } from './sections/contact/contact-modal';
import { Chat } from './chat/chat';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, Hero, Timeline, Projects, Contact, ContactModal, Chat],
  templateUrl: './app.html'
})
export class App {
  protected readonly i18n = inject(IdiomaService);
}
