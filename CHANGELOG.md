# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.7.4"></a>
## [1.7.4](https://github.com/arobson/pequod/compare/v1.7.3...v1.7.4) (2018-10-19)


### Bug Fixes

* remove quotes from output argument in export command ([2779d35](https://github.com/arobson/pequod/commit/2779d35))



<a name="1.7.3"></a>
## [1.7.3](https://github.com/arobson/pequod/compare/v1.7.2...v1.7.3) (2018-10-19)


### Bug Fixes

* add missing removeContainer method to top level export ([cf572d8](https://github.com/arobson/pequod/commit/cf572d8))



<a name="1.7.2"></a>
## [1.7.2](https://github.com/arobson/pequod/compare/v1.7.1...v1.7.2) (2018-10-19)


### Bug Fixes

* remove quotes around change args passed to import to work around odd daemon behavior in conjunction with spawn ([29ac2bb](https://github.com/arobson/pequod/commit/29ac2bb))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/arobson/pequod/compare/v1.7.0...v1.7.1) (2018-10-18)


### Bug Fixes

* make it possible to inspect images and allow for imports to carry important aspects forward ([64d56a8](https://github.com/arobson/pequod/commit/64d56a8))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/arobson/pequod/compare/v1.5.2...v1.7.0) (2018-10-17)


### Features

* add support for build-args in order to support parameterized Dockerfiles better ([607a31d](https://github.com/arobson/pequod/commit/607a31d))
* add support for create, export, import, and remove container commands ([7d4ae17](https://github.com/arobson/pequod/commit/7d4ae17))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/arobson/pequod/compare/v1.5.2...v1.6.0) (2018-01-26)


### Features

* add support for build-args in order to support parameterized Dockerfiles better ([f0e8b26](https://github.com/arobson/pequod/commit/f0e8b26))



<a name="1.5.2"></a>
## [1.5.2](https://github.com/arobson/pequod/compare/v1.5.1...v1.5.2) (2017-11-26)


### Bug Fixes

* omit empty tags from tag and push behaviors ([70b8031](https://github.com/arobson/pequod/commit/70b8031))



<a name="1.5.1"></a>
## [1.5.1](https://github.com/arobson/pequod/compare/v1.5.0...v1.5.1) (2017-11-18)


### Bug Fixes

* add missing method to index so pull is accessible via library API ([74d1b5b](https://github.com/arobson/pequod/commit/74d1b5b))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/arobson/pequod/compare/v1.4.0...v1.5.0) (2017-11-18)


### Features

* add pull support ([5fdc6ff](https://github.com/arobson/pequod/commit/5fdc6ff))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/arobson/pequod/compare/v1.3.1...v1.4.0) (2017-11-17)


### Features

* add support for the Docker's cache-from flag ([dbd23f2](https://github.com/arobson/pequod/commit/dbd23f2))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/arobson/pequod/compare/v1.3.0...v1.3.1) (2017-11-12)


### Bug Fixes

* add standard and correct linting errors ([f4b4b82](https://github.com/arobson/pequod/commit/f4b4b82))
* don't treat warning output from Docker CLIs as errors ([655f464](https://github.com/arobson/pequod/commit/655f464))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/arobson/pequod/compare/v1.2.0...v1.3.0) (2017-06-07)


### Features

* add optional log provider for API ([71bb2fe](https://github.com/arobson/pequod/commit/71bb2fe))



<a name="1.2.0"></a>
# 1.2.0 (2017-05-25)


### Bug Fixes

* add coveralls to dev dependencies ([8f5eb0a](https://github.com/arobson/pequod/commit/8f5eb0a))
* correct conflicting options in start-registry script for some docker versions ([77d64a5](https://github.com/arobson/pequod/commit/77d64a5))
* correct push tag command name in readme and command line ([cbb26f7](https://github.com/arobson/pequod/commit/cbb26f7))
* remove unused dependency and add nyc ([ae3fc5f](https://github.com/arobson/pequod/commit/ae3fc5f))
* **test:** correct build api call ([58ca06f](https://github.com/arobson/pequod/commit/58ca06f))


### Features

* add login and build commands, and make it easier to consume as a library ([e2ee477](https://github.com/arobson/pequod/commit/e2ee477))
