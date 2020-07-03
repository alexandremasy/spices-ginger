export default function ({capabilities, $ginger, modules}){
  return Promise.all( configure({modules, $ginger}) );
}

/**
 * Configure ginger based on one or more module configuration
 * 
 * @param {Array.<GingerModuleConfig>} modules 
 * @return {Array.<Promise>} - One Promise per entry
 */
function configure({$ginger, modules}){
  if (!Array.isArray(modules)) {
    throw new Error('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
  }

  return modules.map(entry => {
    if (!entry instanceof GingerModuleConfig) {
      throw new Error('@spices/ginger: The config must be an Array.<GingerModuleConfig>')
    }

    return $ginger.register(new GingerModule({
      capabilities: this._capabilities,
      config: entry
    }))
  });
}