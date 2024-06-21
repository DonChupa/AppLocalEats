import { Component, OnInit } from '@angular/core';
import { DatabaseService, RepOut} from 'src/app/Services/DatabaseService/database.service';
import { DataService } from 'src/app/Services/DataService/data.service';
import { Observable, EMPTY } from 'rxjs';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  repartidor$ : Observable<RepOut[]> = EMPTY;
  cond : boolean = true;
  constructor(private db : DatabaseService, private data : DataService) { }
  
  async ngOnInit() {
    
    const a =  await this.data.getItem('rest');
    this.repartidor$ =  this.db.loadClient(a[0]);
  }

}
