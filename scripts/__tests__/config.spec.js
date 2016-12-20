import fs from 'fs';
import path from 'path';
import getConfig from '../config';

const cwd = process.cwd();
afterEach(() => {
	process.chdir(cwd);
});

it('should read a config file', () => {
	const result = getConfig('./test/data/styleguide.config.js');
	expect(result).toBeTruthy();
	expect(result.title).toBe('React Style Guide Example');
});

it('should accept absolute path', () => {
	const result = getConfig(path.join(__dirname, '../../test/data/styleguide.config.js'));
	expect(result).toBeTruthy();
	expect(result.title).toBe('React Style Guide Example');
});

it('should throw when passed config file not found', () => {
	const fn = () => getConfig('pizza');
	expect(fn).toThrow();
});

it('should find config file automatically', () => {
	process.chdir('test/apps/basic');
	const result = getConfig({});
	expect(result).toBeTruthy();
	expect(result.title).toBe('React Style Guide Example');
});

it('should accept config as an object', () => {
	const result = getConfig({
		title: 'Style guide',
	});
	expect(result).toBeTruthy();
	expect(result.title).toBe('Style guide');
});

it('should throw if config has errors', () => {
	const fn = () => getConfig({
		components: 42,
	});
	expect(fn).toThrowError('should be string or function');
});

it('should have default getExampleFilename implementation', () => {
	const result = getConfig();
	expect(typeof result.getExampleFilename).toEqual('function');
});

it('default getExampleFilename should return Readme.md path if it exists', () => {
	const result = getConfig();
	expect(result.getExampleFilename(
		path.resolve('test/components/Button/Button.js')
	)).toEqual(
		path.resolve('test/components/Button/Readme.md')
	);
});

it('default getExampleFilename should return Component.md path if it exists', () => {
	const result = getConfig();
	expect(result.getExampleFilename(
		path.resolve('test/components/Placeholder/Placeholder.js')
	)).toEqual(
		path.resolve('test/components/Placeholder/Placeholder.md')
	);
});

it('default getExampleFilename should return false if no examples file found', () => {
	const result = getConfig();
	expect(result.getExampleFilename(
		path.resolve('test/components/RandomButton/RandomButton.js')
	)).toBeFalsy();
});

it('should have default getComponentPathLine implementation', () => {
	const result = getConfig();
	expect(typeof result.getComponentPathLine).toEqual('function');
	expect(result.getComponentPathLine('components/Button.js')).toEqual('components/Button.js');
});

it('should have default title based on package.json name', () => {
	const result = getConfig();
	expect(result.title).toEqual('React Styleguidist Style Guide');
});

it('should absolutize assetsDir if it exists', () => {
	const result = getConfig({
		assetsDir: 'scripts/__tests__',
	});
	expect(result.assetsDir).toEqual(__dirname);
});

it('should throw if assetsDir does not exist', () => {
	const fn = () => getConfig({
		assetsDir: 'pizza',
	});
	expect(fn).toThrow();
});

it('should use embedded default example template if defaultExample=true', () => {
	const result = getConfig({
		defaultExample: true,
	});
	expect(typeof result.defaultExample).toEqual('string');
	expect(fs.existsSync(result.defaultExample)).toBeTruthy();
});

it('should absolutize defaultExample if it is a string', () => {
	const result = getConfig({
		defaultExample: 'test/components/Button/Readme.md',
	});
	expect(result.defaultExample[0]).toEqual('/');
});

it('should throw if defaultExample does not exist', () => {
	const fn = () => getConfig({
		defaultExample: 'pizza',
	});
	expect(fn).toThrowError('does not exist');
});
