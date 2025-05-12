module.exports = {
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  appWithTranslation: (Component) => Component,
};
