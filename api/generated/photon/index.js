"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime");
// @ts-ignore
process.setMaxListeners(100);
const debug = runtime_1.debugLib('photon');
class PhotonFetcher {
    constructor(engine, debug = false, hooks) {
        this.engine = engine;
        this.debug = debug;
        this.hooks = hooks;
    }
    request(document, path = [], rootField, typeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = String(document);
            debug(query);
            if (this.hooks && this.hooks.beforeRequest) {
                this.hooks.beforeRequest({ query, path, rootField, typeName, document });
            }
            yield this.engine.start();
            try {
                const result = yield this.engine.request(query, typeName);
                debug(result);
                return this.unpack(result, path, rootField);
            }
            catch (e) {
                throw new Error(`Error in Photon${path}: \n` + e.message);
            }
        });
    }
    unpack(result, path, rootField) {
        const getPath = [];
        if (rootField) {
            getPath.push(rootField);
        }
        getPath.push(...path.filter(p => p !== 'select'));
        return runtime_1.deepGet(result, getPath);
    }
}
class Photon {
    constructor(options = { autoConnect: true }) {
        const useDebug = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.library) : false;
        if (useDebug) {
            runtime_1.debugLib.enable('photon');
        }
        const debugEngine = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.engine) : false;
        // datamodel = datamodel without datasources + printed datasources
        this.datamodel = "model User {\n  id    String @default(uuid()) @id @unique\n  name  String\n  email String @unique\n}";
        this.internalDatasources = [{ "name": "db", "connectorType": "sqlite", "url": "file:dev.db", "config": {} }];
        const printedDatasources = runtime_1.printDatasources(options.datasources || {}, this.internalDatasources);
        const datamodel = printedDatasources + '\n\n' + this.datamodel;
        debug('datamodel:');
        debug(datamodel);
        const internal = options.__internal || {};
        const engineConfig = internal.engine || {};
        this.engine = new runtime_1.Engine({
            cwd: engineConfig.cwd || "/Users/notrab/now-photon/api/prisma/",
            debug: debugEngine,
            datamodel,
            prismaPath: engineConfig.binaryPath || undefined
        });
        this.dmmf = new runtime_1.DMMFClass(exports.dmmf);
        this.fetcher = new PhotonFetcher(this.engine, false, internal.hooks);
        this.autoConnect = typeof options.autoConnect === 'boolean' ? options.autoConnect : true;
        if (this.autoConnect) {
            this.connect();
        }
    }
    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this.engine.start();
        return this.connectionPromise;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.engine.stop();
        });
    }
    // won't be generated for now
    // private _query?: QueryDelegate
    // get query(): QueryDelegate {
    //   return this._query ? this._query: (this._query = QueryDelegate(this.dmmf, this.fetcher))
    // }
    get users() {
        this.connect();
        return UserDelegate(this.dmmf, this.fetcher);
    }
}
module.exports = Photon; // needed to support const Photon = require('...') in js
module.exports.default = Photon
Object.defineProperty(module.exports, "__esModule", { value: true });
exports.default = Photon;
/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }
exports.OrderByArg = makeEnum({
    asc: 'asc',
    desc: 'desc'
});
function UserDelegate(dmmf, fetcher) {
    const User = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users', args, []);
    User.findOne = (args) => args.select ? new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []) : new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []);
    User.findMany = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users.findMany', args, []);
    User.create = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []);
    User.delete = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []);
    User.update = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []);
    User.deleteMany = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'deleteManyUser', 'users.deleteMany', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'deleteManyUser', 'users.deleteMany', args, []);
    User.updateMany = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'updateManyUser', 'users.updateMany', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'updateManyUser', 'users.updateMany', args, []);
    User.upsert = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []);
    return User; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class UserClient {
    constructor(dmmf, fetcher, queryType, rootField, clientMethod, args, path) {
        this.dmmf = dmmf;
        this.fetcher = fetcher;
        this.queryType = queryType;
        this.rootField = rootField;
        this.clientMethod = clientMethod;
        this.args = args;
        this.path = path;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this.callsite = stack;
            }
        }
    }
    get document() {
        const { rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this.dmmf,
            rootField,
            rootTypeName: this.queryType,
            select: this.args
        });
        try {
            document.validate(this.args, false, this.clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this.callsite) {
                    e.message = x.render(this.callsite);
                }
            }
            throw e;
        }
        debug(String(document));
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this.requestPromise) {
            this.requestPromise = this.fetcher.request(this.document, this.path, this.rootField, 'User');
        }
        return this.requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this.requestPromise) {
            this.requestPromise = this.fetcher.request(this.document, this.path, this.rootField, 'User');
        }
        return this.requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this.requestPromise) {
            this.requestPromise = this.fetcher.request(this.document, this.path, this.rootField, 'User');
        }
        return this.requestPromise.finally(onfinally);
    }
}
/**
 * DMMF
 */
exports.dmmf = { "datamodel": { "enums": [], "models": [{ "name": "User", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": true, "type": "String", "default": { "name": "uuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "name", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "email", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false }] }, "mappings": [{ "model": "User", "plural": "users", "findOne": "findOneUser", "findMany": "findManyUser", "create": "createOneUser", "delete": "deleteOneUser", "update": "updateOneUser", "deleteMany": "deleteManyUser", "updateMany": "updateManyUser", "upsert": "upsertOneUser" }], "schema": { "enums": [{ "name": "OrderByArg", "values": ["asc", "desc"] }], "outputTypes": [{ "name": "User", "fields": [{ "name": "id", "args": [], "outputType": { "type": "UUID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "name", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "email", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Query", "fields": [{ "name": "findManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "UserOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": true } }, { "name": "findOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "BatchPayload", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Mutation", "fields": [{ "name": "createOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }] }], "inputTypes": [{ "name": "UserWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "email", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": true }, { "name": "UserWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "UUID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "UserCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "UUID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "UserUpdateInput", "fields": [{ "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "UserUpdateManyMutationInput", "fields": [{ "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "StringFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "StringFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": true }, { "name": "UserOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "email", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }] } };

module.exports.dmmf = exports.dmmf