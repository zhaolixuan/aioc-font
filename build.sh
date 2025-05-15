#!/bin/bash
set -x
set -o errexit

#此变量为webpack打包时的变量
#对应package.json脚本命令
#"build:hengshui": "cross-env BUILD_ENV=hengshui node build/build.js"
build_env="prod"

function clean {
	echo "Clean up..."
	rm -rf dist
	echo "Clean up successfully!"
}

function output {
	mkdir -p ./output

	echo "copy file to output"
	echo "----------file list----------"

	ls -a

	echo "--------------------"

	cp -av dist/* ./output/
	cp -av server/* ./output/

	echo "--------------------"

	# 执行权限
	chmod +x ./output/bin/control
	ls ./output
	echo "--------copy file to output finished------------"
}

function build {
	npm config set registry https://registry.npm.taobao.org
    #npm config set sass-binary-site https://npm.taobao.org/mirrors/node-sass
	echo "Downloading node_modules..."
	npm i && npm run ${build_env}
	echo "Build static file successfully!"
}

function main {
	clean
	build
	output
}

main "$@"