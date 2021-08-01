import { Component, OnInit } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { TxService } from "../tx.service"

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  constructor(
    public txService:TxService
    ) {}

  ngOnInit(): void {
  }

  l_address:string = ""
  //default_address :string = this.txService.fromAddress.toString()
  default_address = ""


  settxt():void{
    this.l_address = "cosmos18zg32qd9ne3pgkpuhnmlstk4m50uhckq9vylzc"
    this.default_address = this.txService.fromAddress.toString()
  }

  tx():void{
    this.l_address = "tx"
  }

  getAccounts(str:string):void{
    this.l_address = "ga"
  }

}
