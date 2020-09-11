import fs from 'fs';
import pkg  from './package.json';

/**
 * @material-ui/code@3.9.4 have ES-module exports mixed up,
 * where index.js in folders are CommonJS-modules.
 *
 * Import directly from ES-file instead.
 */
export function patchMaterialUIExports() {
  const filename = 'node_modules/@material-ui/core/index.es.js';

  let styles = fs.readFileSync(filename, 'utf8');
  styles = styles.replace(
    "export { createGenerateClassName, createMuiTheme, createStyles, jssPreset, MuiThemeProvider, withStyles, withTheme } from './styles';",
    `
    export {default as createGenerateClassName} from './styles/createGenerateClassName';
    export {default as createMuiTheme} from './styles/createMuiTheme';
    export {default as createStyles} from './styles/createStyles';
    export {default as jssPreset} from './styles/jssPreset';
    export {default as MuiThemeProvider} from './styles/MuiThemeProvider';
    export {default as withStyles} from './styles/withStyles';
    export {default as withTheme} from './styles/withTheme';
  `).replace(
    "export { default as Modal, ModalManager } from './Modal';",
    `
    export { default as Modal } from './Modal';
    export { default as ModalManager } from './Modal/ModalManager';
    `
  );

  fs.writeFileSync(filename, styles);
}

export function copyHTML() {
  const entrypoints = ['barnehage', 'sonetilhorighet', 'tommekalender'];

  if (!fs.existsSync(pkg.name)) {
    fs.mkdirSync('sonetilhorighet');
  }

  for (let entrypoint of entrypoints) {
    const html = fs.readFileSync(`src/pages/${entrypoint}.html`, 'utf8')
      .replace(`${entrypoint}.js`, `${entrypoint}-${pkg.version}.js`);

    fs.writeFileSync(`sonetilhorighet/${entrypoint}.html`, html);
  }
}
