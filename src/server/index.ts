import express, { Express, Request, Response } from 'express';
import { client, start } from '../bot';
import { ready } from '../bot/lib/functions/ready';

const app: Express = express();
const port: number = 3001;

export function server() {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    try {
      console.log(
        '\x1b[33mWrite the bot status upon request from the dashboard\x1b[0m'
      );
      if (!client.isReady()) {
        res.json({
          status: true,
          ready: false,
          message: 'Bot is not ready',
        });
      } else {
        res.json({
          status: true,
          ready: true,
          message: 'Bot is ready',
        });
      }
    } catch (error) {
      res.json({
        status: false,
        ready: false,
        message: error,
      });
    }
  });

  app.post('/actions/start', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    try {
      if (!client.isReady()) {
        start();
        client.isReady = () => true;
        ready();
        console.log(
          '\x1b[33mStart the bot upon request from the dashboard\x1b[0m'
        );
        res.json({
          status: true,
          message: 'Bot started successfully',
        });
      }
      res.json({
        status: true,
        message: 'Bot is already started',
      });
    } catch (error) {
      res.json({
        status: false,
        message: error,
      });
    }
  });

  app.post('/actions/restart', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    try {
      console.log(
        '\x1b[33mRestart the bot upon request from the dashboard\x1b[0m'
      );
      client.destroy().then(() => {
        start();
        client.isReady = () => true;
        ready();
        res.json({
          status: true,
          message: 'Bot restarted successfully',
        });
      });
    } catch (error) {
      res.json({
        status: false,
        message: error,
      });
    }
  });

  app.post('/actions/stop', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    try {
      if (client.isReady()) {
        console.log(
          '\x1b[33mStop the bot upon request from the dashboard\x1b[0m'
        );
        client.destroy().then(() => {
          client.isReady = () => false;
          res.json({
            status: true,
            message: 'Bot stopped successfully',
          });
        });
      } else {
        res.json({
          status: true,
          message: 'Bot is already stopped',
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: error,
      });
    }
  });

  app.listen(port, () => {
    console.log(`Dashboard is running at http://localhost:${port}`);
  });
}
