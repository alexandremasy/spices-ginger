import { GingerModuleConfig, GingerModule } from '../../module'
import { sequence } from '../../utils';

export default function ({capabilities, $ginger, modules}){
  return new Promise((resolve, reject) => {
    let mms = configure({ capabilities, $ginger, modules });
    sequence(mms, {})
    .then(() => {
      resolve();
    })
  })


  return Promise.all( configure({capabilities, modules, $ginger}) );
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
  // return modules.map(entry => $ginger.register( GingerModule.fromConfig({capabilities, config: entry})) );
}