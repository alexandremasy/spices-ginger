class Capacities{

    constructor({eventbus, transport, logger, router, store}){
        console.log('transport', transport);
        this.eventbus = eventbus;
        this.logger = logger;
        this.parent = null;
        this.router = router;
        this.store = store;
        this.transport = transport;
    }

    get http(){
        return this.transport.http || null;
    }

    get socket(){
        return this.transport.socket || null;
    }
}

export default Capacities;