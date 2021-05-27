import { ConfigService } from '@nestjs/config';
import { IRMQServiceOptions } from 'nestjs-rmq';

export const getRMQConfig = (configService: ConfigService): IRMQServiceOptions => ({
	exchangeName: configService.get('AMQP_EXCHANGE'),
	connections: [
		{
			login: configService.get('AMQP_USER'),
			password: configService.get('AMQP_PASSWORD'),
			host: configService.get('AMQP_HOSTNAME'),
		},
	],
	queueName: configService.get('AMQP_QUEUE'),
	serviceName: 'converter',
	queueArguments: {
		'x-dead-letter-exchange': '',
		'x-dead-letter-routing-key': '_q_dead',
	},
	prefetchCount: 32
});
