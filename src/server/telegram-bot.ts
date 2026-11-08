const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

const MAX_LEN = 4096;



const TELEGRAM_BOT_TOKEN = '9229914447:AAHvP6B-VRKeTa8yNmKJwC0a342pEP__M3c';

const TELEGRAM_CHAT_ID = '-5247926089';



export const getTelegramConfig = () => ({

    token: TELEGRAM_BOT_TOKEN,

    chatId: TELEGRAM_CHAT_ID

});



export const deleteTelegramMessage = async (token: string, chatId: string, messageId: number) => {

    try {

        await fetch(`${TELEGRAM_API(token)}/deleteMessage`, {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ chat_id: chatId, message_id: messageId })

        });

    } catch {

        /* ignore delete failures */

    }

};



export const sendTelegramNotify = async (opts: {

    token: string;

    chatId: string;

    message: string;

    previousMessageId?: number | null;

}): Promise<number | null> => {

    const { token, chatId, message, previousMessageId } = opts;

    if (!token || !chatId || !message.trim() || message.length > MAX_LEN) return null;



    if (previousMessageId && previousMessageId > 0) {

        await deleteTelegramMessage(token, chatId, previousMessageId);

    }



    const res = await fetch(`${TELEGRAM_API(token)}/sendMessage`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

            chat_id: chatId,

            text: message,

            parse_mode: 'HTML'

        })

    });



    const data = (await res.json()) as { ok?: boolean; result?: { message_id?: number } };

    if (!data.ok || typeof data.result?.message_id !== 'number') return null;

    return data.result.message_id;

};


