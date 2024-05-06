const amqplib = require('amqplib');
const exchangeName = "logs";

const receiveMsg = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', {durable: false});
    // If we don't give the queueName assert queue will give the name automatically 
    //and exclusive option means this Q will get deleted once the connection is closed
    const q = await channel.assertQueue('', {exclusive: true});
    console.log("Waiting for msgs in queue:", q.queue);
    //bind queue to the exchange(queueNme, exchangeName, routeKey)
    //routeKey doesn't matter here as the exchange type is fanout
    channel.bindQueue(q.queue, exchangeName, '');
    channel.consume(q.queue, (msg) => {
        if(msg.content) console.log("Msg: ", msg.content.toString());
    }, { noAck: false }); //auto acknowledgement since it's not a task just a msg
};

receiveMsg();