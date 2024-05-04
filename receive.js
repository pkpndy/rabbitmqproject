const amqplib = require('amqplib');
const queueName = "hello";

const receiveMsg = async() => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = connection.createChannel();
    //durable false means the queue won't be created again when rabbitmq starts again
    (await channel).assertQueue(queueName, {durable: false}); 
    console.log("waiting for msgs in queue:", queueName);
    (await channel).consume(queueName, (msg)=>{
        console.log("msg: ", msg.content.toString());
    }, {noAck: true});

}

receiveMsg();