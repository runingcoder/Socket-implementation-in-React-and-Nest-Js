import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService { 
  messages: Message[] = [{name:'john', text:'hello'}, {name:'doe', text:'hi'}, {name:'johnny', text:'Bye'}, {name:'Doeja Cat', text:'You right'}

];
  clientToUser = {}
  // future enhancement, connect with db and pass clientId for particular in every request.

  identify(name, client_id) {
    const existingName = Object.values(this.clientToUser).find((value) => value === name);
    if (existingName) {
      console.log('existing name found: ', this.clientToUser[client_id]);
      return this.clientToUser[client_id];
    } else {
      this.clientToUser[client_id] = name;
      console.log('new name added: ', this.clientToUser[client_id])
      console.log('total clientToUser object: ', this.clientToUser);
      return this.clientToUser[client_id];
    }
  }
  
getClientName(client_id: string) {
  console.log('inside getclientname', client_id, 'and clientToUser: ', this.clientToUser);
  // socket change bho, contrary to the already existent client_id and name.
  return this.clientToUser[client_id];
}

  create(text: string, name: string) {
    // console.log("create method called with client Id: ", clientId );
    console.log("Current clientToUser object: ", this.clientToUser);
    const message = {
      name: name,
      text: text,
    }
    console.log("name is ", name)
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
