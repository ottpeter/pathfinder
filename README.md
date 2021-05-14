This is a HD path finder that is using Golem network.
First download [yajsapi](https://github.com/golemfactory/yajsapi) and instert the files into the examples folder.
I edited the package.json, I added this line:  
`"js:ethfinder": "node ./ethfinder/base.js",` to scripts.

The golem-vm folder was built with Docker and then `gvmkit-build` and `gvmkit-build --push` was run.

Unfortunately, going through all the possibilites is too expensive, so I stopped at a certain point, but for the demo address it is working, it could find it (with testArray.json)

