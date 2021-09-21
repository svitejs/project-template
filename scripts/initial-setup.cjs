// TODO
// update initial package:
// rename dir, update package.json ( repo, name)
// update changeset script (repo)
// update root package.json, remove postinstall script and this file too

const fs = require('fs/promises');
const child_process = require('child_process');

async function run_command(command) {
	return new Promise((resolve, reject) => {
		child_process.exec(command, (err, stdout) => {
			if (err) {
				reject(err);
			}
			resolve(stdout);
		});
	});
}

async function edit_file(filename, replacer) {
	const content = await fs.readFile(filename, 'utf-8');
	await fs.writeFile(filename, replacer(content), 'utf-8');
}

async function main() {
	const gitURL = await run_command('git remote get-url origin');
	const githubProject = gitURL.trim().slice(gitURL.indexOf('github.com') + 11, -4);
	const mainPackage = githubProject.substring(githubProject.indexOf('/') + 1);
	console.log(`first install: updating template to match repo "${githubProject}"`)
	const replaceNames = (c) => {
		return c
			.replace(/svitejs\/project-template/g, githubProject)
			.replace(/packages\/project-template/g, `packages/${mainPackage}`);
	};
	await edit_file('.changeset/config.json',replaceNames)
	await edit_file('packages/project-template/package.json', replaceNames);
	await edit_file('README.md', replaceNames);

	await fs.rename('packages/project-template', `packages/${mainPackage}`);

	await edit_file('package.json', (c) => {
		return c.replace('project-template-monorepo', `${mainPackage}-monorepo`);
	});
}

async function cleanup() {
	try {
		await edit_file('package.json', (c) => {
			const pkg = JSON.parse(c);
			delete pkg.scripts.postinstall;
			return JSON.stringify(pkg, null, 2);
		});
		await fs.unlink('scripts/initial-setup.cjs');
	} catch (e) {
		console.error('cleanup failed', e);
	}
}

main()
	.then(cleanup)
	.catch((e) => {
		console.error('initial setup failed', e);
		process.exit(1);
	});
