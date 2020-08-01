const socket=io();

const chatForm=document.getElementById('chat-form');

const{ username_link,room }=Qs.parse(location.search,{
  ignoreQueryPrefix:true
})
const username=$.cookie('username')
socket.emit('joinRoom',{ username,room })

console.log(username,room)


socket.on('message',
	message=>
	{
		addMsg(message)
		console.log(message)
	})

socket.on('roomUsers',
  ({room,users})=>
  {
    usersInRoom(users);
    roomName(room)
    console.log(users)
  })

chatForm.addEventListener('submit',(e)=>
	{
		e.preventDefault();
		const msg = e.target.elements.msg.value;
		console.log(msg)

		//Emit message to server
		socket.emit('chatMessage',msg)
		e.target.elements.msg.value='';
		e.target.elements.msg.focus();
	})


function addMsg(msg)
{
	msg_cont=document.getElementById('msg-containter');
	$('#msg-containter').append(`<div class='msg-body'><p1>${msg.username}</p1><div class='msg-div'>${msg.text}</div><time>${msg.time}</time></div>`)
	msg_cont.scrollTop=msg_cont.scrollHeight;
}

function usersInRoom(users)
{
    $('#users').html(`
      ${users.map(user=>`<li>${user.username}</li>`).join('')}`)

}
function roomName(room){
  $('#room').html(`${room}`)
}
