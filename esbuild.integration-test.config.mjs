import esbuild from 'esbuild'
import process from 'process'
import builtins from 'builtin-modules'

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`

const prod = process.argv[2] === 'production'

const context = await esbuild.context({
    banner: {
        js: banner,
    },
    entryPoints: ['src/support/integration-test/integration-test-plugin.ts'],
    bundle: true,
    external: [
        'obsidian',
        'electron',
        '@codemirror/autocomplete',
        '@codemirror/collab',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/common',
        '@lezer/highlight',
        '@lezer/lr',
        ...builtins,
    ],
    format: 'cjs',
    target: 'es2018',
    logLevel: 'info',
    sourcemap: 'inline',
    treeShaking: true,
    minify: false,
    outfile: `resources/integration-test-vault/.obsidian/plugins/integration-test/main.js`,
    loader: { '.json': 'file' },
    assetNames: '[name]',
})

if (prod) {
    await context.rebuild()
    process.exit(0)
} else {
    await context.watch()
}
