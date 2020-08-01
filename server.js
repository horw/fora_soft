const path =require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const session = require('express-session');
const formatMessage = require('./utils/message.js')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users.js')

const app = express();
const server = http.createServer(app);
const io =socketio(server);

//Set static
app.use(express.static(path.join(__dirname,'public')));


//Run when client connect
io.on('connection',socket=>
{
	const botName='ChatBot';

	
	//Runs when client disconnects
	socket.on('disconnect',()=>
	{
		//const user=getCurrentUser(socket.id)
		const user=userLeave(socket.id)
		if (user){
			io.to(user.room).emit('message',formatMessage(botName,`User ${user.username} has left ${user.room}`));

			io.to(user.room).emit('roomUsers',{
				room:user.room,
				users:getRoomUsers(user.room)
			})
		}
		//socket.broadcast.to(user.room).emit('message',formatMessage(botName,`User has ${user.username} left ${user.room}`));
	})


	socket.on('joinRoom',({username,room})=>
	{
		const user=userJoin(socket.id, username, room);

		socket.emit("message",formatMessage(botName,`Welcome ${user.username} to ${user.room}!`));
		
		socket.join(user.room)

		//Broadcast when a user connects
		socket.broadcast.to(user.room).emit(
			'message',
			formatMessage(botName,`A user ${user.username} has joined 	the ${user.room}`)
		)

		io.to(user.room).emit('roomUsers',{
			room:user.room,
			users:getRoomUsers(user.room)
		})

	})

	//Chat message
	socket.on('chatMessage', msg=>
	{	
		const user=getCurrentUser(socket.id)
		io.to(user.room).emit('message',formatMessage(user.username,msg));
		console.log(msg);
	})
})
 
const PORT = 3000 || process.env.PORT;

server.listen(PORT,()=> console.log(`Server running on port ${PORT}`));