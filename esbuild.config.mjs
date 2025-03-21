import esbuild from 'esbuild'
import process from 'process'
import builtins from 'builtin-modules'
import copy from 'esbuild-copy-files-plugin'

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`

const prod = process.argv[2] === 'production'
const target = prod ? 'dist' : 'resources/demo-vault/.obsidian/plugins/bookshelf'

const context = await esbuild.context({
    banner: {
        js: banner,
    },
    entryPoints: ['src/obsidian/bookshelf-plugin.ts'],
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
    sourcemap: prod ? false : 'inline',
    treeShaking: true,
    minify: prod,
    outfile: `${target}/main.js`,
    loader: { '.json': 'file' },
    assetNames: '[name]',
    plugins: [
        copy({
            source: ['manifest.json', 'styles.css'],
            target,
            copyWithFolder: false,
        }),
    ],
})

if (prod) {
    await context.rebuild()
    process.exit(0)
} else {
    await context.watch()
}
