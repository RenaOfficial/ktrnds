import express, { Express, Request, Response } from 'express';
import { client } from '../bot';

const app: Express = express();
const port: number = 3001;

export function server() {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    try {
      // ボットが既にログインしている場合は再接続
      if (!client.isReady()) {
        res.json({ status: 'success', message: 'Bot is not ready' });
      } else {
        res.json({ status: 'success', message: 'Bot is ready' });
      }
    } catch (error) {
      console.error(error);
      res.json({ status: 'error', message: 'Failed to retrieve Bot status.' });
    }
  });

  app.post('/actions/start', (req: Request, res: Response) => {
    try {
      // ボットが既にログインしている場合は再接続
      if (!client.isReady()) {
        client.login(process.env.CLIENT_TOKEN);
      }
      res.json({ status: 'success', message: 'Bot started successfully' });
    } catch (error) {
      console.error(error);
      res.json({ status: 'error', message: 'Failed to start the bot' });
    }
  });

  app.post('/actions/restart', (req: Request, res: Response) => {
    try {
      // ボットがログインしている場合はログアウトして再接続
      if (client.isReady()) {
        client.destroy();
      }
      client.login(process.env.CLIENT_TOKEN);
      res.json({ status: 'success', message: 'Bot restarted successfully' });
    } catch (error) {
      console.error(error);
      res.json({ status: 'error', message: 'Failed to restart the bot' });
    }
  });

  app.post('/actions/stop', (req: Request, res: Response) => {
    try {
      // ボットがログインしている場合はログアウト
      if (client.isReady()) {
        client.destroy();
      }
      res.json({ status: 'success', message: 'Bot stopped successfully' });
    } catch (error) {
      console.error(error);
      res.json({ status: 'error', message: 'Failed to stop the bot' });
    }
  });

  app.listen(port, () => {
    console.log(`Dashboard is running at http://localhost:${port}`);
  });
}
