module.exports = {
    resolve: {
      extensions: ['.wasm'],
      fallback: {
        fs: false,
        tls: false,
        net: false,
        global: 'empty',
        clearImmediate: 'empty',
        setImmediate: 'empty',
        module: false,
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        //buffer: false,//エラーメッセージのいう通りに追加
        //process: false //エラーメッセージのいう通りに追加
        //process: require.resolve("process/browser") //エラーメッセージのいう通りに追加
      },
    },
  };