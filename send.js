const amqplib = require('amqplib');
const queueName = "hello";
const msg = "let's push to github";

const sendMsg = async() => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel(); //a pipeline to rabbitmq
    const queue = await channel.assertQueue(queueName,{durable: false}); //checks if a queue is present if not creates it
    channel.sendToQueue(queueName, Buffer.from(msg)); //sends to the queue & the queue name will be the routing key
    console.log("msg");
    console.log(msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

sendMsg();