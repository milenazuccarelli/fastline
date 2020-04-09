## 1.0.2-1.0.2-alpha.1.0 (2020-04-07)


### Bug Fixes

* attempt to fix circle-ci ([7bc77be](https://github.com/a-barbieri/fastline/commit/7bc77becf75f6c920de181d8eda707c24eb1d587))
* BASE_DIR not pointing to the right path ([ef36f17](https://github.com/a-barbieri/fastline/commit/ef36f179ac7bc3a4544f10fa4178a95e21579d30))
* circle-ci file in wrong dir ([70a123c](https://github.com/a-barbieri/fastline/commit/70a123c89154d72dae693c94aa7c14559b5f1ae8))
* file structure ([8614651](https://github.com/a-barbieri/fastline/commit/86146512d4b8ad62f7a8a817364981f64b5f8248))
* incorrect binda-api version ([85e4eb5](https://github.com/a-barbieri/fastline/commit/85e4eb5dc96e70da153ebdc3b6a1559fb1dc4a38))
* initialise script copying to target instead of destination ([1c53622](https://github.com/a-barbieri/fastline/commit/1c53622a3ab94a66175a6cc8502ef3926c2097a9))
* inquirer doesn't have default export ([fbd86b4](https://github.com/a-barbieri/fastline/commit/fbd86b4349b97dee3894d9c88673c3493548f68e))
* reference to mariadb including stack name ([94a0d71](https://github.com/a-barbieri/fastline/commit/94a0d71e3a106b30e6118b56df6787d172cf6c02))
* remove images from template for now ([c2b15a5](https://github.com/a-barbieri/fastline/commit/c2b15a50103a001448ef00bbe7790e5390bd2b22))
* services config ([eb3c104](https://github.com/a-barbieri/fastline/commit/eb3c1043e55bdc43974172d69117853a9d132a57))
* templates import ([357650f](https://github.com/a-barbieri/fastline/commit/357650fa7a671920bba6d14d7f1413865c6d617c))


### Features

* add babel configuration for Jest ([b3296a4](https://github.com/a-barbieri/fastline/commit/b3296a461075135250e682d5ca5b0d22321d5d00))
* add circle-ci settings for CI ([91d40df](https://github.com/a-barbieri/fastline/commit/91d40dfa5b758950bd6d3d5296b7b1eef39a5b5d))
* add first database backup script ([1bd7eae](https://github.com/a-barbieri/fastline/commit/1bd7eae1e05b1ddb444fcea4b32fe26184324d84))
* add folder structure to copied files ([cf00567](https://github.com/a-barbieri/fastline/commit/cf00567d40c56f47f79652884567ddf1696428ef))
* add grafana and prometheus template ([fd2a722](https://github.com/a-barbieri/fastline/commit/fd2a722b97860fff0a38a24d6210c460416b82fe))
* add helper function ([b7e463b](https://github.com/a-barbieri/fastline/commit/b7e463b17fede56ffd75612ebf654703bbfbaf69))
* add index.js with dummy export to check if working ([668649b](https://github.com/a-barbieri/fastline/commit/668649b22f320a86f3749f5fc5afd9b6730f06e7))
* add Jest as test suite ([bc85b66](https://github.com/a-barbieri/fastline/commit/bc85b660d88be52e41cd5bcb58da151db3fc0844))
* add mysql backup ([b833706](https://github.com/a-barbieri/fastline/commit/b833706f6137975699a2e3b3973aaa590371d99d))
* add package.json to each template ([3755b1e](https://github.com/a-barbieri/fastline/commit/3755b1e7e6e40a3d5734b8d33f76a4a812099133))
* add pipeline and deploy scripts ([054a484](https://github.com/a-barbieri/fastline/commit/054a484ffb2a4387c9a4b9cbee4a79320c1f78b4))
* add questions to setup wizard ([5b6bf19](https://github.com/a-barbieri/fastline/commit/5b6bf1914a23eab8f4c767072d6c6699883bb66d))
* add rollup and inquirer dependencies and refactor structure ([017d2a9](https://github.com/a-barbieri/fastline/commit/017d2a95828aeff461fe8e38a7f5622da8854b58))
* add traefik dynamic config to template ([d510609](https://github.com/a-barbieri/fastline/commit/d51060991d50d661cc1427c7625c4d1db691c59d))
* add traefik project template ([03a1467](https://github.com/a-barbieri/fastline/commit/03a14677c320f34bd28037e0d4dd34c470c69e2b))
* add traefik server template ([2de14bb](https://github.com/a-barbieri/fastline/commit/2de14bbaabc0dbace60c030b8ba1e1258aa0b471))
* added compose file ([c845c0d](https://github.com/a-barbieri/fastline/commit/c845c0d1c0f14ca5f9053422a14d2883937e83f8))
* added nextjs application ([b2251da](https://github.com/a-barbieri/fastline/commit/b2251da90ed747e64e5043196e899929ead9bb2b))
* added rails application ([3c5d05c](https://github.com/a-barbieri/fastline/commit/3c5d05c8b3e1692f20c75c666965af11cd060c75))
* added setup instructions ([a458f6d](https://github.com/a-barbieri/fastline/commit/a458f6d6f31c2b85cd6d560a56477167fd0f5bcd))
* FL class to manage package global settings ([d29de73](https://github.com/a-barbieri/fastline/commit/d29de73ad3bae885d91a6e903d1d8b04f9f6dc33))
* gem file for rails 5.2 and binda 0.1.11 ([c0e0230](https://github.com/a-barbieri/fastline/commit/c0e0230d16a3214b21933fb29df52bddc0611224))
* gitignore ([1822df0](https://github.com/a-barbieri/fastline/commit/1822df0f287102aba1d5c2e8f84d748911a9fcd7))
* initial setup (refactoring babel and jest settings) ([4025f05](https://github.com/a-barbieri/fastline/commit/4025f053c8afcdb6b1bd8eb9a4408af259e68d63))
* setup release workflow + prettier ([606071f](https://github.com/a-barbieri/fastline/commit/606071ff162d8353b789444acf9d6fcca9931e48))


### Reverts

* Revert "chore: remove current templates" ([013313f](https://github.com/a-barbieri/fastline/commit/013313f2ba87228e6f0866d6bd9a21b09f9c43e3))
* Revert "chore: remove" ([9d3097b](https://github.com/a-barbieri/fastline/commit/9d3097bec41e0f7228c13ef3516cf58a45b6848a))
* Revert "chore: use master.key file in development" ([71fd4d5](https://github.com/a-barbieri/fastline/commit/71fd4d5f0ec7b6521e2f0aeaebbce19fe7ca5e65))



