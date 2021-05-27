import { ImageType } from 'contracts/converter';

export class PayloadDto {
	width: number;
	height: number;
	quality: number;
	type: ImageType;
}