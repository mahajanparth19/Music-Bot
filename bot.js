const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core');
const prefix = '!';
const fetch = require("node-fetch");
const api  = "AIzaSyAXXme78yMoN86fZBxMxhlre0Lq1Wootjk";
bot_secret_token = "NzE3NjE2NzIwNDE1Njg2NjU2.Xtc7RA.Yeq1YHrQRnb-3B4gK2t9R9T-67E"

client.login(bot_secret_token)

let queue = [];
let connection

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
	if(connection == undefined)
		connection = await message.member.voice.channel.join();

	if(message.content.startsWith(`${prefix}play`)){
		insert(message,connection);
	}
	else if(message.content.startsWith(`${prefix}stop`)){
		connection.dispatcher.destroy();
		queue = [];
	}
	else if(message.content.startsWith(`${prefix}skip`)){
		skip(connection)
	}
	else if(message.content.startsWith(`${prefix}pause`)){
		connection.dispatcher.pause();
	}
	else if(message.content.startsWith(`${prefix}resume`)){
		connection.dispatcher.resume();
	}

});

const insert = (message,connection) => {
	let vid;
	let song_name = message.content.substring(6);
	song_name = song_name.replace(/ /g,"%20");
	console.log(song_name);
	url = `https://www.googleapis.com/youtube/v3/search?q=${song_name}&key=${api}`;
	console.log(url);
	fetch(url)
	.then(response => response.json())
    .then(async data => {
    	console.log(data.items[0].id.videoId);
    	vid = data.items[0].id.videoId;
    	let songInfo = await ytdl.getInfo(vid);
    	let title = songInfo.title;
    	let link = `https://www.youtube.com/watch?v=${vid}`;
    	queue.push(link);
    	console.log(queue);
    	message.channel.send(title + " Added to queue")
    	if(queue.length == 1){
    		play(queue,connection);
    	}
    });
}


const play = (queue,connection) => {
	console.log("started");
	let link = queue[0];
	const dispatcher = connection.play(ytdl(link, { filter: 'audioonly',highWaterMark: 1<<25 } , { highWaterMark: 1 }));

	dispatcher.on('finish', () => {
  		queue.shift();
  		if(queue[0] !== undefined){
  			play(queue,connection);
  		}
  		else{
  			connection.dispatcher.destroy();
  		}
	});
}

const skip = (connection) =>{
	queue.shift();
  	if(queue[0] !== undefined){
  		play(queue,connection);
  	}
}