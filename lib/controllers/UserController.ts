import { Request, Response } from 'express';
import User from '../models/User';

export class UserController {
  public List = async (req: Request, res: Response): Promise<any> => {
    const perPage: number = 5;      
    const page: number = parseInt(req.query.page) || 1;

    try {
      let users = await User.find({}).skip((perPage * page) - perPage).limit(perPage);
      let count = await User.count({});
      return res.status(200).json({
        success: true,
        users,
        count,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: error.message
      });
    }
  }
}