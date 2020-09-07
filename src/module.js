import soneTranslation from './components/sone/translations.json';
// import barnehageTranslation from './components/barnehage/translations.json';
// import tommekalenderTranslation from './components/tommekalender/translations.json';

// export { default as NaermesteBarnehage } from './components/barnehage/NaermesteBarnehage';
// export { default as Tommekalender } from './components/tommekalender/Tommekalender';
export { default as Sonetilhorighet } from './components/sone/SoneTilhorighet';

export function getTranslations() {
  return {
    ...soneTranslation,
    // ...barnehageTranslation,
    // ...tommekalenderTranslation
  };
}
