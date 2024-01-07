import axios from 'axios';
import express from 'express';
import Schema from '../../src/lib/models/webCaptcha';
import { log } from '../../src/lib/classes/ExtendedClient';
import { client } from '../../src';
import { randomUUID } from 'crypto';

const run_server = () => {
  const app = express();
  const port = 3003;

  const params = {
    client_id: process.env.CLIENT_ID,
    redirect_uri: `http://localhost:` + port + '/callback',
    scope: 'identify',
    response_type: 'code',
  };

  const oauth_url =
    `https://discord.com/api/oauth2/authorize?` + new URLSearchParams(params);

  app.listen(port, () =>
    log('Server is ready: http://localhost:' + port, 'INFO')
  );

  let id: string;

  app.get('/login', async (req, res) => {
    // IDを取得
    id = req.query.id as string;

    if (!id) return res.sendFile(__dirname + '/html/invalid_id.html');

    const data = client.webCaptcha.get(id);

    if (!data) return res.sendFile(__dirname + '/html/invalid_id.html');

    res.redirect(oauth_url);
  });

  app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) return res.sendFile(__dirname + '/html/invalid_code.html');
    if (!id) return res.sendFile(__dirname + '/html/invalid_id.html');

    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: 'http://localhost:3003/callback',
      code: code as string,
      grant_type: 'authorization_code',
    });

    const token_response = await axios
      .post('https://discord.com/api/oauth2/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch(() => {
        res.sendFile(__dirname + '/html/cannot_get_token.html');
      });

    if (!token_response)
      return res.sendFile(__dirname + '/html/cannot_get_token.html');
    if (!token_response.data)
      return res.sendFile(__dirname + '/html/cannot_get_token.html');

    const user_response = await axios
      .get('https://discordapp.com/api/v8/users/@me', {
        headers: {
          Authorization: `Bearer ${token_response.data.access_token}`,
        },
      })
      .catch(() => {
        res.sendFile(__dirname + '/html/cannot_get_user.html');
      });

    const collection = client.webCaptcha.get(id);

    const captcha_data = await Schema.findOne({ GuildID: collection?.GuildID });
    const guild = client.guilds.cache.get(captcha_data?.GuildID || '');

    const userId = user_response?.data.id;

    const user = client.users.cache.get(userId);

    if (!user || user?.id !== client.webCaptcha.get(id)?.UserID) return;

    if (!guild) return res.sendFile(__dirname + '/html/guild_not_found.html');

    const data = await Schema.findOne({ GuildID: guild?.id });

    if (data) {
      const member = await guild.members.fetch(user.id);

      if (!user) return res.sendFile(__dirname + '/html/cannot_get_user.html');
      member.roles
        .add(`${data.RoleID}`)
        .then(() => {
          res.sendFile(__dirname + '/html/verify_success.html');
        })
        .catch((e) => {
          res.sendFile(__dirname + '/html/verify_error.html');
          console.log(e);
        });
    }
  });
};

export { run_server };
