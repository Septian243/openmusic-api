import amqp from 'amqplib';

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_SERVER);
            this.channel = await this.connection.createChannel();

            console.log('Connected to RabbitMQ');

            return this.channel;
        } catch (error) {
            console.log('RabbitMQ Connection Error:', error);
            throw error;
        }
    }

    async sendToQueen(queueName, message) {
        try {
            if (!this.channel) {
                await this.connect()
            }

            await this.channel.assertQueue(queueName, { durable: true });

            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });

            console.log(`Message sent to queue: ${queueName}`)
        } catch (error) {
            console.error('Error sending message to Queen:', error);
            throw error;
        }
    }

    async consumeQueue(queueName, callback) {
        try {
            if (!this.channel) {
                await this.connect()
            }

            await this.channel.assertQueue(queueName, { durable: true });

            this.channel.consume(
                queueName,
                async (message) => {
                    if (message !== null) {
                        try {
                            const data = JSON.parse(message.content.toString());
                            await callback(data);
                            this.channel.ack(message);
                        } catch (error) {
                            console.error('Message processing error:', error)
                            this.channel.nack(message, false, true);
                        }
                    }
                },
                {
                    noAck: false,
                }
            )

            console.log(`Waiting for messages in queue: ${queueName}`)
        } catch (error) {
            console.error('Error consuming queue:', error);
            throw error;
        }
    }

    async close() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}

export default new RabbitMQService();