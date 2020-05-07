export default class GingerManifest{
  constructor({name, version, views, routes}){
    this.name = name;
    this.version = version;
    this.views = views;
    this.routes = routes;
  }
}