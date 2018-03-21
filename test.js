import test from 'ava';
import proxyquire from 'proxyquire';

const stdoutResult = `
Approximate weight of react:
Uncompressed: 62 kB
Minified (uglify): 7.95 kB
Minified and gzipped (level: default): 3.08 kB
`;

const alfyTest = proxyquire('alfy-test', {
	child_process: { // eslint-disable-line camelcase
		exec: function (cmd, callback) {
			callback(null, stdoutResult);
		}
	}
});

test(async t => {
	const alfy = alfyTest();
	const result = await alfy('foo');
	const url = 'https://www.npmjs.com/package/foo';

	t.deepEqual(result, [
		{
			title: '329 kB | 140 kB | 48.6 kB',
			subtitle: 'Uncompressed | Minified (uglify) | Minified + gzip',
			arg: url,
			quicklookurl: url
		}
	]);
});
