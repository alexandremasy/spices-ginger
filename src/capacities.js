class Capacities{

    constructor({eventbus, http, logger, router, store}){
        this.eventbus = eventbus;
        this.logger = logger;
        this.parent = null;
        this.router = router;
        this.store = store;
        this.transport = [ http ];
    }

    get http(){
        return this.transport[0] || null;
    }
}

export default Capacities;