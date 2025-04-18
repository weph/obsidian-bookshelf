import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
    title: 'Bookshelf',
    tagline:
        'Your personal bookshelf in Obsidian. Access all your book notes in one place, track your reading progress, and gain\n' +
        'insights into your reading habits with beautiful charts.',
    favicon: 'img/library-big.svg',

    url: 'https://weph.github.io',
    baseUrl: '/obsidian-bookshelf',

    organizationName: 'weph',
    projectName: 'obsidian-bookshelf',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    plugins: ['docusaurus-plugin-sass'],

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/weph/obsidian-bookshelf/tree/main/docs/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        colorMode: {
            defaultMode: 'light',
            disableSwitch: true,
            respectPrefersColorScheme: false,
        },
        navbar: {
            logo: {
                src: 'img/library-big.svg',
            },
            title: 'Bookshelf',
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Documentation',
                },
                {
                    href: 'https://github.com/weph/obsidian-bookshelf',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://weph.dev/" target="_blank">weph</a>`,
        },
        prism: {
            theme: prismThemes.dracula,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
}

export default config
