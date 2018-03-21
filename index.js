const path = require('path');
const {promisify} = require('util');
const {exec} = require('child_process');
const alfy = require('alfy');
const pDebounce = require('p-debounce');

const execute = promisify(exec);

const debouncedGetSize = pDebounce(getSize, 500);

function getSize() {
	return execute(`${path.join(__dirname, 'node_modules', '.bin', 'weigh')} ${alfy.input}`);
}

debouncedGetSize()
  .then(({stdout}) => {
	const regex = /[\d\.]+?\s[kM]B/g; // eslint-disable-line no-useless-escape
	const metrics = [];
	let result = regex.exec(stdout);

	while (result) {
		metrics.push(result[0]);
		result = regex.exec(stdout);
	}

	const url = `https://www.npmjs.com/package/${alfy.input}`;

	alfy.output([{
		title: metrics.join(' | '),
		subtitle: 'Uncompressed | Minified (uglify) | Minified + gzip',
		arg: url,
		quicklookurl: url
	}]);
});
