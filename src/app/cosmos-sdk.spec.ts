
import { cosmosclient, rest, proto } from 'cosmos-client';

//test
describe('bank', () => {
    it('send', async () => {
      expect.hasAssertions();
      const sdk = new cosmosclient.CosmosSDK('http://localhost:1317', 'mars');
      const privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
        //aliceのaddress
        key: await cosmosclient.generatePrivKeyFromMnemonic('now snap lottery error party involve double write palace letter merge cricket easy recall erupt swamp tornado buyer reopen arrive have angle dinner derive'),
      });
      const pubKey = privKey.pubKey();
      const address = cosmosclient.AccAddress.fromPublicKey(pubKey);
      expect(address.toString()).toStrictEqual('cosmos1qqva4829ujj4vrl9nxk6sc7nv8mn08zrjj3k5e');
      const fromAddress = address;
      const toAddress = address;

      // get account info
      const account = await rest.cosmos.auth
      .account(sdk, fromAddress)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);
      if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
        console.log(account);
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
      const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
      const signDocBytes = txBuilder.signDocBytes(account.account_number)
      txBuilder.addSignature(privKey.sign(signDocBytes));

      // broadcast
      const res = await rest.cosmos.tx.broadcastTx(sdk, {
        tx_bytes: txBuilder.txBytes(),
        mode: rest.cosmos.tx.BroadcastTxMode.Block,
      });
      console.log(res);
      expect(res.data.tx_response?.raw_log?.match('failed')).toBeFalsy()
    });
  });
