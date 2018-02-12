import express from 'express';
import fs from 'fs';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import tepidReducer from './reducers';

import Tepid from './components/Tepid';


function handleRender(req, res) {
	const store = createStore(tepidReducer);
	const context = {};

	const html = renderToString(
		<Provider store={store}>
			<StaticRouter location={req.url} context={context}>
				<Tepid auth={store.getState().auth} />
			</StaticRouter>
		</Provider>
	);

	const finalState = store.getState();

	fs.readFile(path.join(__dirname, '..', 'build', 'index.html'), 'utf8', function (err, data) {
		if (err) throw err;
		let document = data.replace(
			/<div id="tepid-web-app-root"><\/div>/,
			`<div id="tepid-web-app-root">${html}</div>` +
			`<script>window.__PRELOADED_STATE__ = ${JSON.stringify(finalState).replace(/</g, '\\\u003c')}</script>`
		).replace(/%PUBLIC_URL%/g, 'public');
		res.send(document);
	});
}

const app = express();

app.use('/static', express.static(path.join(__dirname, '..', 'build', 'static')));
app.use('/images', express.static(path.join(__dirname, '..', 'build', 'images')));
app.use('/favicon.ico', express.static(path.join(__dirname, '..', 'build', 'favicon.ico')));
app.use('/manifest.json', express.static(path.join(__dirname, '..', 'build', 'manifest.json')));
app.use(handleRender);
app.listen(3000);
