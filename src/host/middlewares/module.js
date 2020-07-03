import { GingerModuleConfig, GingerModule } from '../../module'

export default function ({capabilities, $ginger, modules}){
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

  return modules.map(entry => {
    return $ginger.register(
      new GingerModule({
        capabilities: capabilities,
        config: entry
      })
    )
  });
}