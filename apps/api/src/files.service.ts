import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { MFile } from './interfaces/mfile.class';
import { FileElementResponse } from './interfaces/file-element.reposonse';

@Injectable()
export class FilesService {

	async saveFile(file: MFile): Promise<FileElementResponse> {
		const dateFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);
		await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
		return { url: `/uploads/${dateFolder}/${file.originalname}`, name: file.originalname };
	}
}
