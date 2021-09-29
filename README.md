# project-template

This is a template repository to quickly set up new projects for releasing npm packages

- Manage dependencies in a [pnpm](https://pnpm.io) monorepo
- Preconfigured GitHub workflows for ci and release
- Build dual cjs and esm packages from typescript source with [tsup](https://tsup.egoist.sh)
- Test with [uvu](https://github.com/lukeed/uvu)
- Release including generated changelogs with [atlassian/changesets](https://github.com/atlassian/changesets)
- Additional tooling like prettier, eslint, lint-staged already set up
- Issue templates for feature requests and bug reports

## Initial setup

1. Create a new GitHub repo based on this template. Use a simple name like `someorg/foo-bar`, where someorg is the same on npm and GitHub
2. Clone your new repo
3. Run `pnpm install` in the clone
4. On first run, a [setup-script](scripts/initial-setup.cjs) in preinstall updates template with urls and names of your new repo
5. Commit the changes done by the setup-script
6. Review project setup
7. Add an NPM_TOKEN secret in your GitHub repo settings that allows to publish the npm package

> You can also use `npx degit svitejs/project-template my-project` to setup repo locally

## Development

1. Use branches for development
2. Add commits
3. Add changeset with `pnpx changeset`
4. Push branch and open a PR
5. Check CI results and merge PR into main
6. Release workflow creates a PR "Version Packages (next)" to collect changes to be released

## Release

1. Merge "Version Packages (next)" PR into main
2. Release workflow automatically releases npm package, creates GitHub release info and tags the release
