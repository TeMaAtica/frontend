const { Telegraf, Markup } = require("telegraf");
const TOKEN = "7350390272:AAEjWGw8_WS6rHePCHqZtilgg33ml2FlvkM";
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://temaatica.github.io/frontend/";
const community_link = "https://github.com/TeMaAtica/frontend";


bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(`Hey, Welcome to our app, tap to get your coin
Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.`, {
        reply_markup: {
            inline_keyboard: [
              [{ text: "👋 TEMATIKA !", web_app: { url: urlSent } }],
              [{ text: "Join our Community", url: community_link }]

            ],
            in: true
        },
    });
  });



  bot.launch();

app.listen(3005, () => {
    console.log("server is me and now running")
})