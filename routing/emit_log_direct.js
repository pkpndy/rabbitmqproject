const amqplib = require('amqplib');

const exchangeName = "direct_logs";
const args = process.argv.slice(2);
const msg = args[1] || "enter type and message!";
const logType = args[0];

const sendMsg = async() => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel(); //a pipeline to rabbitmq
    //checks if an exchange is present if not creates it (name, type, {options})
    await channel.assertExchange(exchangeName, 'direct', {durable: false}); 
    //sends to the exchange takes(exchangeName, rountingKey/queueName, content, {options})
    channel.publish(exchangeName, logType, Buffer.from(msg)); 
    console.log("msg");
    console.log(msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

sendMsg();