import { ASSET_TYPES } from "../shared/contants";

export function initAssetRegisters (Vue) {
  ASSET_TYPES.forEach(type => {
    Vue[ type ] = function (id, definition) {
      if (type === 'component') {
        definition = this.options._base.extend(definition);
      } else if (type === 'filter') {

      } else if (type === 'directive') {

      }
      this.options[ type + 's' ][ id ] = definition;
    }
  })
}