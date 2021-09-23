### project-template

This is a template repository to quickly set up new projects for releasing npm packages

- Manage dependencies in a [pnpm](https://pnpm.io) monorepo
- Preconfigured GitHub workflows for ci and release
- Build dual cjs and esm packages from typescript source with [tsup](https://tsup.egoist.sh)
- Test with [uvu](https://github.com/lukeed/uvu)
- Release including generated changelogs with [atlassian/changesets](https://github.com/atlassian/changesets)
- Additional tooling like prettier, eslint, lint-staged already set up
- Issue templates for feature requests and bug reports

### usage

#### initial setup

- create a new GitHub repo based on this template. Use a simple name like `someorg/foo-bar`, where someorg is the same on npm and GitHub
- clone your new repo
- run `pnpm install` in the clone
- On first run, a [setup-script](scripts/initial-setup.cjs) in preinstall updates template with urls and names of your new repo
- commit the changes done by the setup-script
- review project setup
- add an NPM_TOKEN secret that allows to publish the npm package

#### develop

- use branches for development
- add commits
- add changeset with `pnpm changeset`
- push branch and open a PR
- Check CI results and merge PR into main
- release workflow creates a PR "Version Packages (next)" to collect changes to be released

#### release

- merge "Version Packages (next)" PR into main
- release workflow automatically releases npm package, creates GitHub release info and tags the release
