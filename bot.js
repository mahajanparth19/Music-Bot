const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core');
const prefix = '!';
bot_secret_token = "NzE3NjE2NzIwNDE1Njg2NjU2.Xtc7RA.Yeq1YHrQRnb-3B4gK2t9R9T-67E"

client.login(bot_secret_token)


// client.on('message', (receivedMessage) => {
// 	console.log(receivedMessage.author.toString())
//     // Prevent bot from responding to its own messages
//     if (receivedMessage.author == client.user) {
//         return
//     }

//     if(receivedMessage.author.toString() == "<@714470905757040691>"){
// 	    receivedMessage.channel.send("Hii Matko")
// 	}
// else if(receivedMessage.author.toString() == "<@412279786480599050>"){
// 	receivedMessage.channel.send("Hii Cartoon")
// }
// 	else{
// 		receivedMessage.channel.send("Hii Unknown")
// 	}
// })

client.on('message', async message => {
	const connection = await message.member.voice.channel.join();
	if(message.content.startsWith(`${prefix}play`)){
		play(message,connection);
	}
	else if(message.content.startsWith(`${prefix}stop`)){
		connection.dispatcher.end();
	}
    

});

const play = (message,connection) => {
	const song_name = message.content.split(" ");
	//song_name = song_name[]
	console.log("started");
	connection.play(ytdl('https://www.youtube.com/watch?v=QK8mJJJvaes', { filter: 'audioonly' }));
}