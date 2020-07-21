import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from "rollup-plugin-livereload";

export default {
  input: './src/index.js',
  output: {
    format: 'umd', // amd commonjs规范
    file: 'dist/vue.js', // 打包Vuejs文件
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**" // 使用global排除文件
    }),
    serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    })
  ]
}