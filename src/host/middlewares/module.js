import { default as GingerModuleConfig } from '../../module/config'
import { default as GingerModule } from '../../module/module'
import { default as sequence } from '../../utils/promise'

export default function ({capabilities, $ginger, modules}){
  return new Promise((resolve, reject) => {
    let mms = configure({ capabilities, $ginger, modules });
    sequence(mms, {})
    .then(() => {
      resolve();
    })
  });
}

/**
 * Configure ginger based on one or more module configuration
 * 
 * @param {Array.<GingerModuleConfig>} modules 
 * @return {Array.<Promise>} - One Promise per entry
 */
function configure({capabilities, $ginger, modules}){
  if (!Array.isArray(modules)) {
    throw new Error('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
  }

  return modules.map(entry => $ginger.register.bind( $ginger, GingerModule.fromConfig({capabilities, config: entry})) );
}