import React from 'react';
import './App.css';
import { Uploader, Icon, InputNumber, Panel, SelectPicker } from 'rsuite';
import { FileElementResponse } from '@project/apps/api/src/interfaces/file-element.reposonse';
import { PayloadDto } from '@project/apps/api/src/interfaces/payload.dto';
import 'rsuite/dist/styles/rsuite-dark.css';
import { useState } from 'react';

export enum ImageType {
	Png = 'png',
	Jpg = 'jpg',
	Webp = 'webp'
}

export const format = [
	{ label: 'png', value: ImageType.Png },
	{ label: 'jpg', value: ImageType.Jpg },
	{ label: 'webp', value: ImageType.Webp }
];

function App() {
	const [payload, setPayload] = useState<Partial<PayloadDto>>({
		width: 200,
		height: 200,
		quality: 100,
		type: ImageType.Webp
	});
	const [result, setResult] = useState<string>();

	const uploadedFile = (response: object) => {
		const file = response as FileElementResponse;
		setResult(file.url);
	};

	return (
		<div className="app">
			<div></div>
			<Panel bordered>
				<h1 className="header">Конвертер изображений</h1>
				<div className="options">
					<div>
						<label>Ширина</label>
						<InputNumber value={payload.width} min={0} size="md" onChange={e => setPayload(m => ({ ...m, width: Number(e) }))} />
					</div>
					<div>
						<label>Высота</label>
						<InputNumber value={payload.height} min={0} size="md" onChange={e => setPayload(m => ({ ...m, height: Number(e) }))} />
					</div>
					<div>
						<label>Качество</label>
						<InputNumber value={payload.quality} min={0} max={100} step={0.1} size="md" onChange={e => setPayload(m => ({ ...m, quality: Number(e) }))} />
					</div>
					<div>
						<label>Формат</label>
						<SelectPicker
							style={{ width: '100%' }}
							data={format}
							value={payload.type}
							onChange={e => setPayload(m => ({ ...m, type: e }))}
						/>
					</div>
				</div>

				<Uploader
					draggable
					fileListVisible={false}
					multiple={false}
					action={`${process.env.REACT_APP_API_URL}/upload?width=${payload.width}&height=${payload.height}&quality=${payload.quality}&type=${payload.type}`}
					onSuccess={uploadedFile}
				>
					<button style={{ width: '100%', marginTop: 10, height: 200 }} >
						<Icon icon='camera-retro' size="lg" />
					</button>
				</Uploader>
				{result && <>
					<br />
					<br />
					<h2 className="header">Результат</h2>
					<img className="result" src={process.env.REACT_APP_API_URL + result} alt="результат" />
				</>}
			</Panel>

			<div></div>
		</div>
	);
}

export default App;
