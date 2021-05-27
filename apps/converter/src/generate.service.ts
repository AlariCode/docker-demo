import { Injectable } from '@nestjs/common';
import { CropOptions, ImageOptions, ImageRequirement, ImageResult, ImageRotation, ImageType } from '../../../contracts/converter';
import * as sharp from 'sharp';

@Injectable()
export class GenerateService {
	public async generateSizes(
		image: Buffer, requirement: ImageRequirement, options?: ImageOptions,
	): Promise<ImageResult> {
		let container = this.init(image);
		container = this.resize(container, requirement.width, requirement.height);
		container = this.convert(container, requirement.format, requirement.quality);
		const generatedImage = await this.toBuffer(container);
		return {
			image: [...generatedImage],
			...requirement,
		};
	}

	public async transformOriginal(image: Buffer, options?: ImageOptions): Promise<ImageResult> {
		let container = this.init(image);
		container = this.transformWithOptions(container, options);
		const transformedImage = await this.toBuffer(container);
		const originalRequirement = await this.getRequirement(transformedImage);
		return {
			image: [...transformedImage],
			...originalRequirement,
		};
	}

	private init(image: Buffer) {
		return sharp(image);
	}

	private async getRequirement(image: Buffer): Promise<ImageRequirement> {
		const container = this.init(image);
		const { width, height, format } = await container.metadata();
		return {
			width: width ?? 0,
			height: height ?? 0,
			format: this.getFormatEnum(format ?? ''),
			quality: 100
		};
	}

	private getFormatEnum(format: string): ImageType {
		switch (format.toLowerCase()) {
			case 'jpg':
			case 'jpeg':
				return ImageType.Jpg;
			case 'png':
				return ImageType.Png;
			case 'webp':
				return ImageType.Webp;
			default:
				return ImageType.Unknown;
		}
	}

	private transformWithOptions(container: sharp.Sharp, options?: ImageOptions): sharp.Sharp {
		if (options?.rotation) {
			container = this.rotate(container, options.rotation);
		}
		if (options?.crop) {
			container = this.crop(container, options.crop);
		}
		return container;
	}

	private resize(container: sharp.Sharp, width: number, height: number): sharp.Sharp {
		return container.resize(width, height, { fit: 'inside' });
	}

	private convert(container: sharp.Sharp, format: ImageType, quality: number): sharp.Sharp {
		switch (format) {
			case ImageType.Jpg:
				return container.jpeg({ quality });
			case ImageType.Webp:
				return container.webp({ quality });
			case ImageType.Png:
				return container.png({ quality });
			default:
				throw new Error(`Неверный формат изображения - ${format}`);
		}
	}

	private crop(container: sharp.Sharp, options: CropOptions) {
		return container.extract({
			left: options.left,
			top: options.top,
			width: options.width,
			height: options.height,
		});
	}

	private rotate(container: sharp.Sharp, degree: ImageRotation) {
		return container.rotate(degree);
	}

	private async toBuffer(container: sharp.Sharp): Promise<Buffer> {
		return container.toBuffer();
	}
}