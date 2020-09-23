const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core');
const prefix = '!';
const fetch = require("node-fetch");
const api  = "";
const bot_secret_token = ""

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
		skip(connection,message)
	}
	else if(message.content.startsWith(`${prefix}pause`)){
		connection.dispatcher.pause();
	}
	else if(message.content.startsWith(`${prefix}resume`)){
		connection.dispatcher.resume();
	}
	else if(message.content.startsWith(`${prefix}random`)){
		rinsert(message,connection);
	}

});

const rinsert = (message,connection) => {
	let lang = message.content.substring(8);
	let region = "IN"
	let n = Math.floor(Math.random() * 8); //max number of results 
	if(lang.toLowerCase().includes("eng") ){
		region = "US"
	}

	url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&videoCategoryId=10&regionCode=${region}&maxResults=25&key=${api}`
	fetch(url)
	.then(response => response.json())
    .then(async data => {
    	console.log(data.items[n].id);
    	let vid = data.items[n].id;
    	songInfo(vid,message,connection);
    });
}

const insert = (message,connection) => {
	let song_name = message.content.substring(6);
	song_name = song_name.replace(/ /g,"%20");
	console.log(song_name);
	url = `https://www.googleapis.com/youtube/v3/search?q=${song_name}&key=${api}`;
	console.log(url);
	fetch(url)
	.then(response => response.json())
    .then(async data => {
    	console.log(data.items[0].id.videoId);
    	let vid = data.items[0].id.videoId;
 		songInfo(vid,message,connection);
    });
}

async function songInfo(vid,message,connection){
	let songInfo = await ytdl.getInfo(vid);
	let title = songInfo.title;
	let link = `https://www.youtube.com/watch?v=${vid}`;
	if(!queue.find(obj => obj.title == title)){
		let item = {};
		item.title = title;
		item.link = link;
		queue.push(item);
		console.log(queue);
		if(queue.length == 1){
			play(queue,connection,message);
		}
		else{
			message.channel.send(title + " Added to queue");
		}
	}
	else{
		message.channel.send(title + " Already in queue");
	}

}

const play = (queue,connection,message) => {
	console.log("started");
	let link = queue[0].link;
	message.channel.send("Currently Playing: " + queue[0].title);
	const dispatcher = connection.play(ytdl(link, { filter: 'audioonly',highWaterMark: 1<<25 } , { highWaterMark: 1 },{ bitrate: "auto" }));

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

const skip = (connection,message) =>{
	queue.shift();
  	if(queue[0] !== undefined){
  		play(queue,connection,message);
  	}
  	else{
  		message.channel.send("Please add more songs");
  	}
}
