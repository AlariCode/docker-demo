import {
	ImageRequirement,
	ImageResult,
	ImageOptions
} from './models';

export namespace GenerateImages {
	export const Topic = 'image-processor.generateImages.rpc';

	export class Request {
		image: string;
		requirements: ImageRequirement[];
		options?: ImageOptions;
	}

	export class Response {
		images: ImageResult[];
	}
}
