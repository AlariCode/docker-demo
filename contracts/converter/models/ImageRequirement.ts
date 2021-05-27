import { ImageType } from '../enums';
import { IsNumber, IsEnum } from 'class-validator';

export class ImageRequirement {
	@IsNumber()
	width: number;

	@IsNumber()
	height: number;

	@IsNumber()
	quality: number;

	@IsEnum(ImageType)
	format: ImageType;
}