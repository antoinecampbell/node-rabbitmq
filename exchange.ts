import amqp from 'amqplib/callback_api';

function sendMessage() {
    amqp.connect('amqp://localhost', (error, connection) => {
        error && console.error(error);
        connection.createChannel((channelError, channel) => {
            channelError && console.error(channelError);
            channel.assertExchange('test-fanout', 'fanout', {durable: false});
            channel.bindQueue('hello', 'test-fanout', '');
            const message = JSON.stringify({id: 1, msg: 'Hello World'});
            console.log('publish', channel.publish('test-fanout', '', Buffer.from(message)));
            setTimeout(() => {
                connection.close();
            }, 500);
        });
    });
}

sendMessage();