import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number = 3001;

export function server() {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'success', message: 'Dashboard started successfully' });
  });

  app.post('/actions/start', (req: Request, res: Response) => {
    // TODO: Implement logic to start the bot
    res.json({ status: 'success', message: 'Bot started successfully' });
  });

  app.post('/actions/restart', (req: Request, res: Response) => {
    // TODO: Implement logic to restart the bot
    res.json({ status: 'success', message: 'Bot restarted successfully' });
  });

  app.post('/actions/stop', (req: Request, res: Response) => {
    // TODO: Implement logic to stop the bot
    res.json({ status: 'success', message: 'Bot stopped successfully' });
  });

  app.listen(port, () => {
    console.log(`Dashboard is running at http://localhost:${port}`);
  });
}
