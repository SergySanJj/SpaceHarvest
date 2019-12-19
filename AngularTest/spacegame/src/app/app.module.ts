import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GuiColumnComponent } from './gui-column/gui-column.component';
import { InfoBlockComponent } from './info-block/info-block.component';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';

@NgModule({
  declarations: [
    AppComponent,
    GuiColumnComponent,
    InfoBlockComponent,
    ChatComponent,
    ChatMessageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
