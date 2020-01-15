import NextI18Next from "next-i18next";

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: "ja",
  otherLanguages: ["en"]
});

export default NextI18NextInstance;

export const {
  appWithTranslation,
  useTranslation,
  withTranslation
} = NextI18NextInstance;
