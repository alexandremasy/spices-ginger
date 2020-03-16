export default class Transports{
    constructor(transports){
        this.list = transports;
    }

    get http() {
        return this.list.http || null;
    }

    get socket() {
        return this.list.socket || null;
    }

    getByName(name) {
        let ret = this.http;

        if (name) {
            ret = this.list.hasOwnProperty(name) ? this.list[name] : null;
        }

        return ret;
    }
}