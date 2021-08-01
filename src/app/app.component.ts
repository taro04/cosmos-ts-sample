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

  sdk = new cosmosclient.CosmosSDK('http://localhost:1317', 'mars')

  public example = async (): Promise<void> => {
    //set
    const privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
      //key: await cosmosclient.generatePrivKeyFromMnemonic('joke door law post fragile cruel torch silver siren mechanic flush surround'),
      //aliceのaddress
      key: await cosmosclient.generatePrivKeyFromMnemonic('now snap lottery error party involve double write palace letter merge cricket easy recall erupt swamp tornado buyer reopen arrive have angle dinner derive'),
    });
    console.log("alice privkey is ",privKey)
    const pubKey = privKey.pubKey();
    console.log("alice pubkey is ",pubKey)
    const address = cosmosclient.AccAddress.fromPublicKey(pubKey);
    console.log("alice address is ",address.toString())
    const fromAddress = address;

    //bobのaddress
    const address_bob = cosmosclient.AccAddress.fromString('cosmos1z97fwvh00l4qsv0v6dprczyut6aphazsusdzfx')
    console.log("bob address is ",address_bob.toString())
    const toAddress = address_bob;

    //conyのaddress(cliで作成)
    const address_cony = cosmosclient.AccAddress.fromString('cosmos1z97fwvh00l4qsv0v6dprczyut6aphazsusdzfx')
    console.log("bob address is ",address_cony.toString())
    const toAddress_C = address_cony;

    // get account info
    const account = await rest.cosmos.auth
    .account(this.sdk, fromAddress)
    .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
    .catch((_) => undefined);
    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      console.log("if accout",account);
      console.log("bye bye");
      return;
    }

    // build tx
    const msgSend = new proto.cosmos.bank.v1beta1.MsgSend({
      from_address: fromAddress.toString(),
      to_address: toAddress.toString(),
      amount: [{ denom: 'token', amount: '1' }],
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgSend)],
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: account.sequence,
        },
      ],
      fee: {
        gas_limit: cosmosclient.Long.fromString('200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(this.sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(account.account_number)
    txBuilder.addSignature(privKey.sign(signDocBytes));

    // broadcast
    const res = await rest.cosmos.tx.broadcastTx(this.sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.cosmos.tx.BroadcastTxMode.Block,
    });
    console.log("res is ",res);
  }
}
