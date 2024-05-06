const amqplib = require('amqplib');
const exchangeName = "logs";
const msg = process.argv.slice(2).join(' ') || "Just Publish";

const sendMsg = async() => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel(); //a pipeline to rabbitmq
    //checks if an exchange is present if not creates it (name, type, {options})
    await channel.assertExchange(exchangeName, 'fanout', {durable: false}); 
    //sends to the exchange takes(exchangeName, rountingKey/queueName, content, {options})
    channel.publish(exchangeName, '', Buffer.from(msg)); 
    console.log("msg");
    console.log(msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

sendMsg();