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
      console.log('existing name found: ', this.clientToUser[client_id]);
      return existingName;
    } else {
      this.clientToUser[client_id] = name;
      console.log('new name added: ', this.clientToUser[client_id])
      console.log('total clientToUser object: ', this.clientToUser);
      return this.clientToUser[client_id];
    }
  }
  
getClientName(client_id: string) {
  console.log('inside getclientname', client_id, 'and clientToUser: ', this.clientToUser);
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
    console.log("Updated messages array: ", this.messages);
    return message;
  }

  findAll() {
    console.log(this.messages)
    return this.messages;
  }


}
