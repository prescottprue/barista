# Barista

[![Code Style][code-style-image]][code-style-url]
[![License][license-image]][license-url]

Mocha test running/reporting UI and API

## What?
1. Downloads test repo based on settings passed to UI
1. Tests run using [Barback][barback-url] on [Google Compute Engine][compute-engine-url]
1. Shows results (also available through API)

![BaristaArchitecture](https://user-images.githubusercontent.com/2992224/41957582-492d69ac-799c-11e8-87e2-e83547422a7a.png)


## Why?
* Running tests at the click of a button requires "contained" running sessions (Compute Engine provides the ability to set specific resources)
* Tests are always updating and are contained in another repo

[license-image]: https://img.shields.io/npm/l/barista.svg?style=flat-square
[license-url]: https://github.com/prescottprue/barista/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
[barback-url]: https://github.com/prescottprue/barback
[compute-engine-url]: https://console.cloud.google.com/compute

## Special Thanks

Though [@prescottprue](https://github.com/prescottprue) came up with the original idea and prototype, it took tons of work from other folks to go from idea phase into a real project:

* [@urbantumbleweed](https://github.com/urbantumbleweed) - idea sharing, ticket/feature planning, and support on early prototyping
* [@reside-eng](https://github.com/reside-eng) - Providing a supportive environment for growth of open source tools
