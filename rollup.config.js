import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'ts/load.ts',
  output: {
    file: 'js/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve({
      // I'm probably stupid, but this is the only way I can get it to work.
      moduleDirectories: ['node_modules']
    }),
    typescript()
  ]
};
