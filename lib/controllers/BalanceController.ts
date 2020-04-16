import { Request, Response } from 'express';
import User from '../models/User';

import axios from 'axios';
import crypto from 'crypto';
import request from 'request';

const Minter = require('minter-js-sdk').Minter;
const Minter_TX_TYPE = require('minter-js-sdk').TX_TYPE;
const minterAPI = new Minter({ apiType: 'node', baseURL: 'https://minter-node-1.testnet.minter.network/' });
const MinterWallet = require('minterjs-wallet');

export class BalanceController {
  public GetBalance = (req: Request, res: Response) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).send();

    User.findById(userId)
      .then((user) => {
        if (!user) return res.status(404).send();

        this.Balance(user.wallet)
          .then((data: any) => {
            let balance = parseFloat(data.balance) / 10000000000000000;
            balance = balance / 100;
            return res.status(200).json({ balance });
          }).catch((err) => {
            return res.status(400).send();
          })
          
      }).catch((err) => {
        return res.status(500).json({
          success: false,
          msg: err.message
        });
      });
  }

  private Balance = (wallet: string) => {
    return new Promise((resolve, reject) => {
      // https://minter-node-1.testnet.minter.network
      // https://testnet.node-api.minter.network
      axios.get(`https://minter-node-1.testnet.minter.network/address?address=${wallet}`)
      .then(({ data }) => {
        // 10.00 0000000000000000
        const balance = data.result.balance.MNT;
        resolve({ balance });
      }).catch((err) => reject({ msg: err.message }));
    });
  }

  public SendCoins = (req: Request, res: Response) => {
    const walletAddrTo = req.body.wallet;
              
    const walletFrom = MinterWallet.walletFromMnemonic(process.env.MINTER_MNEMONIC);
    const walletAddrFrom = walletFrom.getAddressString();
    
    
    let tr_addr = walletAddrTo;
    let tr_coin = 'MNT';
    let tr_amount = req.body.amount;
    
    let txParams = {
      privateKey: walletFrom.getPrivateKeyString(),
      nonce: minterAPI.getNonce(walletAddrFrom),
      chainId: 2,
      type: Minter_TX_TYPE.SEND,
      data: {
        to: tr_addr,
        value: tr_amount,
        coin: tr_coin
      },
      gasCoin: 'MNT',
      gasPrice: 1
    }
    
    minterAPI.postTx(txParams).then(() => {
      return res.status(200).json({});
    }).catch((err: any) => {
      return res.status(500).json({});
    });
  };

  public Payment = (req: Request, res: Response) => {
    const apiKey = 'y0XaMQxwEFjL8byhNFuCTs1qCbOEGlOzufb3oHcc';
    const apiSecret = 'Hu3JQKojVcS0LAXvenLyZuj908Hpiohj0XKNHtcM';
    
    const apiPath = '/v3/auth/merchant/deposit';
    // const apiPath = 'v3/auth/deposit/details';

    const nonce = Date.now().toString();

    const body = {
      currency: 'uah',
      amount: 1,
      payment_service: 'default',
      return_url: 'http://spacegame.store/token=dmazjllkdp/',
      callback_url: 'http://api.spacegame.store/v1/payment_success'
    };

    let signature = `${apiPath}${nonce}${JSON.stringify(body)}`
 
    const sig = crypto.createHmac('sha384', apiSecret).update(signature)
    const shex = sig.digest('hex');
    
    request.post(`https://api.kuna.io${apiPath}`, {
      headers: {
        'kun-nonce': nonce,
        'kun-apikey': apiKey,
        'kun-signature': shex
      },
      body: body,
      json: true
    }, (err, resp, b) => {
      return res.status(200).json(b);
    })
  }

  public PaymentSuccess = (req: Request, res: Response) => {
    console.log(req.body);
  }
}
