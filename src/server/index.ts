import express, { Express, Request, Response } from 'express';
import { client } from '../bot';

const app: Express = express();
const port: number = 3001;

export function server() {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    try {
      // ボットが既にログインしている場合は再接続
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
    try {
      if (!client.isReady()) {
        client.login(process.env.CLIENT_TOKEN).then(() => {
          console.log(
            '\x1b[33mStart the bot upon request from the dashboard\x1b[0m'
          );
          res.json({
            status: true,
            message: 'Bot started successfully',
          });
        });
      }
      res.json({
        status: true,
        message: 'Bot started successfully',
      });
    } catch (error) {
      res.json({
        status: false,
        message: error,
      });
    }
  });

  app.post('/actions/restart', (req: Request, res: Response) => {
    try {
      if (client.isReady()) {
        console.log(
          '\x1b[33mRestart the bot upon request from the dashboard\x1b[0m'
        );
        client.destroy().then(() => {
          client.login(process.env.CLIENT_TOKEN).then(() => {
            res.json({
              status: true,
              message: 'Bot restarted successfully',
            });
          });
        });
      } else {
        console.log(
          '\x1b[33mRestart(Start) the bot upon request from the dashboard\x1b[0m'
        );
        client.login(process.env.CLIENT_TOKEN).then(() => {
          res.json({
            status: true,
            message: 'Bot restarted successfully',
          });
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: error,
      });
    }
  });

  app.post('/actions/stop', (req: Request, res: Response) => {
    try {
      if (client.isReady()) {
        console.log(
          '\x1b[33mStop the bot upon request from the dashboard\x1b[0m'
        );
        client.destroy().then(() => {
          res.json({
            status: true,
            message: 'Bot stopped successfully',
          });
        });
      } else {
        res.json({
          status: true,
          message: 'Bot stopped successfully',
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
