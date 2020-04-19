import amqp from 'amqplib/callback_api';

function sendMessage() {
    amqp.connect('amqp://localhost', (error, connection) => {
        error && console.error(error);
        connection.createChannel((channelError, channel) => {
            channelError && console.error(channelError);
            const queueName = 'hello';
            channel.assertQueue(queueName, {durable: false}, (queueError, queue) => {
                queueError && console.error(queueError);
                console.log(queue);
            });
            const message = JSON.stringify({id: 1, msg: 'Hello World'});
            console.log('send', channel.sendToQueue(queueName, Buffer.from(message)));
            setTimeout(() => {
                connection.close();
            }, 500);
        });
    });
}

sendMessage();