import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { AppController } from './app.controller';
import { GenerateService } from './generate.service';
const configService = new ConfigService();

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		RMQModule.forRoot(getRMQConfig(configService)),
	],
	controllers: [AppController],
	providers: [GenerateService]
})
export class AppModule { }
