module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic', development: true }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@': '../frontend'
      }
    }]
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ]
    }
  }
};
