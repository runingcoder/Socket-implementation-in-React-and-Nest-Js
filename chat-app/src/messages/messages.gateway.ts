import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {

  @WebSocketServer()
  // reference to the websocket instance
  server; Server;

  constructor(private readonly messagesService: MessagesService) {}

  // works with events instead of http urls, like in controllers.
  // here, 'createMessage' is the event.
  @SubscribeMessage('createMessage')
  async create(@MessageBody('text') text: string, @ConnectedSocket() client : Socket) {
    const message = this.messagesService.create(text, client.id);

    // emitting the messge to every connected client
    this.server.emit('message', message);
    return message;
    // only text is beig sent in the messaeg adn not name, why.
  } 


  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }
  @SubscribeMessage('join')
  join(@MessageBody('name') name: string,  @ConnectedSocket() client: Socket ) {
     return this.messagesService.identify(name, client.id);



  }
  @SubscribeMessage('typing')
  typing(@MessageBody()  isTyping: boolean,
    @ConnectedSocket() client: Socket) {
      const name = this.messagesService.getClientName(client.id);
      // need to send the typing status to clients (two users) but using broadcas sends it to the 
      // non sender only, -- the other receiver
    client.broadcast.emit('typing', {name, isTyping})
    }
}
