'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const glob = require('glob')
const fs = require('fs'),
  copyStat = fs.stat


exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: sourceLoader,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

//获取多级的入口文件
exports.getMultiEntry = function (globPath) {
  var entries = {},
    basename, tmp, pathname
  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry))
    var entrys = entry.split('/')
    tmp = entrys.splice((entrys.length - 1) * -1)

    //修复，打包时把一级文件夹和二级文件夹一并打包
    var pathsrc = ""
    for (var i = 0; i < tmp.length - 1; i++) {
      if (tmp[i] !== 'src') {
        pathsrc += tmp[i] + (i === tmp.length - 2 ? "" : "/")
      }
    }
    //修复根首页时不需要添加 "/" 
    pathname = pathsrc.length === 0 ? basename : pathsrc + '/' + basename // 正确输出js和html的路径
    entries[pathname] = entry

  })
  return entries

}
//判断是否存在模板文件不存在就使用默认
exports.find_ = function (pagejs) {
  var template = './src/' + pagejs + '.html'
  if (glob.sync(template).length > 0) {
    return template
  } else {
    return "./src/index.html"
  }
}

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var filecopy = function (src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, function (err, paths) {
    if (err) {
      throw err
    }
    paths.forEach(function (path) {
      var _src = src + '/' + path,
        _dst = dst + '/' + path,
        readable, writable
      copyStat(_src, function (err, st) {
        if (err) {
          throw err
        }
        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src)
          // 创建写入流
          writable = fs.createWriteStream(_dst)
          // 通过管道来传输流
          readable.pipe(writable)
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
          exports.startCopy(_src, _dst)
        }
      })
    })
  })
}

//在复制目录前需要判断该目录是否存在，不存在需要先创建目录
exports.startCopy = function (src, dst) {
  fs.exists(dst, function (exists) {
    // 已存在
    if (exists) {
      filecopy(src, dst)
    }
    // 不存在
    else {
      fs.mkdir(dst, function () {
        filecopy(src, dst)
      })
    }
  })
}

// 删除目标文件夹或文件（传入物理路径）
exports.deleteTarget = function deleteTarget(fileUrl) {
  // 如果当前url不存在，则退出
  if (!fs.existsSync(fileUrl)) return
  // 当前文件为文件夹时
  if (fs.statSync(fileUrl).isDirectory()) {
    var files = fs.readdirSync(fileUrl)
    var len = files.length,
      removeNumber = 0
    if (len > 0) {
      files.forEach(function (file) {
        removeNumber++
        var stats = fs.statSync(fileUrl + '/' + file)
        var url = fileUrl + '/' + file
        if (fs.statSync(url).isDirectory()) {
          deleteTarget(url)
        } else {
          fs.unlinkSync(url)
        }
      })
      if (removeNumber === len) {
        // 删除当前文件夹下的所有文件后，删除当前空文件夹（注：所有的都采用同步删除）
        fs.rmdirSync(fileUrl)
        console.log('删除文件夹“ ' + fileUrl + ' ”成功')
      }
    } else {
      fs.rmdirSync(fileUrl)
    }
  } else {
    // 当前文件为文件时
    fs.unlinkSync(fileUrl)
    console.log('删除文件“ ' + fileUrl + ' ”成功')
  }
}
