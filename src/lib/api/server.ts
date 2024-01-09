import express, { NextFunction, Request, Response } from 'express';
import { log } from '@/lib/classes/ExtendedClient';
import captcha from '@/lib/models/captcha';
import captcha_sessions from '@/lib/models/captcha_sessions';
import axios from 'axios';
import { client } from '@/index';

export const run_server = () => {
  const app = express();
  const port = 3004;

  app.use((req, res, next) => {
    log(`${req.method} ${req.url}`, 'DEBUG');
    next();
  });

  const allowCrossDomain = function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3005');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, access_token'
    );

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    } else {
      next();
    }
  };
  app.use(allowCrossDomain);

  app.get('/', (req, res) => {
    res.json({
      status: true,
      message: 'Internal API is now ready!',
    });
  });

  app.post(
    '/captcha/:captchaId',
    async (
      req: Request<{ captchaId: string }, {}, { user_id: string }>,
      res
    ) => {
      // サーバーと認証システムを紐づけるためのUUID
      const captcha_id = req.params.captchaId;
      const user_id = req.body.user_id;

      const document = await captcha.findOne({
        CaptchaID: captcha_id,
      });

      if (!document) {
        return res.status(400).json({
          status: false,
          message: 'Data not found',
        });
      }

      const guild_id = document.GuildID;
      const role_id = document.RoleID;

      const guild = client.guilds.cache.get(guild_id);

      if (!guild) {
        return res.status(400).json({
          status: false,
          message: 'Guild not found',
        });
      }

      const role = guild.roles.cache.get(role_id);

      if (!role) {
        return res.status(400).json({
          status: false,
          message: 'Role not found',
        });
      }

      const member = guild.members.cache.get(user_id);

      if (!member) {
        return res.status(400).json({
          status: false,
          message: 'Member not found',
        });
      }

      member.roles
        .add(role.id)
        .then(() => {
          return res.status(200).json({
            status: true,
          });
        })
        .catch((e) => {
          return res.status(400).json({
            status: true,
            message: e.toString(),
          });
        });
    }
  );

  app.get('/sessions/:captchaId', async (req, res) => {
    const captcha_id = req.params.captchaId;
  });

  app.get('/captcha/:captchaId', async (req, res) => {
    // サーバーと認証システムを紐づけるためのUUID
    const captcha_id = req.params.captchaId;

    // UUIDが存在するか確認
    const document = await captcha.findOne({ CaptchaID: captcha_id });

    // 存在しなかった場合
    if (!document) {
      return res.status(200).json({
        status: true,
        data: null,
      });
    }

    // 存在した場合
    if (document) {
      return res.status(200).json({
        status: true,
        data: document,
      });
    }
  });

  app.post('/oauth2/:code', async (req, res) => {
    const code = req.params.code;

    if (!code) {
      return res.status(400).json({
        status: false,
        message: 'Missing OAuth2 Code',
      });
    }

    const body = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code,
    });

    const access_token = (
      await axios.post('https://discord.com/api/oauth2/token', body)
    ).data.access_token;

    const user_data = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.status(200).json({
      status: true,
      data: user_data,
    });
  });

  app.listen(port, () => {
    log(`Server is running on port ${port}`, 'INFO');
  });
};
