// TODO
// update initial package:
// rename dir, update package.json (repo, name)
// update changeset script (repo)
// update root package.json, remove preinstall script and this file too

const fs = require('fs/promises');
const child_process = require('child_process');

async function run_command(command) {
	return new Promise((resolve, reject) => {
		child_process.exec(command, (err, stdout) => {
			if (err) {
				reject(err);
			} else {
				resolve(stdout ? stdout.trim() : '');
			}
		});
	});
}

async function edit_file(filename, replacer) {
	const content = await fs.readFile(filename, 'utf-8');
	await fs.writeFile(filename, replacer(content), 'utf-8');
}

async function main() {
	const user = await run_command('git config user.name');
	const gitURL = await run_command('git remote get-url origin');
	const githubProject = gitURL.slice(gitURL.indexOf('github.com') + 11, -4);
	const mainPackage = githubProject.substring(githubProject.indexOf('/') + 1);
	const replaceValues = (c) => {
		return c
			.replace(/svitejs\/project-template/g, githubProject)
			.replace(/packages\/project-template/g, `packages/${mainPackage}`)
			.replace(/project-template/g, mainPackage)
			.replace(/~~AUTHOR~~/g, user)
			.replace(/~~YEAR~~/g, new Date().getFullYear());
	};

	console.log(`first install: updating template to match repo "${githubProject}"`);
	await fs.unlink('README.md');
	await fs.rename('README.tpl.md', 'README.md');
	await fs.rename('.github/workflows.tpl', '.github/workflows');
	await Promise.all(
		[
			'.changeset/config.json',
			'.github/ISSUE_TEMPLATE/bug_report.yml',
			'.github/ISSUE_TEMPLATE/feature_request.yml',
			'.github/ISSUE_TEMPLATE/config.yml',
			'.github/workflows/release.yml',
			'packages/playground/README.md',
			'packages/project-template/package.json',
			'packages/project-template/LICENSE',
			'package.json',
			'README.md'
		].map((f) => edit_file(f, replaceValues))
	);

	await fs.rename('packages/project-template', `packages/${mainPackage}`);

	await edit_file('package.json', (c) => {
		return c.replace('project-template-monorepo', `${mainPackage}-monorepo`);
	});

	await edit_file('.gitignore', (c) => {
		return c.replace('pnpm-lock.yaml', 'pnpm-lock.yaml\n!/pnpm-lock.yaml');
	});
}

async function cleanup() {
	try {
		await fs.unlink('scripts/initial-setup.cjs');
		await edit_file('package.json', (c) => {
			const pkg = JSON.parse(c);
			delete pkg.scripts.preinstall;
			return JSON.stringify(pkg, null, 2) + '\n';
		});
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
