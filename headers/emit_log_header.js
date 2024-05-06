const amqplib = require('amqplib');

const exchangeName = "header_logs";
const args = process.argv.slice(2);
const msg = args[1] || "enter type and message!";

const sendMsg = async() => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel(); //a pipeline to rabbitmq

    //checks if an exchange is present if not creates it (name, type, {options})
    await channel.assertExchange(exchangeName, 'headers', {durable: false}); 

    //sends to the exchange takes(exchangeName, rountingKey/queueName, content, {options})
    //headers type ignores routing key so it doesn't matter we give the routing key oe not
    channel.publish(exchangeName, '', Buffer.from(msg), {headers: {account: 'new', method: 'google'}}); 
    
    console.log("msg");
    console.log(msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

sendMsg();