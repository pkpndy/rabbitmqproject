const amqplib = require('amqplib');

const exchangeName = "header_logs";

const receiveMsg = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', {durable: false});

    // If we don't give the queueName assert queue will give the name automatically 
    //and exclusive option means this Q will get deleted once the connection is closed
    const q = await channel.assertQueue('', {exclusive: true});

    console.log("Waiting for msgs in queue:", q.queue);

    //bind queue to the exchange(queueNme, exchangeName, routeKey)
    //routeKey doesn't matter here as the exchange type is headers
    channel.bindQueue(q.queue, exchangeName, '', {'account': 'new', 'method': 'facebook', 'x-match': 'any'});
    //the x-match property matters as the all means all the keys value in the object should match
    //x-match any any one key value should match

    channel.consume(q.queue, (msg) => {
        if(msg.content) console.log("routing key: ", JSON.stringify(msg.properties.headers),", Msg: ", msg.content.toString());
    }, { noAck: true }); //auto acknowledgement since it's not a task just a msg
};

receiveMsg();