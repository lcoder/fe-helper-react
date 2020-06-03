const { override, fixBabelImports, useBabelRc } = require('customize-cra');
const { addLessLoader } = require( './add-less-loader' )

module.exports = override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      // modifyVars: { '@primary-color': '#f00' },
    }),
    useBabelRc(),
);