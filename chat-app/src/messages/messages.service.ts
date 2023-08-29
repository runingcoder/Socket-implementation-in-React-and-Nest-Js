import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService { 
  messages: Message[] = [{name:'john', text:'hello'}, {name:'doe', text:'hi'}, {name:'johnny', text:'Bye'}, {name:'Doeja Cat', text:'You right'}

];
  clientToUser = {}

  identify(name, client_id) {
    const existingName = Object.values(this.clientToUser).find((value) => value === name);
    if (existingName) {
      return existingName;
    } else {
      this.clientToUser[client_id] = name;
      return this.clientToUser[client_id];
    }
  }
  
getClientName(client_id: string) {
  return this.clientToUser[client_id];
}

  create(text: string, client: string) {
    console.log("create method called with client name: ", client );
    console.log("Current clientToUser object: ", this.clientToUser);
    const name = client;
    console.log("Retrieved name: ", name);
    const message = {
      name: name,
      text: text,
    }
    console.log("Created message: ", message);
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }


}
