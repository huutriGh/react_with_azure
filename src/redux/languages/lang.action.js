import langType from './lang.types';
export const changeLanguageStart = (lang) => ({
  type: langType.CHANGE_LANGUAGE,
  payload: lang,
});
