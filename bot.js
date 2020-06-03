const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core');
const prefix = '!';
const fetch = require("node-fetch");
const api  = "AIzaSyAXXme78yMoN86fZBxMxhlre0Lq1Wootjk";
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
	let vid;
	let song_name = message.content.substring(6);
	song_name = song_name.replace(/ /g,"%20");
	console.log(song_name);
	url = `https://www.googleapis.com/youtube/v3/search?q=${song_name}&key=${api}`;
	console.log(url);
	fetch(url)
	.then(response => response.json())
    .then(data => {
    	console.log(data.items[0].id.videoId);
    	vid = data.items[0].id.videoId;
    	let link = `https://www.youtube.com/watch?v=${vid}`;
		//console.log(link);
		connection.play(ytdl(link, { filter: 'audioonly' }));
    });
	//song_name = song_name[]
	console.log("started");
}