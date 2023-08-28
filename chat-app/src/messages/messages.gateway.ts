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
  server: Server;
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  } // works with events instead of http urls, like in controllers.
  // here, 'createMessage' is the event.
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody('text') text: string,
    @ConnectedSocket() client: Socket,
  ) {
    const message = this.messagesService.create(text, client.id);
    // emitting the message to every connected client
    // adsfa.emit('emitmessage', payload)
    this.server.emit('message', message);
    return message;
    // only text is beig sent in the messaeg adn not name, why.
  }
  @SubscribeMessage('join')
  // @ConnectedSocket() client: Socket  is reference to the client that is sending the message

  join(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
    // returns all the names of the clients from the clienTuser object, although not using the 
    // response in the client side.
  }

  @SubscribeMessage('typing')
  typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
    // the one who send request to typing, his client id is stored in the client object
    // and we get it's name.
    const name = this.messagesService.getClientName(client.id);
    // need to send the typing status to clients (two users) but using broadcast sends it to the
    // non sender only, -- the other receiver
    client.broadcast.emit('typing', { name, isTyping });
  }
}
