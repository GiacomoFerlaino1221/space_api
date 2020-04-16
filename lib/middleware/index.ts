import { Request, Response, NextFunction } from 'express';

export const ApiProtector = (req: Request, res: Response, next: NextFunction) => {
  let key = req.headers['x-minter-key'] || undefined;
  
  if (req.url === '/v1/payment_success') next();

  if (!key) {
    res.status(401).send();
  } else {
    let MinterApiKey = process.env.ACCESS_KEY;
    if (key !== MinterApiKey) res.status(401).send();
    else {
      next();
    }
  }
}