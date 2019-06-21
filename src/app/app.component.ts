import { Component, OnInit } from "@angular/core";
import { Http, Response } from "@angular/http";
import { map } from 'rxjs/operators';
import { SpeechObject } from './model/speech';


export type Item = { id: number, speech: string };
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  author: string;
  authors: Array<String>;
  authorSpeeches: Array<SpeechObject>;
  speeches: Array<SpeechObject>;
  speechesList: Array<SpeechObject>;
  searchedList: Array<SpeechObject>;
  itemTemp: SpeechObject;
  showMenu: boolean;
  isSearching: boolean;
  isNew: boolean;
  search: string;
  speechModel: SpeechObject;
  speechIndex: number;
  title = 'conceptual-challenge';

  constructor(private http: Http) {}

  ngOnInit() {
    this.getSpeeches();
    this.getAuthors();
    this.showMenu = true;
    this.isSearching = true;
  }

  getSpeeches() {
    const retrievedObject = localStorage.getItem("speechesData");
    const speeches = JSON.parse(retrievedObject);

    if(speeches && speeches.length > 0) {
      this.speeches = speeches;
      this.speechesList = speeches;      
      this.speechModel = this.speeches.find(x => x.isSelected);
      this.author = this.speechModel.author;
    } else {
      this.http
      .get("/assets/data/speeches.json")
      .pipe(map(data => data.json() as Array<SpeechObject>))
      .subscribe(data => {
        this.speeches = data;
        this.speechesList = this.speeches;
        this.speechModel = this.speeches[0] as SpeechObject;
        this.author = this.speechModel.author;
        localStorage.setItem("speechesData", JSON.stringify(this.speeches));
      });
    }
   
  }

  getAuthors() {
    this.authors = [];
    for (var i = 0; i < this.speeches.length; i++) {
      if(this.authors.length > 0) {
        const isExist = (this.authors.indexOf(this.speeches[i].author) > -1)
        if(!isExist)
          this.authors.push(this.speeches[i].author);      
      } else {
        this.authors.push(this.speeches[i].author);  
      }
        
    } 
  }

  getSpeechByAuthor(author) {
      this.isNew = false;
      let speechTemp = [];
      for (var i = 0; i < this.speechesList.length; i++) {
        if(author === this.speechesList[i].author)
          speechTemp.push(this.speechesList[i]) ; 
      }    
      
      this.speeches = speechTemp; 
      this.speechModel = this.speeches[0] as SpeechObject;
      this.author = this.speechModel.author;
  }

  saveSpeech() {

    var r = confirm("Do you want to save the speech?");
    if (r == true) {
      if(!this.speechModel.id && this.isNew) {
        let id = this.speeches.length + 1;
   
        this.removeSelectedSpeech();              
        this.speechModel.id = id;
        this.speechModel.isSelected = true;
        this.speechesList.push(this.speechModel);
        this.speechIndex = this.speeches.length - 1;
        this.isNew = false;  
      } 
  
      localStorage.setItem("speechesData", JSON.stringify(this.speechesList));  
      this.getAuthors();
        
    }     
    
  }

  createSpeech() {
    this.speechModel = {} as SpeechObject;
    this.isNew = true;
  }

  viewSpeeches() {
    this.isNew = false;
    this.getSpeeches();
  }

  deleteSpeech() {
    var r = confirm("Are you sure to delete this speech?");
    if (r == true) {
      for(var i = 0; i < this.speeches.length; i++) {
        if(this.speeches[i].id == this.speechModel.id) {
          this.speeches.splice(i, 1);
          this.speechModel = this.speeches[this.speeches.length - 1] as SpeechObject;
          this.speechModel.isSelected = true;
          localStorage.setItem("speechesData", JSON.stringify(this.speeches));
          this.speechIndex = this.speeches.length - 1;
        }
      }
    } 
  }

  removeSelectedSpeech() {
    for(var i = 0; i < this.speeches.length; i++) {
      this.speeches[i].isSelected = false;
    }
  }

  showSpeech(item, index) {
     this.speechModel.isSelected = false;
     this.speechModel = item;
     item.isSelected = true;
     this.speechIndex = index;
     this.showMenu = true;
     this.isSearching = true;
     this.search = '';
  }

  searchSpeech(speech) {
    const list = this.speechesList.filter(x => x.speech.toLowerCase().includes(speech.toLowerCase()));

    this.searchedList = list;
    this.isSearching = false;
  }
}
