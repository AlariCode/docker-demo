import { Controller, Logger } from '@nestjs/common';
import { GenerateImages, ImageRequirement, ImageResult } from '../../../contracts/converter';
import { RMQRoute } from 'nestjs-rmq';
import { GenerateService } from './generate.service';
import { performance } from 'perf_hooks';

@Controller()
export class AppController {
	private static instance: number = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

	constructor(private readonly generateService: GenerateService) { }

	@RMQRoute(GenerateImages.Topic)
	async generateImage({ image, requirements, options }: GenerateImages.Request): Promise<GenerateImages.Response> {
		const jobNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
		Logger.log(`[${AppController.instance}][${jobNumber}] Start generate...`);
		const t0 = performance.now();
		try {
			const bufferImage = Buffer.from(image, 'base64');
			const transformedImage = await this.generateService.transformOriginal(bufferImage, options);
			const images = await Promise.all(
				requirements.map(
					async (requirement: ImageRequirement): Promise<ImageResult> => {
						return this.generateService.generateSizes(
							Buffer.from(transformedImage.image),
							requirement,
							options
						);
					}
				)
			);
			return { images: images.concat([transformedImage]) };
		} catch (error) {
			Logger.error(error);
			throw error;
		} finally {
			const t1 = performance.now();
			Logger.log(`[${AppController.instance}][${jobNumber}] Generation completed in ${t1 - t0} milliseconds.`);
		}
	}
}
