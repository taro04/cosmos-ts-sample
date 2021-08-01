import { Component, OnInit } from '@angular/core';
import { TxService } from "../tx.service"
import { Observable } from 'rxjs';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  constructor(
    public txService:TxService
  ) {  }

  ngOnInit(): void {
  }

  //balances$ :Observable<string> = this.txService.getBalance$()
  denoms = this.txService.json_ob

}
