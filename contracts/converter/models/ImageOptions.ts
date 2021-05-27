import { ImageRotation } from '../enums';
import { CropOptions } from './CropOptions';

export class ImageOptions {
	rotation?: ImageRotation;
	crop?: CropOptions;
}