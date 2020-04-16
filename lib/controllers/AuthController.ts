import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

export class AuthController {
  public Login = (req: Request, res: Response) => {
    const { credentials } = req.body;
    const secret = process.env.JWT_SECRET || '';

    if (!credentials) return res.status(401);

    User.findOne({ username: credentials.username })
      .then((user) => {
        if (!user) return res.status(401);

        if (!user.isAdmin) {
          return res.status(200).json({ success: false, msg: 'No admin' });
        } else {
          let token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });
          let validPassword = user.password === credentials.password;

          if (!validPassword) return res.status(200).json({ success: false, msg: 'Ivalid password' });
          return res.status(200).json({ success: true, token, id: user._id });
        }

      }).catch((err) => {
        return res.status(500).json({ success: false, msg: err.message });
      });
  }
}