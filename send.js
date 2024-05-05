const amqplib = require('amqplib');
const queueName = "task";
const msg = process.argv.slice(2).join(' ') || "Hello World!";

const sendMsg = async() => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel(); //a pipeline to rabbitmq
    const queue = await channel.assertQueue(queueName,{durable: true}); //checks if a queue is present if not creates it
    channel.sendToQueue(queueName, Buffer.from(msg), {persistent: true}); //sends to the queue & the queue name will be the routing key
    console.log("msg");
    console.log(msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

sendMsg();