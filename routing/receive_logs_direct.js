const amqplib = require('amqplib');
const args = process.argv.slice(2);

if(args.length == 0){
    console.log("Usage: receive_logs_direct [info] [error] [warning]");
    process.exit(1);
}

const exchangeName = "direct_logs";

const receiveMsg = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {durable: false});
    // If we don't give the queueName assert queue will give the name automatically 
    //and exclusive option means this Q will get deleted once the connection is closed
    const q = await channel.assertQueue('', {exclusive: true});
    console.log("Waiting for msgs in queue:", q.queue);
    //bind queue to the exchange(queueNme, exchangeName, routeKey)
    args.forEach(function(severity) {
        channel.bindQueue(q.queue, exchangeName, severity);
    });
    channel.consume(q.queue, (msg) => {
        if(msg.content) console.log("routing key: ", msg.fields.routingKey,", Msg: ", msg.content.toString());
    }, { noAck: false }); //auto acknowledgement since it's not a task just a msg
};

receiveMsg();