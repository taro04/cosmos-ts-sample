import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TxService {

  constructor(
    private http: HttpClient,
  ) {
    this.address_from_nemonic().then()
   }

  node_url = 'http://localhost:1317'
  chain_id = "mars"
  sdk = new cosmosclient.CosmosSDK(this.node_url,this.chain_id)

  address = ""
  balance = 0
  pub = ""
  json_ob:any
  //balances$! :Observable<string>;

  //デフォルトアドレス枠
  privKey! :proto.cosmos.crypto.secp256k1.PrivKey
  pubKey! :cosmosclient.PubKey
  fromAddress! :cosmosclient.AccAddress

  //デフォルトアドレスをニーモニックから取得(constractor)
  address_from_nemonic = async (): Promise<void> => {
    //set
    this.privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
      key: await cosmosclient.generatePrivKeyFromMnemonic('student stuff pretty six milk theme night alone pink drip deer bean shock melt hawk snack biology inform chimney table pottery lesson use dune'),
    });
    this.pubKey = this.privKey.pubKey();
    this.fromAddress = cosmosclient.AccAddress.fromPublicKey(this.pubKey);
  }

  //apiでaccountsを取得
  getBalance(address :string):void{
    const url = `${this.node_url}/cosmos/bank/v1beta1/balances/${address}`
    this.http.get<string>(url)
    .subscribe( jsonfile => {
          console.dir(jsonfile)
          //this.restApiService.log( jdon_type.id )
          this.address = address
          this.balance = JSON.parse(JSON.stringify(jsonfile))["balances"][0]['amount'] / 1
          this.json_ob = JSON.parse(JSON.stringify(jsonfile))["balances"] //ngForで表示する配列。
        });
      }

  //送金
  tx = async ( toAdr:string ): Promise<void> => {
    //bobのaddress(宛先)
    const address_bob = cosmosclient.AccAddress.fromString(toAdr)
    const toAddress = address_bob;

    // get account info
    const account = await rest.cosmos.auth
    .account(this.sdk, this.fromAddress)
    .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
    .catch((_) => undefined);
    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      console.log("if accout",account);
      return;
    }

    // build tx
    const msgSend = new proto.cosmos.bank.v1beta1.MsgSend({
      from_address: this.fromAddress.toString(),
      to_address: toAddress.toString(),
      amount: [{ denom: 'token', amount: '1' }],
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgSend)],
    });
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(this.pubKey),
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
    txBuilder.addSignature(this.privKey.sign(signDocBytes));

    // broadcast
    const res = await rest.cosmos.tx.broadcastTx(this.sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.cosmos.tx.BroadcastTxMode.Block,
    });
    console.log("res is ",res);
  }


}
