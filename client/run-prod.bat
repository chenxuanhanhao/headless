@echo Build progress start.
@echo Set development environment...
@echo In a nodejs progress get this value through process.env.NODE_ENV=production
@echo You should use this value with webpack. Like webpack plugin: webpack.DefinePlugin.
@echo  Building starting!
@echo off
set NODE_ENV=production
@echo off Start Building...
node build/build.js