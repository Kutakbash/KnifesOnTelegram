const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const server = express();
const TOKEN = "7065595742:AAFSey-iWFOytqBvuMhNtvS6os0F_yAqrUw";
const bot = new TelegramBot(TOKEN, {
    polling: true
});
const port = process.env.PORT || 5000;
const gameName = "KnifesOnTelegram";
let queries = {};
server.use(express.static(path.join(__dirname, 'KnifesOnTelegram')));
bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Type /game if you want to play."));
//bot.onText(/start|game/, (msg) => bot.sendMessage(msg.from.id, gameName));
bot.onText(/start|game/, (msg) => {
    console.log('nigga')
});
bot.on("callback_query",  query => {
    if (query.game_short_name !== gameName) {
        return bot.answerCallbackQuery(query.id, `Sorry, ${query.game_short_name} is not available.`);
    } else {
        queries[query.id] = query;
        let gameurl = "https://kutakbash.github.io/KnifesOnTelegram/";
        return bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});
bot.on("inline_query",  iq => {
    return bot.answerInlineQuery(iq.id, [{
        type: "game",
        id: "0",
        game_short_name: gameName
    }]);
});
server.get("/highscore/:score",  (req, res, next) => {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = queries[req.query.id];
    let options;
    if (query.message) {
        options = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        };
    } else {
        options = {
            inline_message_id: query.inline_message_id
        };
    }
    return bot.setGameScore(query.from.id, parseInt(req.params.score), options,
        function (err, result) {});
});
server.listen(port);