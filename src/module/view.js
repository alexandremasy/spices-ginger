import GingerModuleCapacity from './capacity'

export default class GingerModuleView{

  /**
   * Create a Module View
   * 
   * @param {Object} options - the module option 
   * @param {Number} options.capacities - the view capacity
   * @param {String} options.name - the name of the view
   */
  constructor({ capacities = GingerModuleCapacity.SUM, name}){
    this.capacities = capacities;
    this.name = name;
  }
}