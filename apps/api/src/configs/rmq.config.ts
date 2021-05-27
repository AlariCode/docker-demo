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
	serviceName: 'api'
});
