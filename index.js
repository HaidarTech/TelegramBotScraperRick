const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input"); // npm i input
const { Api } = require("telegram");


require('dotenv').config();

const apiId = parseInt(process.env.API_ID, 10); // Ensure this is an integer
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.STR_SESSION);

    // Forwards messgae to another channel and doesnt show author
  const forwardTelegramMessage = async (client, message) => {
    try {
      const targetChannel = await client.getEntity(process.env.YOUR_CHANNEL_ID); // Replace with your target channel ID
      const result = await client.invoke(
        new Api.messages.ForwardMessages({
          fromPeer: message.peerId,
          id: [message.id],
          toPeer: targetChannel,
          dropAuthor: true,
        })
      );
      console.log(`Message forwarded to channel: ${result.updates[0].message}`);
    } catch (error) {
      console.error("Failed to forward message to the channel:", error);
    }
  };
  
  const startTelegramBot = async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
  
    client.addEventHandler(async (event) => {
        const message = event.message;
        // check the name
        const sender = await message.getSender();
        console.log(sender.username);
        const messageDate = new Date(message.date * 1000); // Convert Unix time to Date object
        console.log(`Message time: ${messageDate.toLocaleString()}`); // Log the message time

        if (sender && (sender.username == "RickBurpBot")) {
            console.log(`Received message: ${message.text}`);
            console.log(`Chat ID: ${event.chatId}`);
            console.log(`Push this message ${message.text}`);
            await forwardTelegramMessage(client, message);
            }
            else {
                console.log("no pump found")
            }
      }, new NewMessage({}));
  
    process.stdin.resume();
  };
  
  startTelegramBot();
