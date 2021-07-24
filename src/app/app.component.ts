import { Component } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cosmos-ts-sdk2';


  constructor(
  ) {
    this.example().then(); //実行
  }

  public example = async (): Promise<void> => {
    const sdk = new cosmosclient.CosmosSDK('http://localhost:1317', 'mars')
    const privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
        key: await cosmosclient.generatePrivKeyFromMnemonic('joke door law post fragile cruel torch silver siren mechanic flush surround'),
      });
    console.log("privkey is ",privKey)
    const pubKey = privKey.pubKey();
    console.log("pubkey is ",pubKey)
    const address = cosmosclient.AccAddress.fromPublicKey(pubKey);
    console.log("address is ",address)
    const fromAddress = address;
    const toAddress = address;

    // get account info
    const account = await rest.cosmos.auth
    .account(sdk, fromAddress)
    .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
    .catch((_) => undefined);
    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      console.log("if accout",account);
      return;
    }
  }




  //import { cosmosclient, rest, cosmos } from '../../..';




}
