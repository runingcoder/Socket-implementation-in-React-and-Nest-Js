import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService { 
  messages: Message[] = [{name:'john', text:'hello'}, {name:'doe', text:'hi'}, {name:'johnny', text:'Bye'}, {name:'Doeja Cat', text:'You right'}

];
  clientToUser = {}

  identify(name: string, client_id: string) {
    this.clientToUser[client_id] = name;
    return Object.values(this.clientToUser) 
  }
getClientName(client_id: string) {
  return this.clientToUser[client_id];
}

  create(text: string, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: text,
    }
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }


}
