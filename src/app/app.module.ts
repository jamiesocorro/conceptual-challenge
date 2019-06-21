import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AngularFireModule } from '@angular/fire';  
import { environment } from '../environments/environment'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFontAwesomeModule,
    FormsModule, 
    AngularFireModule.initializeApp(environment.firebase)  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
