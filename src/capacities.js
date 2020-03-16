import Transports from './transports'

export default class Capacities {

    constructor({eventbus, transports, logger, router, store}){
        this.eventbus = eventbus;
        this.logger = logger;
        this.parent = null;
        this.router = router;
        this.store = store;
        this.transports = new Transports(transports);
    }

    get http(){
        return this.transport.http;
    }

    get socket(){
        return this.transport.socket;
    }
}