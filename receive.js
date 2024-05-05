const amqplib = require('amqplib');
const queueName = "task";

const receiveMsg = async () => {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    // durable false means the queue won't be created again when RabbitMQ starts again
    await channel.assertQueue(queueName, { durable: true });
    await channel.prefetch(1); // says don't fetch another process till completion of one is acknowledged
    console.log("Waiting for msgs in queue:", queueName);
    await channel.consume(queueName, (msg) => {
        const secs = msg.content.toString().split('.').length - 1;
        console.log("Msg: ", msg.content.toString());
        setTimeout(() => {
            console.log("Done resizing picture!");
            channel.ack(msg); // Manually acknowledge that the task is done
        }, secs * 1000);
    }, { noAck: false }); // This is auto acknowledgement
};

receiveMsg();