import amqp from 'amqplib/callback_api';

function sendMessage() {
    const consumerTag = `test-consumer-1`;
    amqp.connect('amqp://localhost', {clientProperties: {connection_name: 'test-consumer'}},
        (error, connection) => {
            error && console.error(error);
            connection.createChannel((channelError, channel) => {
                channelError && console.error(channelError);
                const queueName = 'hello';
                channel.assertQueue(queueName, {durable: false}, (queueError, queue) => {
                    queueError && console.error(queueError);
                    console.log(queue);
                });
                channel.prefetch(1);
                channel.consume(queueName, message => {
                    console.log('message content', JSON.parse(message?.content?.toString() || 'null'));
                    // Ack message
                    if (message) {
                        setTimeout(() => {
                            channel.ack(message);
                            console.log('Message acknowledged');
                        }, 1000);
                    }
                }, {noAck: false, consumerTag});
            });
        });
}

sendMessage();