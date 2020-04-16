import { Request, Response } from 'express';

import fs from 'fs';
import path from 'path';

export class LocalController {
  public localDir: string = path.join(__dirname, '../../local.json');

  /**
   * @type    GET
   * @desc    Get localization data from json file which direction on base dir on server
   */
  public readLocal = async (req: Request, res: Response): Promise<any> => {
    try {
      let localFileExist = await fs.existsSync(this.localDir);
      if (!localFileExist) throw new Error('File not exist');

      let localFileData = await fs.readFileSync(this.localDir, 'utf-8');
      if (!localFileData) throw new Error('Error reading');

      let localFileJson = await JSON.parse(localFileData);
      if (!localFileJson) throw new Error('Invalid file data. Cannot parse json');

      return res.status(200).json({ local: localFileJson });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: error.message
      });
    }
  }

  /**
   * @type    PATCH
   * @desc    Update localization file from request
   */
  public updateLocal = async (req: Request, res: Response) => {
    const { localData } = req.body;
    try {
      if (!localData) throw new Error('Local is required');

      let localFileExist = await fs.existsSync(this.localDir);
      if (!localFileExist) throw new Error('File not exist');

      await fs.writeFileSync(this.localDir, JSON.stringify(localData), 'utf-8');
      return res.status(200).json({
        success: true,
        local: localData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: error.message
      });
    }
  }
}