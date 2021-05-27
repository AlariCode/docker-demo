import { BadRequestException, Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateImages, ImageType } from 'contracts/converter';
import { RMQService } from 'nestjs-rmq';
import { FilesService } from './files.service';
import { FileElementResponse } from './interfaces/file-element.reposonse';
import { MFile } from './interfaces/mfile.class';
import { PayloadDto } from './interfaces/payload.dto';

@Controller()
export class ApiController {
	constructor(
		private readonly filesService: FilesService,
		private readonly rmqService: RMQService
	) { }

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Query() params: PayloadDto): Promise<FileElementResponse> {
		const saveFile: MFile = new MFile(file);
		if (!file.mimetype.includes('image')) {
			throw new BadRequestException('Неверный формат файла')
		}
		console.log({ width: Number(params.width), height: Number(params.height), quality: Number(params.quality), format: params.type })
		const res = await this.rmqService.send<GenerateImages.Request, GenerateImages.Response>(GenerateImages.Topic, {
			image: saveFile.buffer.toString('base64'),
			requirements: [
				{ width: Number(params.width), height: Number(params.height), quality: Number(params.quality), format: params.type }
			]
		})
		return this.filesService.saveFile(new MFile({
			originalname: file.originalname.split('.')[0] + '.' + params.type,
			buffer: Buffer.from(res.images[0].image)
		}));
	}
}
