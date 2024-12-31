const { alldown } = require("aryan-videos-downloader");
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const botToken = 'BOT TOKEN';
const bot = new TelegramBot(botToken, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const url = msg.text.trim();

    if (!isValidUrl(url)) {
        return bot.sendMessage(chatId, 'Invalid URL. Please send a valid video URL.');
    }

    const loadingMessage = await bot.sendMessage(chatId, 'Processing your request...');

    try {
    
        const data = await alldown(url);
        console.log(data);

        const { low, high, title } = data.data; 

        let aryan;
        try {
            
            const vidResponse = await axios.get(high, { responseType: 'stream' });
            aryan = vidResponse.data; 
        } catch (error) {
            console.error('Error streaming video:', error);
            aryan = high; 
        }

        
        await bot.sendVideo(chatId, aryan, {
            caption: `🎬 Video download ${title}`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Bot Owner', url: 'https://t.me/BDT-JISAN' }]
                ]
            }
        });

       
        bot.deleteMessage(chatId, loadingMessage.message_id);

    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'ERROR 😉😇🥰');
    }
});


function isValidUrl(url) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
}

console.log("Aryan Telegram Bot Running");
