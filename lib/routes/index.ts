import { Application } from 'express'
import { BalanceController } from '../controllers/BalanceController';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { LocalController } from '../controllers/LocalController';

export class ApiRouter {
  public AuthController: AuthController = new AuthController();
  public BalanceController: BalanceController  = new BalanceController();
  public UserController: UserController = new UserController();
  public LocalController: LocalController = new LocalController();

  public routes = (app: Application): void => {

    app.route('/v1/login').post(this.AuthController.Login);
    app.route('/v1/users').get(this.UserController.List);
    app.route('/v1/balance').get(this.BalanceController.GetBalance);

    app.route('/v1/local').get(this.LocalController.readLocal);
    app.route('/v1/local').patch(this.LocalController.updateLocal);

    app.route('/v1/send_coins').post(this.BalanceController.SendCoins);
  }
}