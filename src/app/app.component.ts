import { Component } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cosmos-ts-sdk2';

  sdk = new cosmosclient.CosmosSDK('http://localhost:1317', 'testchain');



  //import { cosmosclient, rest, cosmos } from '../../..';




}
