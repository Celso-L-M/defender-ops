var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, k as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, m as RequestStatusResponseStatus, U as UnknownError, n as RequestStatusDoneNoReplyErrorCode, o as RejectError, p as CertifiedRejectErrorCode, q as UNREACHABLE_ERROR, I as InputError, s as InvalidReadStateRequestErrorCode, t as ReadRequestType, v as Principal, w as IDL, x as MissingCanisterIdErrorCode, H as HttpAgent, y as encode, Q as QueryResponseStatus, z as UncertifiedRejectErrorCode, A as isV3ResponseBody, B as isV2ResponseBody, D as UncertifiedRejectUpdateErrorCode, F as UnexpectedErrorCode, G as decode, S as Subscribable, J as pendingThenable, K as resolveEnabled, N as shallowEqualObjects, O as resolveStaleTime, V as noop, W as environmentManager, X as isValidTimeout, Y as timeUntilStale, Z as timeoutManager, _ as focusManager, $ as fetchState, a0 as replaceData, a1 as notifyManager, a2 as hashKey, a3 as getDefaultState, r as reactExports, a4 as shouldThrowError, i as useQueryClient, g as useInternetIdentity, a5 as createActorWithConfig, a6 as Variant, a7 as Record, a8 as Opt, a9 as Vec, aa as Tuple, ab as Service, ac as Func, ad as Text, ae as Nat, af as Principal$1, ag as Null, ah as Bool, ai as Float64, aj as Int, ak as Nat8, al as Nat16 } from "./index-CmSiIXAi.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const ProviderType$1 = Variant({
  "AWS": Null,
  "GCP": Null,
  "Azure": Null
});
const PlaybookResult = Record({
  "rawApiError": Opt(Text),
  "dryRunPreview": Opt(Text),
  "provider": Opt(ProviderType$1),
  "message": Text,
  "success": Bool
});
const VaultSecretName = Text;
const VaultError = Variant({
  "NotFound": Null,
  "NotAuthorized": Null,
  "AlreadyExists": Null,
  "InvalidName": Null
});
const Result = Variant({ "ok": Null, "err": VaultError });
const Result_3 = Variant({ "ok": Text, "err": Text });
const Value = Variant({
  "int": Int,
  "nat": Nat,
  "float": Float64,
  "bool": Bool,
  "null": Null,
  "text": Text
});
const Cell = Record({ "value": Value, "name": Text });
const Result__1 = Record({
  "hasMore": Bool,
  "rows": Vec(Vec(Cell))
});
const ComplianceFramework = Variant({
  "CISAws": Null,
  "CISGCP": Null,
  "SOC2": Null,
  "ISO27001": Null,
  "CISAzure": Null,
  "NISTCSF": Null
});
const Result_2 = Variant({
  "ok": Record({ "csvData": Text, "reportId": Text }),
  "err": Text
});
const AlertStatus = Variant({
  "Open": Null,
  "InProgress": Null,
  "Resolved": Null
});
const MitreTag = Record({
  "techniqueId": Text,
  "technique": Text,
  "tactic": Text
});
const Severity = Variant({
  "Low": Null,
  "High": Null,
  "Medium": Null,
  "Critical": Null,
  "Unknown": Null
});
const DomainRep = Record({
  "suspiciousVotes": Nat,
  "maliciousVotes": Nat,
  "cleanVotes": Nat,
  "lastAnalysisDate": Text
});
const IpReputation = Record({
  "isp": Text,
  "country": Text,
  "lastReported": Text,
  "totalReports": Nat,
  "abuseScore": Nat
});
const MitreDetail = Record({
  "techniqueName": Text,
  "tacticName": Text,
  "mitigations": Text,
  "description": Text
});
const AlertEnrichment = Record({
  "domainRep": Opt(DomainRep),
  "knownMaliciousIp": Bool,
  "ipReputation": Opt(IpReputation),
  "enrichedAt": Opt(Text),
  "mitreDetail": Opt(MitreDetail)
});
const NormalizedAlert = Record({
  "id": Text,
  "region": Opt(Text),
  "status": AlertStatus,
  "mitre": Opt(MitreTag),
  "title": Text,
  "findingId": Text,
  "provider": ProviderType$1,
  "accountId": Opt(Text),
  "customer": Text,
  "assetId": Opt(Text),
  "owner": Opt(Text),
  "rawFindingId": Text,
  "recurrenceCount": Nat,
  "description": Text,
  "ingestionSource": Opt(
    Variant({ "Poll": Null, "Webhook": Null })
  ),
  "originalSeverity": Text,
  "timestamp": Int,
  "assetType": Opt(Text),
  "severity": Severity,
  "enrichment": Opt(AlertEnrichment)
});
const RuleSeverityThreshold = Variant({
  "All": Null,
  "AnyHigh": Null,
  "CriticalOrHigh": Null,
  "AnyCritical": Null,
  "AnyLow": Null,
  "AnyMedium": Null
});
const NotificationChannel = Variant({
  "Email": Null,
  "InApp": Null,
  "TeamsWebhook": Null
});
const AlertRule = Record({
  "id": Text,
  "region": Opt(Text),
  "escalationRecipient": Opt(Text),
  "severityThreshold": Opt(RuleSeverityThreshold),
  "provider": Opt(ProviderType$1),
  "customer": Text,
  "assetId": Opt(Text),
  "name": Text,
  "escalationMinutes": Opt(Nat),
  "channels": Vec(NotificationChannel),
  "cooldownMinutes": Nat,
  "enabled": Bool,
  "findingType": Opt(Text)
});
const AssetType = Variant({
  "S3": Null,
  "AzureVM": Null,
  "EC2": Null,
  "RDS": Null,
  "AzureDatabase": Null,
  "GCPStorage": Null,
  "GCPCloudSQL": Null,
  "Lambda": Null,
  "AzureStorage": Null,
  "GCPCompute": Null,
  "Other": Null
});
const Asset = Record({
  "id": Text,
  "region": Text,
  "provider": ProviderType$1,
  "accountId": Text,
  "customer": Text,
  "name": Text,
  "tags": Vec(Tuple(Text, Text)),
  "assetType": AssetType,
  "lastSeen": Int,
  "riskScore": Nat,
  "openFindings": Nat
});
const AuditLogEntry = Record({
  "id": Text,
  "action": Text,
  "customer": Text,
  "actorId": Text,
  "timestamp": Int,
  "details": Text
});
const ControlStatus = Variant({
  "Passing": Null,
  "NoCoverage": Null,
  "Failing": Null
});
const ComplianceControl = Record({
  "status": ControlStatus,
  "title": Text,
  "provider": Opt(ProviderType$1),
  "framework": ComplianceFramework,
  "failingFindings": Nat,
  "description": Text,
  "controlId": Text,
  "remediationGuidance": Text,
  "passingFindings": Nat
});
const ComplianceTrendEntry = Record({
  "passingControls": Nat,
  "framework": ComplianceFramework,
  "totalControls": Nat,
  "score": Nat,
  "weekTimestamp": Int
});
const IncidentStatus = Variant({
  "Open": Null,
  "Investigating": Null,
  "Resolved": Null
});
const CorrelatedIncident = Record({
  "status": IncidentStatus,
  "incidentId": Text,
  "customer": Text,
  "sourceAlerts": Vec(Text),
  "detectedAt": Int,
  "assignedOwner": Opt(Text),
  "sourceIp": Opt(Text),
  "sourceProviders": Vec(ProviderType$1),
  "timeDeltaMinutes": Float64,
  "notes": Opt(Text),
  "affectedResources": Vec(Text),
  "severity": Severity,
  "correlationWindowMinutes": Nat,
  "incidentType": Text
});
const CorrelationStats = Record({
  "totalAllTime": Nat,
  "byType": Vec(Tuple(Text, Nat)),
  "totalToday": Nat,
  "totalThisWeek": Nat
});
const CredentialHealth = Variant({
  "Error": Text,
  "Authenticating": Null,
  "Valid": Null,
  "ExpiringSoon": Text,
  "Expired": Null
});
const CredentialHealthStatus = Record({
  "provider": Text,
  "expiryNs": Opt(Int),
  "health": CredentialHealth
});
const PollingStatus$1 = Variant({
  "Error": Null,
  "AuthPaused": Null,
  "Inactive": Null,
  "Active": Null
});
const PollingInterval = Variant({
  "OneHour": Null,
  "ThirtyMin": Null,
  "FifteenMin": Null,
  "FiveMin": Null
});
const ProviderPollingState = Record({
  "status": PollingStatus$1,
  "provider": ProviderType$1,
  "interval": PollingInterval,
  "lastPollAttempt": Opt(Int),
  "lastSuccessfulPoll": Opt(Int),
  "findingsToday": Nat,
  "lastError": Opt(Text),
  "consecutiveFailures": Nat
});
const IngestionStats = Record({
  "providerStates": Vec(ProviderPollingState),
  "activeProviders": Nat,
  "totalFindingsToday": Nat
});
const NotificationStatus = Variant({
  "Failed": Null,
  "Sent": Null,
  "Acknowledged": Null
});
const NotificationLog = Record({
  "id": Text,
  "status": NotificationStatus,
  "acknowledgedAt": Opt(Int),
  "customer": Text,
  "ruleId": Text,
  "recipient": Text,
  "alertId": Text,
  "acknowledged": Bool,
  "timestamp": Int,
  "channel": NotificationChannel
});
const RawFinding = Record({
  "id": Text,
  "region": Opt(Text),
  "title": Text,
  "findingId": Text,
  "provider": ProviderType$1,
  "accountId": Opt(Text),
  "description": Text,
  "rawMetadata": Text,
  "timestamp": Int,
  "severity": Severity
});
const GeneratedReport = Record({
  "csvData": Opt(Text),
  "customer": Text,
  "providerScope": Vec(Text),
  "generatedAt": Text,
  "generatedBy": Text,
  "dateRangeStart": Text,
  "dateRangeEnd": Text,
  "reportType": Text,
  "reportId": Text,
  "format": Text
});
const TimelineEvent = Record({
  "id": Text,
  "title": Text,
  "provider": Opt(ProviderType$1),
  "customer": Text,
  "description": Text,
  "timestamp": Int,
  "severity": Opt(Severity),
  "eventType": Text
});
const SearchResult = Record({
  "id": Text,
  "title": Text,
  "provider": Opt(ProviderType$1),
  "customer": Text,
  "description": Text,
  "timestamp": Int,
  "sourceModule": Text,
  "severity": Opt(Severity)
});
const UserAssignmentView = Record({
  "principal": Text,
  "providers": Vec(ProviderType$1)
});
const VaultEntryView = Record({
  "provider": ProviderType$1,
  "name": VaultSecretName,
  "createdAt": Int,
  "updatedAt": Int,
  "maskedValue": Text
});
const Result_1 = Variant({ "ok": Text, "err": VaultError });
const ConnectionTestResult = Variant({
  "Success": Text,
  "Failure": Text
});
const HttpHeader = Record({ "value": Text, "name": Text });
const HttpRequestResult = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(HttpHeader)
});
const TransformationInput = Record({
  "context": Vec(Nat8),
  "response": HttpRequestResult
});
const TransformationOutput = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(HttpHeader)
});
Service({
  "acknowledgeNotification": Func([Text], [Bool], []),
  "assignProviderAccess": Func(
    [Principal$1, Vec(ProviderType$1)],
    [],
    []
  ),
  "blockIp": Func(
    [
      Record({
        "ip": Text,
        "customer": Text,
        "providers": Vec(ProviderType$1),
        "dryRun": Bool
      })
    ],
    [PlaybookResult],
    []
  ),
  "deleteAlertRule": Func([Text], [Bool], []),
  "deleteReport": Func([Text, Text], [], []),
  "deleteVaultSecret": Func([ProviderType$1, VaultSecretName], [Result], []),
  "disableAzureAdAccount": Func(
    [
      Record({
        "customer": Text,
        "userPrincipalName": Text,
        "dryRun": Bool
      })
    ],
    [PlaybookResult],
    []
  ),
  "enrichAlertPublic": Func([Text, Text], [Result_3], []),
  "escalateToIncident": Func(
    [
      Record({
        "customer": Text,
        "assignedOwner": Opt(Text),
        "alertId": Text,
        "notes": Opt(Text),
        "severity": Text,
        "dryRun": Bool
      })
    ],
    [PlaybookResult],
    []
  ),
  "execute": Func([Text], [Result__1], ["query"]),
  "exportComplianceCsv": Func(
    [ComplianceFramework],
    [Text],
    ["query"]
  ),
  "exportCompliancePdf": Func(
    [ComplianceFramework],
    [Vec(Nat8)],
    ["query"]
  ),
  "forceGcpIamReview": Func(
    [
      Record({
        "customer": Text,
        "projectId": Text,
        "dryRun": Bool
      })
    ],
    [PlaybookResult],
    []
  ),
  "generateReport": Func(
    [
      Record({
        "customer": Text,
        "providerScope": Vec(Text),
        "dateRangeStart": Text,
        "dateRangeEnd": Text,
        "reportType": Text
      })
    ],
    [Result_2],
    []
  ),
  "getAlertById": Func([Text], [Opt(NormalizedAlert)], ["query"]),
  "getAlertRules": Func([Text], [Vec(AlertRule)], ["query"]),
  "getAlertsForCorrelation": Func(
    [Vec(Text)],
    [Vec(NormalizedAlert)],
    ["query"]
  ),
  "getApiDoc": Func([], [Text], ["query"]),
  "getAssetById": Func([Text], [Opt(Asset)], ["query"]),
  "getAssetFindings": Func(
    [Text],
    [Vec(NormalizedAlert)],
    ["query"]
  ),
  "getAssets": Func(
    [
      Record({
        "region": Opt(Text),
        "minRiskScore": Opt(Nat),
        "provider": Opt(ProviderType$1),
        "customer": Text,
        "limit": Nat,
        "assetType": Opt(AssetType)
      })
    ],
    [Vec(Asset)],
    ["query"]
  ),
  "getAuditLog": Func(
    [Text, Nat],
    [Vec(AuditLogEntry)],
    ["query"]
  ),
  "getComplianceControlGaps": Func(
    [ComplianceFramework],
    [Vec(ComplianceControl)],
    ["query"]
  ),
  "getComplianceStatus": Func(
    [ComplianceFramework, Opt(ProviderType$1)],
    [
      Record({
        "total": Nat,
        "failing": Nat,
        "controls": Vec(ComplianceControl),
        "score": Nat,
        "passing": Nat
      })
    ],
    ["query"]
  ),
  "getComplianceTrend": Func(
    [ComplianceFramework],
    [Vec(ComplianceTrendEntry)],
    ["query"]
  ),
  "getCorrelatedIncidentById": Func(
    [Text],
    [Opt(CorrelatedIncident)],
    ["query"]
  ),
  "getCorrelatedIncidents": Func(
    [Nat],
    [Vec(Tuple(Text, CorrelatedIncident))],
    ["query"]
  ),
  "getCorrelationStats": Func([], [CorrelationStats], ["query"]),
  "getCredentialHealth": Func(
    [],
    [Vec(CredentialHealthStatus)],
    ["query"]
  ),
  "getEnrichmentKeys": Func(
    [],
    [
      Record({
        "abuseIpdbKeySet": Bool,
        "virusTotalKeySet": Bool
      })
    ],
    []
  ),
  "getFailedIngestions": Func(
    [Opt(ProviderType$1), Nat],
    [
      Vec(
        Record({
          "id": Text,
          "status": Text,
          "provider": Text,
          "errorMessage": Text,
          "errorType": Text,
          "timestamp": Int,
          "rawPayload": Text
        })
      )
    ],
    ["query"]
  ),
  "getIngestionStats": Func([], [IngestionStats], ["query"]),
  "getMyProviders": Func([], [Vec(ProviderType$1)], ["query"]),
  "getNormalizedAlerts": Func(
    [
      Record({
        "status": Opt(AlertStatus),
        "provider": Opt(ProviderType$1),
        "customer": Text,
        "limit": Nat,
        "severity": Opt(Severity)
      })
    ],
    [Vec(NormalizedAlert)],
    ["query"]
  ),
  "getNotificationLogs": Func(
    [Record({ "customer": Text, "limit": Nat })],
    [Vec(NotificationLog)],
    ["query"]
  ),
  "getPipelineHealth": Func(
    [],
    [
      Vec(
        Record({
          "provider": Text,
          "failedIngestionCount": Nat,
          "pollEventsToday": Nat,
          "normalizationSuccessRate": Float64,
          "webhookEventsToday": Nat,
          "avgLatencyMs": Float64
        })
      )
    ],
    ["query"]
  ),
  "getProviderStates": Func(
    [],
    [Vec(ProviderPollingState)],
    ["query"]
  ),
  "getRawFindings": Func(
    [ProviderType$1, Nat, Nat],
    [
      Record({
        "hasMore": Bool,
        "totalCount": Nat,
        "items": Vec(RawFinding)
      })
    ],
    ["query"]
  ),
  "getReportCsv": Func([Text, Text], [Opt(Text)], []),
  "getReportEmailConfig": Func(
    [Text],
    [
      Vec(
        Record({
          "reportType": Text,
          "recipients": Vec(Text)
        })
      )
    ],
    []
  ),
  "getReports": Func([Text], [Vec(GeneratedReport)], []),
  "getTimeline": Func(
    [Text, Nat],
    [Vec(TimelineEvent)],
    ["query"]
  ),
  "getWebhookSecretStatus": Func(
    [],
    [
      Record({
        "azureSet": Bool,
        "gcpSet": Bool,
        "awsSet": Bool
      })
    ],
    []
  ),
  "getWebhookStats": Func(
    [],
    [
      Record({
        "webhookNormalizationRate": Float64,
        "webhookEventsToday": Nat
      })
    ],
    ["query"]
  ),
  "globalSearch": Func(
    [Text, Text, Nat],
    [Record({ "hasMore": Bool, "results": Vec(SearchResult) })],
    ["query"]
  ),
  "hasAdminCredentials": Func([], [Bool], ["query"]),
  "http_request": Func(
    [
      Record({
        "url": Text,
        "method": Text,
        "body": Vec(Nat8),
        "headers": Vec(Tuple(Text, Text))
      })
    ],
    [
      Record({
        "body": Vec(Nat8),
        "headers": Vec(Tuple(Text, Text)),
        "upgrade": Opt(Bool),
        "streaming_strategy": Opt(Null),
        "status_code": Nat16
      })
    ],
    ["query"]
  ),
  "http_request_update": Func(
    [
      Record({
        "url": Text,
        "method": Text,
        "body": Vec(Nat8),
        "headers": Vec(Tuple(Text, Text))
      })
    ],
    [
      Record({
        "body": Vec(Nat8),
        "headers": Vec(Tuple(Text, Text)),
        "upgrade": Opt(Bool),
        "streaming_strategy": Opt(Null),
        "status_code": Nat16
      })
    ],
    []
  ),
  "isolateResource": Func(
    [
      Record({
        "provider": ProviderType$1,
        "customer": Text,
        "resourceId": Text,
        "dryRun": Bool
      })
    ],
    [PlaybookResult],
    []
  ),
  "listUserAssignments": Func(
    [],
    [Vec(UserAssignmentView)],
    ["query"]
  ),
  "listVaultSecrets": Func(
    [ProviderType$1],
    [Vec(VaultEntryView)],
    ["query"]
  ),
  "removeProviderAccess": Func([Principal$1, ProviderType$1], [], []),
  "revealVaultSecret": Func(
    [ProviderType$1, VaultSecretName],
    [Result_1],
    []
  ),
  "revokeIamCredentials": Func(
    [
      Record({
        "provider": ProviderType$1,
        "customer": Text,
        "userId": Text,
        "accessKeyId": Opt(Text),
        "dryRun": Bool
      })
    ],
    [PlaybookResult],
    []
  ),
  "saveAlertRule": Func([AlertRule], [Bool], []),
  "saveEnrichmentKeys": Func(
    [
      Record({
        "virusTotalKey": Opt(Text),
        "abuseIpdbKey": Opt(Text)
      })
    ],
    [],
    []
  ),
  "saveReportEmailConfig": Func(
    [
      Record({
        "customer": Text,
        "reportType": Text,
        "recipients": Vec(Text)
      })
    ],
    [],
    []
  ),
  "saveVaultSecret": Func(
    [ProviderType$1, VaultSecretName, Text],
    [Result],
    []
  ),
  "saveWebhookSecret": Func([ProviderType$1, Text], [], []),
  "schema": Func([], [Text], ["query"]),
  "setPollingInterval": Func([ProviderType$1, PollingInterval], [], []),
  "testAwsConnection": Func([], [ConnectionTestResult], []),
  "testAzureConnection": Func([], [ConnectionTestResult], []),
  "testGcpConnection": Func([], [ConnectionTestResult], []),
  "transform": Func(
    [TransformationInput],
    [TransformationOutput],
    ["query"]
  ),
  "triggerPoll": Func([ProviderType$1], [], []),
  "updateAlertStatus": Func(
    [Text, AlertStatus, Opt(Text)],
    [Bool],
    []
  ),
  "updateCorrelatedIncidentStatus": Func(
    [Text, IncidentStatus, Opt(Text), Opt(Text)],
    [Bool],
    []
  ),
  "updateVaultSecret": Func(
    [ProviderType$1, VaultSecretName, Text],
    [Result],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const ProviderType2 = IDL2.Variant({
    "AWS": IDL2.Null,
    "GCP": IDL2.Null,
    "Azure": IDL2.Null
  });
  const PlaybookResult2 = IDL2.Record({
    "rawApiError": IDL2.Opt(IDL2.Text),
    "dryRunPreview": IDL2.Opt(IDL2.Text),
    "provider": IDL2.Opt(ProviderType2),
    "message": IDL2.Text,
    "success": IDL2.Bool
  });
  const VaultSecretName2 = IDL2.Text;
  const VaultError2 = IDL2.Variant({
    "NotFound": IDL2.Null,
    "NotAuthorized": IDL2.Null,
    "AlreadyExists": IDL2.Null,
    "InvalidName": IDL2.Null
  });
  const Result2 = IDL2.Variant({ "ok": IDL2.Null, "err": VaultError2 });
  const Result_32 = IDL2.Variant({ "ok": IDL2.Text, "err": IDL2.Text });
  const Value2 = IDL2.Variant({
    "int": IDL2.Int,
    "nat": IDL2.Nat,
    "float": IDL2.Float64,
    "bool": IDL2.Bool,
    "null": IDL2.Null,
    "text": IDL2.Text
  });
  const Cell2 = IDL2.Record({ "value": Value2, "name": IDL2.Text });
  const Result__12 = IDL2.Record({
    "hasMore": IDL2.Bool,
    "rows": IDL2.Vec(IDL2.Vec(Cell2))
  });
  const ComplianceFramework2 = IDL2.Variant({
    "CISAws": IDL2.Null,
    "CISGCP": IDL2.Null,
    "SOC2": IDL2.Null,
    "ISO27001": IDL2.Null,
    "CISAzure": IDL2.Null,
    "NISTCSF": IDL2.Null
  });
  const Result_22 = IDL2.Variant({
    "ok": IDL2.Record({ "csvData": IDL2.Text, "reportId": IDL2.Text }),
    "err": IDL2.Text
  });
  const AlertStatus2 = IDL2.Variant({
    "Open": IDL2.Null,
    "InProgress": IDL2.Null,
    "Resolved": IDL2.Null
  });
  const MitreTag2 = IDL2.Record({
    "techniqueId": IDL2.Text,
    "technique": IDL2.Text,
    "tactic": IDL2.Text
  });
  const Severity2 = IDL2.Variant({
    "Low": IDL2.Null,
    "High": IDL2.Null,
    "Medium": IDL2.Null,
    "Critical": IDL2.Null,
    "Unknown": IDL2.Null
  });
  const DomainRep2 = IDL2.Record({
    "suspiciousVotes": IDL2.Nat,
    "maliciousVotes": IDL2.Nat,
    "cleanVotes": IDL2.Nat,
    "lastAnalysisDate": IDL2.Text
  });
  const IpReputation2 = IDL2.Record({
    "isp": IDL2.Text,
    "country": IDL2.Text,
    "lastReported": IDL2.Text,
    "totalReports": IDL2.Nat,
    "abuseScore": IDL2.Nat
  });
  const MitreDetail2 = IDL2.Record({
    "techniqueName": IDL2.Text,
    "tacticName": IDL2.Text,
    "mitigations": IDL2.Text,
    "description": IDL2.Text
  });
  const AlertEnrichment2 = IDL2.Record({
    "domainRep": IDL2.Opt(DomainRep2),
    "knownMaliciousIp": IDL2.Bool,
    "ipReputation": IDL2.Opt(IpReputation2),
    "enrichedAt": IDL2.Opt(IDL2.Text),
    "mitreDetail": IDL2.Opt(MitreDetail2)
  });
  const NormalizedAlert2 = IDL2.Record({
    "id": IDL2.Text,
    "region": IDL2.Opt(IDL2.Text),
    "status": AlertStatus2,
    "mitre": IDL2.Opt(MitreTag2),
    "title": IDL2.Text,
    "findingId": IDL2.Text,
    "provider": ProviderType2,
    "accountId": IDL2.Opt(IDL2.Text),
    "customer": IDL2.Text,
    "assetId": IDL2.Opt(IDL2.Text),
    "owner": IDL2.Opt(IDL2.Text),
    "rawFindingId": IDL2.Text,
    "recurrenceCount": IDL2.Nat,
    "description": IDL2.Text,
    "ingestionSource": IDL2.Opt(
      IDL2.Variant({ "Poll": IDL2.Null, "Webhook": IDL2.Null })
    ),
    "originalSeverity": IDL2.Text,
    "timestamp": IDL2.Int,
    "assetType": IDL2.Opt(IDL2.Text),
    "severity": Severity2,
    "enrichment": IDL2.Opt(AlertEnrichment2)
  });
  const RuleSeverityThreshold2 = IDL2.Variant({
    "All": IDL2.Null,
    "AnyHigh": IDL2.Null,
    "CriticalOrHigh": IDL2.Null,
    "AnyCritical": IDL2.Null,
    "AnyLow": IDL2.Null,
    "AnyMedium": IDL2.Null
  });
  const NotificationChannel2 = IDL2.Variant({
    "Email": IDL2.Null,
    "InApp": IDL2.Null,
    "TeamsWebhook": IDL2.Null
  });
  const AlertRule2 = IDL2.Record({
    "id": IDL2.Text,
    "region": IDL2.Opt(IDL2.Text),
    "escalationRecipient": IDL2.Opt(IDL2.Text),
    "severityThreshold": IDL2.Opt(RuleSeverityThreshold2),
    "provider": IDL2.Opt(ProviderType2),
    "customer": IDL2.Text,
    "assetId": IDL2.Opt(IDL2.Text),
    "name": IDL2.Text,
    "escalationMinutes": IDL2.Opt(IDL2.Nat),
    "channels": IDL2.Vec(NotificationChannel2),
    "cooldownMinutes": IDL2.Nat,
    "enabled": IDL2.Bool,
    "findingType": IDL2.Opt(IDL2.Text)
  });
  const AssetType2 = IDL2.Variant({
    "S3": IDL2.Null,
    "AzureVM": IDL2.Null,
    "EC2": IDL2.Null,
    "RDS": IDL2.Null,
    "AzureDatabase": IDL2.Null,
    "GCPStorage": IDL2.Null,
    "GCPCloudSQL": IDL2.Null,
    "Lambda": IDL2.Null,
    "AzureStorage": IDL2.Null,
    "GCPCompute": IDL2.Null,
    "Other": IDL2.Null
  });
  const Asset2 = IDL2.Record({
    "id": IDL2.Text,
    "region": IDL2.Text,
    "provider": ProviderType2,
    "accountId": IDL2.Text,
    "customer": IDL2.Text,
    "name": IDL2.Text,
    "tags": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Text)),
    "assetType": AssetType2,
    "lastSeen": IDL2.Int,
    "riskScore": IDL2.Nat,
    "openFindings": IDL2.Nat
  });
  const AuditLogEntry2 = IDL2.Record({
    "id": IDL2.Text,
    "action": IDL2.Text,
    "customer": IDL2.Text,
    "actorId": IDL2.Text,
    "timestamp": IDL2.Int,
    "details": IDL2.Text
  });
  const ControlStatus2 = IDL2.Variant({
    "Passing": IDL2.Null,
    "NoCoverage": IDL2.Null,
    "Failing": IDL2.Null
  });
  const ComplianceControl2 = IDL2.Record({
    "status": ControlStatus2,
    "title": IDL2.Text,
    "provider": IDL2.Opt(ProviderType2),
    "framework": ComplianceFramework2,
    "failingFindings": IDL2.Nat,
    "description": IDL2.Text,
    "controlId": IDL2.Text,
    "remediationGuidance": IDL2.Text,
    "passingFindings": IDL2.Nat
  });
  const ComplianceTrendEntry2 = IDL2.Record({
    "passingControls": IDL2.Nat,
    "framework": ComplianceFramework2,
    "totalControls": IDL2.Nat,
    "score": IDL2.Nat,
    "weekTimestamp": IDL2.Int
  });
  const IncidentStatus2 = IDL2.Variant({
    "Open": IDL2.Null,
    "Investigating": IDL2.Null,
    "Resolved": IDL2.Null
  });
  const CorrelatedIncident2 = IDL2.Record({
    "status": IncidentStatus2,
    "incidentId": IDL2.Text,
    "customer": IDL2.Text,
    "sourceAlerts": IDL2.Vec(IDL2.Text),
    "detectedAt": IDL2.Int,
    "assignedOwner": IDL2.Opt(IDL2.Text),
    "sourceIp": IDL2.Opt(IDL2.Text),
    "sourceProviders": IDL2.Vec(ProviderType2),
    "timeDeltaMinutes": IDL2.Float64,
    "notes": IDL2.Opt(IDL2.Text),
    "affectedResources": IDL2.Vec(IDL2.Text),
    "severity": Severity2,
    "correlationWindowMinutes": IDL2.Nat,
    "incidentType": IDL2.Text
  });
  const CorrelationStats2 = IDL2.Record({
    "totalAllTime": IDL2.Nat,
    "byType": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Nat)),
    "totalToday": IDL2.Nat,
    "totalThisWeek": IDL2.Nat
  });
  const CredentialHealth2 = IDL2.Variant({
    "Error": IDL2.Text,
    "Authenticating": IDL2.Null,
    "Valid": IDL2.Null,
    "ExpiringSoon": IDL2.Text,
    "Expired": IDL2.Null
  });
  const CredentialHealthStatus2 = IDL2.Record({
    "provider": IDL2.Text,
    "expiryNs": IDL2.Opt(IDL2.Int),
    "health": CredentialHealth2
  });
  const PollingStatus2 = IDL2.Variant({
    "Error": IDL2.Null,
    "AuthPaused": IDL2.Null,
    "Inactive": IDL2.Null,
    "Active": IDL2.Null
  });
  const PollingInterval2 = IDL2.Variant({
    "OneHour": IDL2.Null,
    "ThirtyMin": IDL2.Null,
    "FifteenMin": IDL2.Null,
    "FiveMin": IDL2.Null
  });
  const ProviderPollingState2 = IDL2.Record({
    "status": PollingStatus2,
    "provider": ProviderType2,
    "interval": PollingInterval2,
    "lastPollAttempt": IDL2.Opt(IDL2.Int),
    "lastSuccessfulPoll": IDL2.Opt(IDL2.Int),
    "findingsToday": IDL2.Nat,
    "lastError": IDL2.Opt(IDL2.Text),
    "consecutiveFailures": IDL2.Nat
  });
  const IngestionStats2 = IDL2.Record({
    "providerStates": IDL2.Vec(ProviderPollingState2),
    "activeProviders": IDL2.Nat,
    "totalFindingsToday": IDL2.Nat
  });
  const NotificationStatus2 = IDL2.Variant({
    "Failed": IDL2.Null,
    "Sent": IDL2.Null,
    "Acknowledged": IDL2.Null
  });
  const NotificationLog2 = IDL2.Record({
    "id": IDL2.Text,
    "status": NotificationStatus2,
    "acknowledgedAt": IDL2.Opt(IDL2.Int),
    "customer": IDL2.Text,
    "ruleId": IDL2.Text,
    "recipient": IDL2.Text,
    "alertId": IDL2.Text,
    "acknowledged": IDL2.Bool,
    "timestamp": IDL2.Int,
    "channel": NotificationChannel2
  });
  const RawFinding2 = IDL2.Record({
    "id": IDL2.Text,
    "region": IDL2.Opt(IDL2.Text),
    "title": IDL2.Text,
    "findingId": IDL2.Text,
    "provider": ProviderType2,
    "accountId": IDL2.Opt(IDL2.Text),
    "description": IDL2.Text,
    "rawMetadata": IDL2.Text,
    "timestamp": IDL2.Int,
    "severity": Severity2
  });
  const GeneratedReport2 = IDL2.Record({
    "csvData": IDL2.Opt(IDL2.Text),
    "customer": IDL2.Text,
    "providerScope": IDL2.Vec(IDL2.Text),
    "generatedAt": IDL2.Text,
    "generatedBy": IDL2.Text,
    "dateRangeStart": IDL2.Text,
    "dateRangeEnd": IDL2.Text,
    "reportType": IDL2.Text,
    "reportId": IDL2.Text,
    "format": IDL2.Text
  });
  const TimelineEvent2 = IDL2.Record({
    "id": IDL2.Text,
    "title": IDL2.Text,
    "provider": IDL2.Opt(ProviderType2),
    "customer": IDL2.Text,
    "description": IDL2.Text,
    "timestamp": IDL2.Int,
    "severity": IDL2.Opt(Severity2),
    "eventType": IDL2.Text
  });
  const SearchResult2 = IDL2.Record({
    "id": IDL2.Text,
    "title": IDL2.Text,
    "provider": IDL2.Opt(ProviderType2),
    "customer": IDL2.Text,
    "description": IDL2.Text,
    "timestamp": IDL2.Int,
    "sourceModule": IDL2.Text,
    "severity": IDL2.Opt(Severity2)
  });
  const UserAssignmentView2 = IDL2.Record({
    "principal": IDL2.Text,
    "providers": IDL2.Vec(ProviderType2)
  });
  const VaultEntryView2 = IDL2.Record({
    "provider": ProviderType2,
    "name": VaultSecretName2,
    "createdAt": IDL2.Int,
    "updatedAt": IDL2.Int,
    "maskedValue": IDL2.Text
  });
  const Result_12 = IDL2.Variant({ "ok": IDL2.Text, "err": VaultError2 });
  const ConnectionTestResult2 = IDL2.Variant({
    "Success": IDL2.Text,
    "Failure": IDL2.Text
  });
  const HttpHeader2 = IDL2.Record({ "value": IDL2.Text, "name": IDL2.Text });
  const HttpRequestResult2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(HttpHeader2)
  });
  const TransformationInput2 = IDL2.Record({
    "context": IDL2.Vec(IDL2.Nat8),
    "response": HttpRequestResult2
  });
  const TransformationOutput2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(HttpHeader2)
  });
  return IDL2.Service({
    "acknowledgeNotification": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "assignProviderAccess": IDL2.Func(
      [IDL2.Principal, IDL2.Vec(ProviderType2)],
      [],
      []
    ),
    "blockIp": IDL2.Func(
      [
        IDL2.Record({
          "ip": IDL2.Text,
          "customer": IDL2.Text,
          "providers": IDL2.Vec(ProviderType2),
          "dryRun": IDL2.Bool
        })
      ],
      [PlaybookResult2],
      []
    ),
    "deleteAlertRule": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "deleteReport": IDL2.Func([IDL2.Text, IDL2.Text], [], []),
    "deleteVaultSecret": IDL2.Func(
      [ProviderType2, VaultSecretName2],
      [Result2],
      []
    ),
    "disableAzureAdAccount": IDL2.Func(
      [
        IDL2.Record({
          "customer": IDL2.Text,
          "userPrincipalName": IDL2.Text,
          "dryRun": IDL2.Bool
        })
      ],
      [PlaybookResult2],
      []
    ),
    "enrichAlertPublic": IDL2.Func([IDL2.Text, IDL2.Text], [Result_32], []),
    "escalateToIncident": IDL2.Func(
      [
        IDL2.Record({
          "customer": IDL2.Text,
          "assignedOwner": IDL2.Opt(IDL2.Text),
          "alertId": IDL2.Text,
          "notes": IDL2.Opt(IDL2.Text),
          "severity": IDL2.Text,
          "dryRun": IDL2.Bool
        })
      ],
      [PlaybookResult2],
      []
    ),
    "execute": IDL2.Func([IDL2.Text], [Result__12], ["query"]),
    "exportComplianceCsv": IDL2.Func(
      [ComplianceFramework2],
      [IDL2.Text],
      ["query"]
    ),
    "exportCompliancePdf": IDL2.Func(
      [ComplianceFramework2],
      [IDL2.Vec(IDL2.Nat8)],
      ["query"]
    ),
    "forceGcpIamReview": IDL2.Func(
      [
        IDL2.Record({
          "customer": IDL2.Text,
          "projectId": IDL2.Text,
          "dryRun": IDL2.Bool
        })
      ],
      [PlaybookResult2],
      []
    ),
    "generateReport": IDL2.Func(
      [
        IDL2.Record({
          "customer": IDL2.Text,
          "providerScope": IDL2.Vec(IDL2.Text),
          "dateRangeStart": IDL2.Text,
          "dateRangeEnd": IDL2.Text,
          "reportType": IDL2.Text
        })
      ],
      [Result_22],
      []
    ),
    "getAlertById": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(NormalizedAlert2)],
      ["query"]
    ),
    "getAlertRules": IDL2.Func([IDL2.Text], [IDL2.Vec(AlertRule2)], ["query"]),
    "getAlertsForCorrelation": IDL2.Func(
      [IDL2.Vec(IDL2.Text)],
      [IDL2.Vec(NormalizedAlert2)],
      ["query"]
    ),
    "getApiDoc": IDL2.Func([], [IDL2.Text], ["query"]),
    "getAssetById": IDL2.Func([IDL2.Text], [IDL2.Opt(Asset2)], ["query"]),
    "getAssetFindings": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(NormalizedAlert2)],
      ["query"]
    ),
    "getAssets": IDL2.Func(
      [
        IDL2.Record({
          "region": IDL2.Opt(IDL2.Text),
          "minRiskScore": IDL2.Opt(IDL2.Nat),
          "provider": IDL2.Opt(ProviderType2),
          "customer": IDL2.Text,
          "limit": IDL2.Nat,
          "assetType": IDL2.Opt(AssetType2)
        })
      ],
      [IDL2.Vec(Asset2)],
      ["query"]
    ),
    "getAuditLog": IDL2.Func(
      [IDL2.Text, IDL2.Nat],
      [IDL2.Vec(AuditLogEntry2)],
      ["query"]
    ),
    "getComplianceControlGaps": IDL2.Func(
      [ComplianceFramework2],
      [IDL2.Vec(ComplianceControl2)],
      ["query"]
    ),
    "getComplianceStatus": IDL2.Func(
      [ComplianceFramework2, IDL2.Opt(ProviderType2)],
      [
        IDL2.Record({
          "total": IDL2.Nat,
          "failing": IDL2.Nat,
          "controls": IDL2.Vec(ComplianceControl2),
          "score": IDL2.Nat,
          "passing": IDL2.Nat
        })
      ],
      ["query"]
    ),
    "getComplianceTrend": IDL2.Func(
      [ComplianceFramework2],
      [IDL2.Vec(ComplianceTrendEntry2)],
      ["query"]
    ),
    "getCorrelatedIncidentById": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(CorrelatedIncident2)],
      ["query"]
    ),
    "getCorrelatedIncidents": IDL2.Func(
      [IDL2.Nat],
      [IDL2.Vec(IDL2.Tuple(IDL2.Text, CorrelatedIncident2))],
      ["query"]
    ),
    "getCorrelationStats": IDL2.Func([], [CorrelationStats2], ["query"]),
    "getCredentialHealth": IDL2.Func(
      [],
      [IDL2.Vec(CredentialHealthStatus2)],
      ["query"]
    ),
    "getEnrichmentKeys": IDL2.Func(
      [],
      [
        IDL2.Record({
          "abuseIpdbKeySet": IDL2.Bool,
          "virusTotalKeySet": IDL2.Bool
        })
      ],
      []
    ),
    "getFailedIngestions": IDL2.Func(
      [IDL2.Opt(ProviderType2), IDL2.Nat],
      [
        IDL2.Vec(
          IDL2.Record({
            "id": IDL2.Text,
            "status": IDL2.Text,
            "provider": IDL2.Text,
            "errorMessage": IDL2.Text,
            "errorType": IDL2.Text,
            "timestamp": IDL2.Int,
            "rawPayload": IDL2.Text
          })
        )
      ],
      ["query"]
    ),
    "getIngestionStats": IDL2.Func([], [IngestionStats2], ["query"]),
    "getMyProviders": IDL2.Func([], [IDL2.Vec(ProviderType2)], ["query"]),
    "getNormalizedAlerts": IDL2.Func(
      [
        IDL2.Record({
          "status": IDL2.Opt(AlertStatus2),
          "provider": IDL2.Opt(ProviderType2),
          "customer": IDL2.Text,
          "limit": IDL2.Nat,
          "severity": IDL2.Opt(Severity2)
        })
      ],
      [IDL2.Vec(NormalizedAlert2)],
      ["query"]
    ),
    "getNotificationLogs": IDL2.Func(
      [IDL2.Record({ "customer": IDL2.Text, "limit": IDL2.Nat })],
      [IDL2.Vec(NotificationLog2)],
      ["query"]
    ),
    "getPipelineHealth": IDL2.Func(
      [],
      [
        IDL2.Vec(
          IDL2.Record({
            "provider": IDL2.Text,
            "failedIngestionCount": IDL2.Nat,
            "pollEventsToday": IDL2.Nat,
            "normalizationSuccessRate": IDL2.Float64,
            "webhookEventsToday": IDL2.Nat,
            "avgLatencyMs": IDL2.Float64
          })
        )
      ],
      ["query"]
    ),
    "getProviderStates": IDL2.Func(
      [],
      [IDL2.Vec(ProviderPollingState2)],
      ["query"]
    ),
    "getRawFindings": IDL2.Func(
      [ProviderType2, IDL2.Nat, IDL2.Nat],
      [
        IDL2.Record({
          "hasMore": IDL2.Bool,
          "totalCount": IDL2.Nat,
          "items": IDL2.Vec(RawFinding2)
        })
      ],
      ["query"]
    ),
    "getReportCsv": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Opt(IDL2.Text)], []),
    "getReportEmailConfig": IDL2.Func(
      [IDL2.Text],
      [
        IDL2.Vec(
          IDL2.Record({
            "reportType": IDL2.Text,
            "recipients": IDL2.Vec(IDL2.Text)
          })
        )
      ],
      []
    ),
    "getReports": IDL2.Func([IDL2.Text], [IDL2.Vec(GeneratedReport2)], []),
    "getTimeline": IDL2.Func(
      [IDL2.Text, IDL2.Nat],
      [IDL2.Vec(TimelineEvent2)],
      ["query"]
    ),
    "getWebhookSecretStatus": IDL2.Func(
      [],
      [
        IDL2.Record({
          "azureSet": IDL2.Bool,
          "gcpSet": IDL2.Bool,
          "awsSet": IDL2.Bool
        })
      ],
      []
    ),
    "getWebhookStats": IDL2.Func(
      [],
      [
        IDL2.Record({
          "webhookNormalizationRate": IDL2.Float64,
          "webhookEventsToday": IDL2.Nat
        })
      ],
      ["query"]
    ),
    "globalSearch": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Nat],
      [
        IDL2.Record({
          "hasMore": IDL2.Bool,
          "results": IDL2.Vec(SearchResult2)
        })
      ],
      ["query"]
    ),
    "hasAdminCredentials": IDL2.Func([], [IDL2.Bool], ["query"]),
    "http_request": IDL2.Func(
      [
        IDL2.Record({
          "url": IDL2.Text,
          "method": IDL2.Text,
          "body": IDL2.Vec(IDL2.Nat8),
          "headers": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Text))
        })
      ],
      [
        IDL2.Record({
          "body": IDL2.Vec(IDL2.Nat8),
          "headers": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Text)),
          "upgrade": IDL2.Opt(IDL2.Bool),
          "streaming_strategy": IDL2.Opt(IDL2.Null),
          "status_code": IDL2.Nat16
        })
      ],
      ["query"]
    ),
    "http_request_update": IDL2.Func(
      [
        IDL2.Record({
          "url": IDL2.Text,
          "method": IDL2.Text,
          "body": IDL2.Vec(IDL2.Nat8),
          "headers": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Text))
        })
      ],
      [
        IDL2.Record({
          "body": IDL2.Vec(IDL2.Nat8),
          "headers": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Text)),
          "upgrade": IDL2.Opt(IDL2.Bool),
          "streaming_strategy": IDL2.Opt(IDL2.Null),
          "status_code": IDL2.Nat16
        })
      ],
      []
    ),
    "isolateResource": IDL2.Func(
      [
        IDL2.Record({
          "provider": ProviderType2,
          "customer": IDL2.Text,
          "resourceId": IDL2.Text,
          "dryRun": IDL2.Bool
        })
      ],
      [PlaybookResult2],
      []
    ),
    "listUserAssignments": IDL2.Func(
      [],
      [IDL2.Vec(UserAssignmentView2)],
      ["query"]
    ),
    "listVaultSecrets": IDL2.Func(
      [ProviderType2],
      [IDL2.Vec(VaultEntryView2)],
      ["query"]
    ),
    "removeProviderAccess": IDL2.Func([IDL2.Principal, ProviderType2], [], []),
    "revealVaultSecret": IDL2.Func(
      [ProviderType2, VaultSecretName2],
      [Result_12],
      []
    ),
    "revokeIamCredentials": IDL2.Func(
      [
        IDL2.Record({
          "provider": ProviderType2,
          "customer": IDL2.Text,
          "userId": IDL2.Text,
          "accessKeyId": IDL2.Opt(IDL2.Text),
          "dryRun": IDL2.Bool
        })
      ],
      [PlaybookResult2],
      []
    ),
    "saveAlertRule": IDL2.Func([AlertRule2], [IDL2.Bool], []),
    "saveEnrichmentKeys": IDL2.Func(
      [
        IDL2.Record({
          "virusTotalKey": IDL2.Opt(IDL2.Text),
          "abuseIpdbKey": IDL2.Opt(IDL2.Text)
        })
      ],
      [],
      []
    ),
    "saveReportEmailConfig": IDL2.Func(
      [
        IDL2.Record({
          "customer": IDL2.Text,
          "reportType": IDL2.Text,
          "recipients": IDL2.Vec(IDL2.Text)
        })
      ],
      [],
      []
    ),
    "saveVaultSecret": IDL2.Func(
      [ProviderType2, VaultSecretName2, IDL2.Text],
      [Result2],
      []
    ),
    "saveWebhookSecret": IDL2.Func([ProviderType2, IDL2.Text], [], []),
    "schema": IDL2.Func([], [IDL2.Text], ["query"]),
    "setPollingInterval": IDL2.Func([ProviderType2, PollingInterval2], [], []),
    "testAwsConnection": IDL2.Func([], [ConnectionTestResult2], []),
    "testAzureConnection": IDL2.Func([], [ConnectionTestResult2], []),
    "testGcpConnection": IDL2.Func([], [ConnectionTestResult2], []),
    "transform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
      ["query"]
    ),
    "triggerPoll": IDL2.Func([ProviderType2], [], []),
    "updateAlertStatus": IDL2.Func(
      [IDL2.Text, AlertStatus2, IDL2.Opt(IDL2.Text)],
      [IDL2.Bool],
      []
    ),
    "updateCorrelatedIncidentStatus": IDL2.Func(
      [IDL2.Text, IncidentStatus2, IDL2.Opt(IDL2.Text), IDL2.Opt(IDL2.Text)],
      [IDL2.Bool],
      []
    ),
    "updateVaultSecret": IDL2.Func(
      [ProviderType2, VaultSecretName2, IDL2.Text],
      [Result2],
      []
    )
  });
};
new TextEncoder().encode("icfs-chunk/");
new TextEncoder().encode("icfs-metadata/");
new TextEncoder().encode("ynode/");
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var PollingStatus = /* @__PURE__ */ ((PollingStatus2) => {
  PollingStatus2["Error_"] = "Error";
  PollingStatus2["AuthPaused"] = "AuthPaused";
  PollingStatus2["Inactive"] = "Inactive";
  PollingStatus2["Active"] = "Active";
  return PollingStatus2;
})(PollingStatus || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async acknowledgeNotification(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.acknowledgeNotification(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.acknowledgeNotification(arg0);
      return result;
    }
  }
  async assignProviderAccess(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignProviderAccess(arg0, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignProviderAccess(arg0, to_candid_vec_n1(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async blockIp(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.blockIp(to_candid_record_n4(this._uploadFile, this._downloadFile, arg0));
        return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.blockIp(to_candid_record_n4(this._uploadFile, this._downloadFile, arg0));
      return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteAlertRule(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteAlertRule(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteAlertRule(arg0);
      return result;
    }
  }
  async deleteReport(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteReport(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteReport(arg0, arg1);
      return result;
    }
  }
  async deleteVaultSecret(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
        return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
      return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async disableAzureAdAccount(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.disableAzureAdAccount(arg0);
        return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.disableAzureAdAccount(arg0);
      return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async enrichAlertPublic(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.enrichAlertPublic(arg0, arg1);
        return from_candid_Result_3_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.enrichAlertPublic(arg0, arg1);
      return from_candid_Result_3_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async escalateToIncident(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.escalateToIncident(to_candid_record_n17(this._uploadFile, this._downloadFile, arg0));
        return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.escalateToIncident(to_candid_record_n17(this._uploadFile, this._downloadFile, arg0));
      return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async execute(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.execute(arg0);
        return from_candid_Result__1_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.execute(arg0);
      return from_candid_Result__1_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async exportComplianceCsv(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.exportComplianceCsv(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.exportComplianceCsv(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async exportCompliancePdf(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.exportCompliancePdf(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.exportCompliancePdf(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async forceGcpIamReview(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.forceGcpIamReview(arg0);
        return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.forceGcpIamReview(arg0);
      return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async generateReport(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.generateReport(arg0);
        return from_candid_Result_2_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.generateReport(arg0);
      return from_candid_Result_2_n28(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAlertById(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAlertById(arg0);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAlertById(arg0);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAlertRules(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAlertRules(arg0);
        return from_candid_vec_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAlertRules(arg0);
      return from_candid_vec_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAlertsForCorrelation(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAlertsForCorrelation(arg0);
        return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAlertsForCorrelation(arg0);
      return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
    }
  }
  async getApiDoc() {
    if (this.processError) {
      try {
        const result = await this.actor.getApiDoc();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getApiDoc();
      return result;
    }
  }
  async getAssetById(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAssetById(arg0);
        return from_candid_opt_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAssetById(arg0);
      return from_candid_opt_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAssetFindings(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAssetFindings(arg0);
        return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAssetFindings(arg0);
      return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAssets(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAssets(to_candid_record_n62(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n65(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAssets(to_candid_record_n62(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n65(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAuditLog(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getAuditLog(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAuditLog(arg0, arg1);
      return result;
    }
  }
  async getComplianceControlGaps(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getComplianceControlGaps(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n66(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getComplianceControlGaps(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n66(this._uploadFile, this._downloadFile, result);
    }
  }
  async getComplianceStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getComplianceStatus(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n73(this._uploadFile, this._downloadFile, arg1));
        return from_candid_record_n74(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getComplianceStatus(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n73(this._uploadFile, this._downloadFile, arg1));
      return from_candid_record_n74(this._uploadFile, this._downloadFile, result);
    }
  }
  async getComplianceTrend(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getComplianceTrend(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n75(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getComplianceTrend(to_candid_ComplianceFramework_n26(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n75(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCorrelatedIncidentById(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCorrelatedIncidentById(arg0);
        return from_candid_opt_n78(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCorrelatedIncidentById(arg0);
      return from_candid_opt_n78(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCorrelatedIncidents(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getCorrelatedIncidents(arg0);
        return from_candid_vec_n84(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCorrelatedIncidents(arg0);
      return from_candid_vec_n84(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCorrelationStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getCorrelationStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCorrelationStats();
      return result;
    }
  }
  async getCredentialHealth() {
    if (this.processError) {
      try {
        const result = await this.actor.getCredentialHealth();
        return from_candid_vec_n86(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCredentialHealth();
      return from_candid_vec_n86(this._uploadFile, this._downloadFile, result);
    }
  }
  async getEnrichmentKeys() {
    if (this.processError) {
      try {
        const result = await this.actor.getEnrichmentKeys();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getEnrichmentKeys();
      return result;
    }
  }
  async getFailedIngestions(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getFailedIngestions(to_candid_opt_n73(this._uploadFile, this._downloadFile, arg0), arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFailedIngestions(to_candid_opt_n73(this._uploadFile, this._downloadFile, arg0), arg1);
      return result;
    }
  }
  async getIngestionStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getIngestionStats();
        return from_candid_IngestionStats_n92(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getIngestionStats();
      return from_candid_IngestionStats_n92(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProviders() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProviders();
        return from_candid_vec_n83(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProviders();
      return from_candid_vec_n83(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNormalizedAlerts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getNormalizedAlerts(to_candid_record_n101(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNormalizedAlerts(to_candid_record_n101(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNotificationLogs(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getNotificationLogs(arg0);
        return from_candid_vec_n106(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNotificationLogs(arg0);
      return from_candid_vec_n106(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPipelineHealth() {
    if (this.processError) {
      try {
        const result = await this.actor.getPipelineHealth();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPipelineHealth();
      return result;
    }
  }
  async getProviderStates() {
    if (this.processError) {
      try {
        const result = await this.actor.getProviderStates();
        return from_candid_vec_n94(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProviderStates();
      return from_candid_vec_n94(this._uploadFile, this._downloadFile, result);
    }
  }
  async getRawFindings(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.getRawFindings(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
        return from_candid_record_n111(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRawFindings(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
      return from_candid_record_n111(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReportCsv(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getReportCsv(arg0, arg1);
        return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReportCsv(arg0, arg1);
      return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReportEmailConfig(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReportEmailConfig(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReportEmailConfig(arg0);
      return result;
    }
  }
  async getReports(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReports(arg0);
        return from_candid_vec_n115(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReports(arg0);
      return from_candid_vec_n115(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTimeline(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getTimeline(arg0, arg1);
        return from_candid_vec_n118(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTimeline(arg0, arg1);
      return from_candid_vec_n118(this._uploadFile, this._downloadFile, result);
    }
  }
  async getWebhookSecretStatus() {
    if (this.processError) {
      try {
        const result = await this.actor.getWebhookSecretStatus();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getWebhookSecretStatus();
      return result;
    }
  }
  async getWebhookStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getWebhookStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getWebhookStats();
      return result;
    }
  }
  async globalSearch(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.globalSearch(arg0, arg1, arg2);
        return from_candid_record_n122(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.globalSearch(arg0, arg1, arg2);
      return from_candid_record_n122(this._uploadFile, this._downloadFile, result);
    }
  }
  async hasAdminCredentials() {
    if (this.processError) {
      try {
        const result = await this.actor.hasAdminCredentials();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.hasAdminCredentials();
      return result;
    }
  }
  async http_request(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.http_request(arg0);
        return from_candid_record_n126(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.http_request(arg0);
      return from_candid_record_n126(this._uploadFile, this._downloadFile, result);
    }
  }
  async http_request_update(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.http_request_update(arg0);
        return from_candid_record_n126(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.http_request_update(arg0);
      return from_candid_record_n126(this._uploadFile, this._downloadFile, result);
    }
  }
  async isolateResource(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.isolateResource(to_candid_record_n129(this._uploadFile, this._downloadFile, arg0));
        return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isolateResource(to_candid_record_n129(this._uploadFile, this._downloadFile, arg0));
      return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async listUserAssignments() {
    if (this.processError) {
      try {
        const result = await this.actor.listUserAssignments();
        return from_candid_vec_n130(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listUserAssignments();
      return from_candid_vec_n130(this._uploadFile, this._downloadFile, result);
    }
  }
  async listVaultSecrets(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listVaultSecrets(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n133(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listVaultSecrets(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n133(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeProviderAccess(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.removeProviderAccess(arg0, to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeProviderAccess(arg0, to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async revealVaultSecret(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.revealVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
        return from_candid_Result_1_n136(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.revealVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
      return from_candid_Result_1_n136(this._uploadFile, this._downloadFile, result);
    }
  }
  async revokeIamCredentials(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.revokeIamCredentials(to_candid_record_n138(this._uploadFile, this._downloadFile, arg0));
        return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.revokeIamCredentials(to_candid_record_n138(this._uploadFile, this._downloadFile, arg0));
      return from_candid_PlaybookResult_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async saveAlertRule(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveAlertRule(to_candid_AlertRule_n139(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveAlertRule(to_candid_AlertRule_n139(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async saveEnrichmentKeys(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveEnrichmentKeys(to_candid_record_n146(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveEnrichmentKeys(to_candid_record_n146(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async saveReportEmailConfig(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveReportEmailConfig(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveReportEmailConfig(arg0);
      return result;
    }
  }
  async saveVaultSecret(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.saveVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
        return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
      return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
    }
  }
  async saveWebhookSecret(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.saveWebhookSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveWebhookSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1);
      return result;
    }
  }
  async schema() {
    if (this.processError) {
      try {
        const result = await this.actor.schema();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.schema();
      return result;
    }
  }
  async setPollingInterval(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.setPollingInterval(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), to_candid_PollingInterval_n147(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setPollingInterval(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), to_candid_PollingInterval_n147(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async testAwsConnection() {
    if (this.processError) {
      try {
        const result = await this.actor.testAwsConnection();
        return from_candid_ConnectionTestResult_n149(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.testAwsConnection();
      return from_candid_ConnectionTestResult_n149(this._uploadFile, this._downloadFile, result);
    }
  }
  async testAzureConnection() {
    if (this.processError) {
      try {
        const result = await this.actor.testAzureConnection();
        return from_candid_ConnectionTestResult_n149(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.testAzureConnection();
      return from_candid_ConnectionTestResult_n149(this._uploadFile, this._downloadFile, result);
    }
  }
  async testGcpConnection() {
    if (this.processError) {
      try {
        const result = await this.actor.testGcpConnection();
        return from_candid_ConnectionTestResult_n149(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.testGcpConnection();
      return from_candid_ConnectionTestResult_n149(this._uploadFile, this._downloadFile, result);
    }
  }
  async transform(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.transform(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.transform(arg0);
      return result;
    }
  }
  async triggerPoll(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.triggerPoll(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.triggerPoll(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async updateAlertStatus(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.updateAlertStatus(arg0, to_candid_AlertStatus_n102(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n151(this._uploadFile, this._downloadFile, arg2));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateAlertStatus(arg0, to_candid_AlertStatus_n102(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n151(this._uploadFile, this._downloadFile, arg2));
      return result;
    }
  }
  async updateCorrelatedIncidentStatus(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.updateCorrelatedIncidentStatus(arg0, to_candid_IncidentStatus_n152(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n151(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n151(this._uploadFile, this._downloadFile, arg3));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateCorrelatedIncidentStatus(arg0, to_candid_IncidentStatus_n152(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n151(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n151(this._uploadFile, this._downloadFile, arg3));
      return result;
    }
  }
  async updateVaultSecret(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.updateVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
        return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateVaultSecret(to_candid_ProviderType_n2(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
      return from_candid_Result_n11(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_AlertEnrichment_n41(_uploadFile, _downloadFile, value) {
  return from_candid_record_n42(_uploadFile, _downloadFile, value);
}
function from_candid_AlertRule_n47(_uploadFile, _downloadFile, value) {
  return from_candid_record_n48(_uploadFile, _downloadFile, value);
}
function from_candid_AlertStatus_n33(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n34(_uploadFile, _downloadFile, value);
}
function from_candid_AssetType_n60(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n61(_uploadFile, _downloadFile, value);
}
function from_candid_Asset_n58(_uploadFile, _downloadFile, value) {
  return from_candid_record_n59(_uploadFile, _downloadFile, value);
}
function from_candid_Cell_n22(_uploadFile, _downloadFile, value) {
  return from_candid_record_n23(_uploadFile, _downloadFile, value);
}
function from_candid_ComplianceControl_n67(_uploadFile, _downloadFile, value) {
  return from_candid_record_n68(_uploadFile, _downloadFile, value);
}
function from_candid_ComplianceFramework_n71(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n72(_uploadFile, _downloadFile, value);
}
function from_candid_ComplianceTrendEntry_n76(_uploadFile, _downloadFile, value) {
  return from_candid_record_n77(_uploadFile, _downloadFile, value);
}
function from_candid_ConnectionTestResult_n149(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n150(_uploadFile, _downloadFile, value);
}
function from_candid_ControlStatus_n69(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n70(_uploadFile, _downloadFile, value);
}
function from_candid_CorrelatedIncident_n79(_uploadFile, _downloadFile, value) {
  return from_candid_record_n80(_uploadFile, _downloadFile, value);
}
function from_candid_CredentialHealthStatus_n87(_uploadFile, _downloadFile, value) {
  return from_candid_record_n88(_uploadFile, _downloadFile, value);
}
function from_candid_CredentialHealth_n90(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n91(_uploadFile, _downloadFile, value);
}
function from_candid_GeneratedReport_n116(_uploadFile, _downloadFile, value) {
  return from_candid_record_n117(_uploadFile, _downloadFile, value);
}
function from_candid_IncidentStatus_n81(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n82(_uploadFile, _downloadFile, value);
}
function from_candid_IngestionStats_n92(_uploadFile, _downloadFile, value) {
  return from_candid_record_n93(_uploadFile, _downloadFile, value);
}
function from_candid_NormalizedAlert_n31(_uploadFile, _downloadFile, value) {
  return from_candid_record_n32(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationChannel_n54(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n55(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationLog_n107(_uploadFile, _downloadFile, value) {
  return from_candid_record_n108(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationStatus_n109(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n110(_uploadFile, _downloadFile, value);
}
function from_candid_PlaybookResult_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_PollingInterval_n99(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n100(_uploadFile, _downloadFile, value);
}
function from_candid_PollingStatus_n97(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n98(_uploadFile, _downloadFile, value);
}
function from_candid_ProviderPollingState_n95(_uploadFile, _downloadFile, value) {
  return from_candid_record_n96(_uploadFile, _downloadFile, value);
}
function from_candid_ProviderType_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_RawFinding_n113(_uploadFile, _downloadFile, value) {
  return from_candid_record_n114(_uploadFile, _downloadFile, value);
}
function from_candid_Result_1_n136(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n137(_uploadFile, _downloadFile, value);
}
function from_candid_Result_2_n28(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n29(_uploadFile, _downloadFile, value);
}
function from_candid_Result_3_n15(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n18(_uploadFile, _downloadFile, value) {
  return from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n11(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function from_candid_RuleSeverityThreshold_n50(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n51(_uploadFile, _downloadFile, value);
}
function from_candid_SearchResult_n124(_uploadFile, _downloadFile, value) {
  return from_candid_record_n125(_uploadFile, _downloadFile, value);
}
function from_candid_Severity_n38(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n39(_uploadFile, _downloadFile, value);
}
function from_candid_TimelineEvent_n119(_uploadFile, _downloadFile, value) {
  return from_candid_record_n120(_uploadFile, _downloadFile, value);
}
function from_candid_UserAssignmentView_n131(_uploadFile, _downloadFile, value) {
  return from_candid_record_n132(_uploadFile, _downloadFile, value);
}
function from_candid_Value_n24(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n25(_uploadFile, _downloadFile, value);
}
function from_candid_VaultEntryView_n134(_uploadFile, _downloadFile, value) {
  return from_candid_record_n135(_uploadFile, _downloadFile, value);
}
function from_candid_VaultError_n13(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n121(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Severity_n38(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n127(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n128(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n30(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_NormalizedAlert_n31(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n35(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n36(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_variant_n37(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_AlertEnrichment_n41(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n43(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n44(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n45(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n49(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_RuleSeverityThreshold_n50(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n52(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n57(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Asset_n58(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n78(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_CorrelatedIncident_n79(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n8(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ProviderType_n9(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n89(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n108(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_NotificationStatus_n109(_uploadFile, _downloadFile, value.status),
    acknowledgedAt: record_opt_to_undefined(from_candid_opt_n89(_uploadFile, _downloadFile, value.acknowledgedAt)),
    customer: value.customer,
    ruleId: value.ruleId,
    recipient: value.recipient,
    alertId: value.alertId,
    acknowledged: value.acknowledged,
    timestamp: value.timestamp,
    channel: from_candid_NotificationChannel_n54(_uploadFile, _downloadFile, value.channel)
  };
}
function from_candid_record_n111(_uploadFile, _downloadFile, value) {
  return {
    hasMore: value.hasMore,
    totalCount: value.totalCount,
    items: from_candid_vec_n112(_uploadFile, _downloadFile, value.items)
  };
}
function from_candid_record_n114(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    region: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.region)),
    title: value.title,
    findingId: value.findingId,
    provider: from_candid_ProviderType_n9(_uploadFile, _downloadFile, value.provider),
    accountId: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.accountId)),
    description: value.description,
    rawMetadata: value.rawMetadata,
    timestamp: value.timestamp,
    severity: from_candid_Severity_n38(_uploadFile, _downloadFile, value.severity)
  };
}
function from_candid_record_n117(_uploadFile, _downloadFile, value) {
  return {
    csvData: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.csvData)),
    customer: value.customer,
    providerScope: value.providerScope,
    generatedAt: value.generatedAt,
    generatedBy: value.generatedBy,
    dateRangeStart: value.dateRangeStart,
    dateRangeEnd: value.dateRangeEnd,
    reportType: value.reportType,
    reportId: value.reportId,
    format: value.format
  };
}
function from_candid_record_n120(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    title: value.title,
    provider: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.provider)),
    customer: value.customer,
    description: value.description,
    timestamp: value.timestamp,
    severity: record_opt_to_undefined(from_candid_opt_n121(_uploadFile, _downloadFile, value.severity)),
    eventType: value.eventType
  };
}
function from_candid_record_n122(_uploadFile, _downloadFile, value) {
  return {
    hasMore: value.hasMore,
    results: from_candid_vec_n123(_uploadFile, _downloadFile, value.results)
  };
}
function from_candid_record_n125(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    title: value.title,
    provider: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.provider)),
    customer: value.customer,
    description: value.description,
    timestamp: value.timestamp,
    sourceModule: value.sourceModule,
    severity: record_opt_to_undefined(from_candid_opt_n121(_uploadFile, _downloadFile, value.severity))
  };
}
function from_candid_record_n126(_uploadFile, _downloadFile, value) {
  return {
    body: value.body,
    headers: value.headers,
    upgrade: record_opt_to_undefined(from_candid_opt_n127(_uploadFile, _downloadFile, value.upgrade)),
    streaming_strategy: record_opt_to_undefined(from_candid_opt_n128(_uploadFile, _downloadFile, value.streaming_strategy)),
    status_code: value.status_code
  };
}
function from_candid_record_n132(_uploadFile, _downloadFile, value) {
  return {
    principal: value.principal,
    providers: from_candid_vec_n83(_uploadFile, _downloadFile, value.providers)
  };
}
function from_candid_record_n135(_uploadFile, _downloadFile, value) {
  return {
    provider: from_candid_ProviderType_n9(_uploadFile, _downloadFile, value.provider),
    name: value.name,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    maskedValue: value.maskedValue
  };
}
function from_candid_record_n19(_uploadFile, _downloadFile, value) {
  return {
    hasMore: value.hasMore,
    rows: from_candid_vec_n20(_uploadFile, _downloadFile, value.rows)
  };
}
function from_candid_record_n23(_uploadFile, _downloadFile, value) {
  return {
    value: from_candid_Value_n24(_uploadFile, _downloadFile, value.value),
    name: value.name
  };
}
function from_candid_record_n32(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    region: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.region)),
    status: from_candid_AlertStatus_n33(_uploadFile, _downloadFile, value.status),
    mitre: record_opt_to_undefined(from_candid_opt_n35(_uploadFile, _downloadFile, value.mitre)),
    title: value.title,
    findingId: value.findingId,
    provider: from_candid_ProviderType_n9(_uploadFile, _downloadFile, value.provider),
    accountId: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.accountId)),
    customer: value.customer,
    assetId: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.assetId)),
    owner: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.owner)),
    rawFindingId: value.rawFindingId,
    recurrenceCount: value.recurrenceCount,
    description: value.description,
    ingestionSource: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.ingestionSource)),
    originalSeverity: value.originalSeverity,
    timestamp: value.timestamp,
    assetType: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.assetType)),
    severity: from_candid_Severity_n38(_uploadFile, _downloadFile, value.severity),
    enrichment: record_opt_to_undefined(from_candid_opt_n40(_uploadFile, _downloadFile, value.enrichment))
  };
}
function from_candid_record_n42(_uploadFile, _downloadFile, value) {
  return {
    domainRep: record_opt_to_undefined(from_candid_opt_n43(_uploadFile, _downloadFile, value.domainRep)),
    knownMaliciousIp: value.knownMaliciousIp,
    ipReputation: record_opt_to_undefined(from_candid_opt_n44(_uploadFile, _downloadFile, value.ipReputation)),
    enrichedAt: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.enrichedAt)),
    mitreDetail: record_opt_to_undefined(from_candid_opt_n45(_uploadFile, _downloadFile, value.mitreDetail))
  };
}
function from_candid_record_n48(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    region: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.region)),
    escalationRecipient: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.escalationRecipient)),
    severityThreshold: record_opt_to_undefined(from_candid_opt_n49(_uploadFile, _downloadFile, value.severityThreshold)),
    provider: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.provider)),
    customer: value.customer,
    assetId: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.assetId)),
    name: value.name,
    escalationMinutes: record_opt_to_undefined(from_candid_opt_n52(_uploadFile, _downloadFile, value.escalationMinutes)),
    channels: from_candid_vec_n53(_uploadFile, _downloadFile, value.channels),
    cooldownMinutes: value.cooldownMinutes,
    enabled: value.enabled,
    findingType: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.findingType))
  };
}
function from_candid_record_n59(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    region: value.region,
    provider: from_candid_ProviderType_n9(_uploadFile, _downloadFile, value.provider),
    accountId: value.accountId,
    customer: value.customer,
    name: value.name,
    tags: value.tags,
    assetType: from_candid_AssetType_n60(_uploadFile, _downloadFile, value.assetType),
    lastSeen: value.lastSeen,
    riskScore: value.riskScore,
    openFindings: value.openFindings
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    rawApiError: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.rawApiError)),
    dryRunPreview: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.dryRunPreview)),
    provider: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.provider)),
    message: value.message,
    success: value.success
  };
}
function from_candid_record_n68(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_ControlStatus_n69(_uploadFile, _downloadFile, value.status),
    title: value.title,
    provider: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.provider)),
    framework: from_candid_ComplianceFramework_n71(_uploadFile, _downloadFile, value.framework),
    failingFindings: value.failingFindings,
    description: value.description,
    controlId: value.controlId,
    remediationGuidance: value.remediationGuidance,
    passingFindings: value.passingFindings
  };
}
function from_candid_record_n74(_uploadFile, _downloadFile, value) {
  return {
    total: value.total,
    failing: value.failing,
    controls: from_candid_vec_n66(_uploadFile, _downloadFile, value.controls),
    score: value.score,
    passing: value.passing
  };
}
function from_candid_record_n77(_uploadFile, _downloadFile, value) {
  return {
    passingControls: value.passingControls,
    framework: from_candid_ComplianceFramework_n71(_uploadFile, _downloadFile, value.framework),
    totalControls: value.totalControls,
    score: value.score,
    weekTimestamp: value.weekTimestamp
  };
}
function from_candid_record_n80(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_IncidentStatus_n81(_uploadFile, _downloadFile, value.status),
    incidentId: value.incidentId,
    customer: value.customer,
    sourceAlerts: value.sourceAlerts,
    detectedAt: value.detectedAt,
    assignedOwner: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.assignedOwner)),
    sourceIp: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.sourceIp)),
    sourceProviders: from_candid_vec_n83(_uploadFile, _downloadFile, value.sourceProviders),
    timeDeltaMinutes: value.timeDeltaMinutes,
    notes: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.notes)),
    affectedResources: value.affectedResources,
    severity: from_candid_Severity_n38(_uploadFile, _downloadFile, value.severity),
    correlationWindowMinutes: value.correlationWindowMinutes,
    incidentType: value.incidentType
  };
}
function from_candid_record_n88(_uploadFile, _downloadFile, value) {
  return {
    provider: value.provider,
    expiryNs: record_opt_to_undefined(from_candid_opt_n89(_uploadFile, _downloadFile, value.expiryNs)),
    health: from_candid_CredentialHealth_n90(_uploadFile, _downloadFile, value.health)
  };
}
function from_candid_record_n93(_uploadFile, _downloadFile, value) {
  return {
    providerStates: from_candid_vec_n94(_uploadFile, _downloadFile, value.providerStates),
    activeProviders: value.activeProviders,
    totalFindingsToday: value.totalFindingsToday
  };
}
function from_candid_record_n96(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_PollingStatus_n97(_uploadFile, _downloadFile, value.status),
    provider: from_candid_ProviderType_n9(_uploadFile, _downloadFile, value.provider),
    interval: from_candid_PollingInterval_n99(_uploadFile, _downloadFile, value.interval),
    lastPollAttempt: record_opt_to_undefined(from_candid_opt_n89(_uploadFile, _downloadFile, value.lastPollAttempt)),
    lastSuccessfulPoll: record_opt_to_undefined(from_candid_opt_n89(_uploadFile, _downloadFile, value.lastSuccessfulPoll)),
    findingsToday: value.findingsToday,
    lastError: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.lastError)),
    consecutiveFailures: value.consecutiveFailures
  };
}
function from_candid_tuple_n85(_uploadFile, _downloadFile, value) {
  return [
    value[0],
    from_candid_CorrelatedIncident_n79(_uploadFile, _downloadFile, value[1])
  ];
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "AWS" in value ? "AWS" : "GCP" in value ? "GCP" : "Azure" in value ? "Azure" : value;
}
function from_candid_variant_n100(_uploadFile, _downloadFile, value) {
  return "OneHour" in value ? "OneHour" : "ThirtyMin" in value ? "ThirtyMin" : "FifteenMin" in value ? "FifteenMin" : "FiveMin" in value ? "FiveMin" : value;
}
function from_candid_variant_n110(_uploadFile, _downloadFile, value) {
  return "Failed" in value ? "Failed" : "Sent" in value ? "Sent" : "Acknowledged" in value ? "Acknowledged" : value;
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_VaultError_n13(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n137(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_VaultError_n13(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return "NotFound" in value ? "NotFound" : "NotAuthorized" in value ? "NotAuthorized" : "AlreadyExists" in value ? "AlreadyExists" : "InvalidName" in value ? "InvalidName" : value;
}
function from_candid_variant_n150(_uploadFile, _downloadFile, value) {
  return "Success" in value ? {
    __kind__: "Success",
    Success: value.Success
  } : "Failure" in value ? {
    __kind__: "Failure",
    Failure: value.Failure
  } : value;
}
function from_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n25(_uploadFile, _downloadFile, value) {
  return "int" in value ? {
    __kind__: "int",
    int: value.int
  } : "nat" in value ? {
    __kind__: "nat",
    nat: value.nat
  } : "float" in value ? {
    __kind__: "float",
    float: value.float
  } : "bool" in value ? {
    __kind__: "bool",
    bool: value.bool
  } : "null" in value ? {
    __kind__: "null",
    null: value.null
  } : "text" in value ? {
    __kind__: "text",
    text: value.text
  } : value;
}
function from_candid_variant_n29(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n34(_uploadFile, _downloadFile, value) {
  return "Open" in value ? "Open" : "InProgress" in value ? "InProgress" : "Resolved" in value ? "Resolved" : value;
}
function from_candid_variant_n37(_uploadFile, _downloadFile, value) {
  return "Poll" in value ? "Poll" : "Webhook" in value ? "Webhook" : value;
}
function from_candid_variant_n39(_uploadFile, _downloadFile, value) {
  return "Low" in value ? "Low" : "High" in value ? "High" : "Medium" in value ? "Medium" : "Critical" in value ? "Critical" : "Unknown" in value ? "Unknown" : value;
}
function from_candid_variant_n51(_uploadFile, _downloadFile, value) {
  return "All" in value ? "All" : "AnyHigh" in value ? "AnyHigh" : "CriticalOrHigh" in value ? "CriticalOrHigh" : "AnyCritical" in value ? "AnyCritical" : "AnyLow" in value ? "AnyLow" : "AnyMedium" in value ? "AnyMedium" : value;
}
function from_candid_variant_n55(_uploadFile, _downloadFile, value) {
  return "Email" in value ? "Email" : "InApp" in value ? "InApp" : "TeamsWebhook" in value ? "TeamsWebhook" : value;
}
function from_candid_variant_n61(_uploadFile, _downloadFile, value) {
  return "S3" in value ? "S3" : "AzureVM" in value ? "AzureVM" : "EC2" in value ? "EC2" : "RDS" in value ? "RDS" : "AzureDatabase" in value ? "AzureDatabase" : "GCPStorage" in value ? "GCPStorage" : "GCPCloudSQL" in value ? "GCPCloudSQL" : "Lambda" in value ? "Lambda" : "AzureStorage" in value ? "AzureStorage" : "GCPCompute" in value ? "GCPCompute" : "Other" in value ? "Other" : value;
}
function from_candid_variant_n70(_uploadFile, _downloadFile, value) {
  return "Passing" in value ? "Passing" : "NoCoverage" in value ? "NoCoverage" : "Failing" in value ? "Failing" : value;
}
function from_candid_variant_n72(_uploadFile, _downloadFile, value) {
  return "CISAws" in value ? "CISAws" : "CISGCP" in value ? "CISGCP" : "SOC2" in value ? "SOC2" : "ISO27001" in value ? "ISO27001" : "CISAzure" in value ? "CISAzure" : "NISTCSF" in value ? "NISTCSF" : value;
}
function from_candid_variant_n82(_uploadFile, _downloadFile, value) {
  return "Open" in value ? "Open" : "Investigating" in value ? "Investigating" : "Resolved" in value ? "Resolved" : value;
}
function from_candid_variant_n91(_uploadFile, _downloadFile, value) {
  return "Error" in value ? {
    __kind__: "Error",
    Error: value.Error
  } : "Authenticating" in value ? {
    __kind__: "Authenticating",
    Authenticating: value.Authenticating
  } : "Valid" in value ? {
    __kind__: "Valid",
    Valid: value.Valid
  } : "ExpiringSoon" in value ? {
    __kind__: "ExpiringSoon",
    ExpiringSoon: value.ExpiringSoon
  } : "Expired" in value ? {
    __kind__: "Expired",
    Expired: value.Expired
  } : value;
}
function from_candid_variant_n98(_uploadFile, _downloadFile, value) {
  return "Error" in value ? PollingStatus.Error : "AuthPaused" in value ? "AuthPaused" : "Inactive" in value ? "Inactive" : "Active" in value ? "Active" : value;
}
function from_candid_vec_n106(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_NotificationLog_n107(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n112(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_RawFinding_n113(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n115(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_GeneratedReport_n116(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n118(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_TimelineEvent_n119(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n123(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_SearchResult_n124(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n130(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_UserAssignmentView_n131(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n133(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_VaultEntryView_n134(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n20(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_vec_n21(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n21(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Cell_n22(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n46(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_AlertRule_n47(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n53(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_NotificationChannel_n54(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n56(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_NormalizedAlert_n31(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n65(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Asset_n58(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n66(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ComplianceControl_n67(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n75(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ComplianceTrendEntry_n76(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n83(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ProviderType_n9(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n84(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_tuple_n85(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n86(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CredentialHealthStatus_n87(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n94(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ProviderPollingState_n95(_uploadFile, _downloadFile, x));
}
function to_candid_AlertRule_n139(_uploadFile, _downloadFile, value) {
  return to_candid_record_n140(_uploadFile, _downloadFile, value);
}
function to_candid_AlertStatus_n102(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n103(_uploadFile, _downloadFile, value);
}
function to_candid_AssetType_n63(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n64(_uploadFile, _downloadFile, value);
}
function to_candid_ComplianceFramework_n26(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n27(_uploadFile, _downloadFile, value);
}
function to_candid_IncidentStatus_n152(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n153(_uploadFile, _downloadFile, value);
}
function to_candid_NotificationChannel_n144(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n145(_uploadFile, _downloadFile, value);
}
function to_candid_PollingInterval_n147(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n148(_uploadFile, _downloadFile, value);
}
function to_candid_ProviderType_n2(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n3(_uploadFile, _downloadFile, value);
}
function to_candid_RuleSeverityThreshold_n141(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n142(_uploadFile, _downloadFile, value);
}
function to_candid_Severity_n104(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n105(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n151(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n73(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value));
}
function to_candid_record_n101(_uploadFile, _downloadFile, value) {
  return {
    status: value.status ? candid_some(to_candid_AlertStatus_n102(_uploadFile, _downloadFile, value.status)) : candid_none(),
    provider: value.provider ? candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider)) : candid_none(),
    customer: value.customer,
    limit: value.limit,
    severity: value.severity ? candid_some(to_candid_Severity_n104(_uploadFile, _downloadFile, value.severity)) : candid_none()
  };
}
function to_candid_record_n129(_uploadFile, _downloadFile, value) {
  return {
    provider: to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider),
    customer: value.customer,
    resourceId: value.resourceId,
    dryRun: value.dryRun
  };
}
function to_candid_record_n138(_uploadFile, _downloadFile, value) {
  return {
    provider: to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider),
    customer: value.customer,
    userId: value.userId,
    accessKeyId: value.accessKeyId ? candid_some(value.accessKeyId) : candid_none(),
    dryRun: value.dryRun
  };
}
function to_candid_record_n140(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    region: value.region ? candid_some(value.region) : candid_none(),
    escalationRecipient: value.escalationRecipient ? candid_some(value.escalationRecipient) : candid_none(),
    severityThreshold: value.severityThreshold ? candid_some(to_candid_RuleSeverityThreshold_n141(_uploadFile, _downloadFile, value.severityThreshold)) : candid_none(),
    provider: value.provider ? candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider)) : candid_none(),
    customer: value.customer,
    assetId: value.assetId ? candid_some(value.assetId) : candid_none(),
    name: value.name,
    escalationMinutes: value.escalationMinutes ? candid_some(value.escalationMinutes) : candid_none(),
    channels: to_candid_vec_n143(_uploadFile, _downloadFile, value.channels),
    cooldownMinutes: value.cooldownMinutes,
    enabled: value.enabled,
    findingType: value.findingType ? candid_some(value.findingType) : candid_none()
  };
}
function to_candid_record_n146(_uploadFile, _downloadFile, value) {
  return {
    virusTotalKey: value.virusTotalKey ? candid_some(value.virusTotalKey) : candid_none(),
    abuseIpdbKey: value.abuseIpdbKey ? candid_some(value.abuseIpdbKey) : candid_none()
  };
}
function to_candid_record_n17(_uploadFile, _downloadFile, value) {
  return {
    customer: value.customer,
    assignedOwner: value.assignedOwner ? candid_some(value.assignedOwner) : candid_none(),
    alertId: value.alertId,
    notes: value.notes ? candid_some(value.notes) : candid_none(),
    severity: value.severity,
    dryRun: value.dryRun
  };
}
function to_candid_record_n4(_uploadFile, _downloadFile, value) {
  return {
    ip: value.ip,
    customer: value.customer,
    providers: to_candid_vec_n1(_uploadFile, _downloadFile, value.providers),
    dryRun: value.dryRun
  };
}
function to_candid_record_n62(_uploadFile, _downloadFile, value) {
  return {
    region: value.region ? candid_some(value.region) : candid_none(),
    minRiskScore: value.minRiskScore ? candid_some(value.minRiskScore) : candid_none(),
    provider: value.provider ? candid_some(to_candid_ProviderType_n2(_uploadFile, _downloadFile, value.provider)) : candid_none(),
    customer: value.customer,
    limit: value.limit,
    assetType: value.assetType ? candid_some(to_candid_AssetType_n63(_uploadFile, _downloadFile, value.assetType)) : candid_none()
  };
}
function to_candid_variant_n103(_uploadFile, _downloadFile, value) {
  return value == "Open" ? {
    Open: null
  } : value == "InProgress" ? {
    InProgress: null
  } : value == "Resolved" ? {
    Resolved: null
  } : value;
}
function to_candid_variant_n105(_uploadFile, _downloadFile, value) {
  return value == "Low" ? {
    Low: null
  } : value == "High" ? {
    High: null
  } : value == "Medium" ? {
    Medium: null
  } : value == "Critical" ? {
    Critical: null
  } : value == "Unknown" ? {
    Unknown: null
  } : value;
}
function to_candid_variant_n142(_uploadFile, _downloadFile, value) {
  return value == "All" ? {
    All: null
  } : value == "AnyHigh" ? {
    AnyHigh: null
  } : value == "CriticalOrHigh" ? {
    CriticalOrHigh: null
  } : value == "AnyCritical" ? {
    AnyCritical: null
  } : value == "AnyLow" ? {
    AnyLow: null
  } : value == "AnyMedium" ? {
    AnyMedium: null
  } : value;
}
function to_candid_variant_n145(_uploadFile, _downloadFile, value) {
  return value == "Email" ? {
    Email: null
  } : value == "InApp" ? {
    InApp: null
  } : value == "TeamsWebhook" ? {
    TeamsWebhook: null
  } : value;
}
function to_candid_variant_n148(_uploadFile, _downloadFile, value) {
  return value == "OneHour" ? {
    OneHour: null
  } : value == "ThirtyMin" ? {
    ThirtyMin: null
  } : value == "FifteenMin" ? {
    FifteenMin: null
  } : value == "FiveMin" ? {
    FiveMin: null
  } : value;
}
function to_candid_variant_n153(_uploadFile, _downloadFile, value) {
  return value == "Open" ? {
    Open: null
  } : value == "Investigating" ? {
    Investigating: null
  } : value == "Resolved" ? {
    Resolved: null
  } : value;
}
function to_candid_variant_n27(_uploadFile, _downloadFile, value) {
  return value == "CISAws" ? {
    CISAws: null
  } : value == "CISGCP" ? {
    CISGCP: null
  } : value == "SOC2" ? {
    SOC2: null
  } : value == "ISO27001" ? {
    ISO27001: null
  } : value == "CISAzure" ? {
    CISAzure: null
  } : value == "NISTCSF" ? {
    NISTCSF: null
  } : value;
}
function to_candid_variant_n3(_uploadFile, _downloadFile, value) {
  return value == "AWS" ? {
    AWS: null
  } : value == "GCP" ? {
    GCP: null
  } : value == "Azure" ? {
    Azure: null
  } : value;
}
function to_candid_variant_n64(_uploadFile, _downloadFile, value) {
  return value == "S3" ? {
    S3: null
  } : value == "AzureVM" ? {
    AzureVM: null
  } : value == "EC2" ? {
    EC2: null
  } : value == "RDS" ? {
    RDS: null
  } : value == "AzureDatabase" ? {
    AzureDatabase: null
  } : value == "GCPStorage" ? {
    GCPStorage: null
  } : value == "GCPCloudSQL" ? {
    GCPCloudSQL: null
  } : value == "Lambda" ? {
    Lambda: null
  } : value == "AzureStorage" ? {
    AzureStorage: null
  } : value == "GCPCompute" ? {
    GCPCompute: null
  } : value == "Other" ? {
    Other: null
  } : value;
}
function to_candid_vec_n1(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_ProviderType_n2(_uploadFile, _downloadFile, x));
}
function to_candid_vec_n143(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_NotificationChannel_n144(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
var ProviderType = /* @__PURE__ */ ((ProviderType2) => {
  ProviderType2["AWS"] = "AWS";
  ProviderType2["GCP"] = "GCP";
  ProviderType2["Azure"] = "Azure";
  return ProviderType2;
})(ProviderType || {});
const STALE_30S = 3e4;
function toBackendProvider(p) {
  return p;
}
function toBackendFramework(f) {
  return f;
}
function useProviderStates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["providerStates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProviderStates();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useGetMyProviders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["myProviders"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getMyProviders();
      return raw.map(
        (p) => p === ProviderType.AWS ? "AWS" : p === ProviderType.Azure ? "Azure" : "GCP"
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useListUserAssignments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["userAssignments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserAssignments();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useAssignProviderAccess() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      providers
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.assignProviderAccess(
        Principal.fromText(principal),
        providers.map(toBackendProvider)
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userAssignments"] });
      qc.invalidateQueries({ queryKey: ["myProviders"] });
    }
  });
}
function useRemoveProviderAccess() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      provider
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeProviderAccess(
        Principal.fromText(principal),
        toBackendProvider(provider)
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userAssignments"] });
      qc.invalidateQueries({ queryKey: ["myProviders"] });
    }
  });
}
function useRawFindings(provider, limit) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["rawFindings", provider, limit],
    queryFn: async () => {
      if (!actor) return { hasMore: false, totalCount: 0n, items: [] };
      return actor.getRawFindings(
        toBackendProvider(provider),
        BigInt(limit),
        BigInt(0)
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useNormalizedAlerts(filter) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["normalizedAlerts", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNormalizedAlerts({
        customer: filter.customer,
        limit: BigInt(filter.limit),
        ...filter.provider ? { provider: toBackendProvider(filter.provider) } : {},
        ...filter.severity ? { severity: filter.severity } : {},
        ...filter.status ? { status: filter.status } : {}
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useUpdateAlertStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      alertId,
      status,
      owner
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAlertStatus(
        alertId,
        status,
        owner ?? null
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["normalizedAlerts"] });
      qc.invalidateQueries({ queryKey: ["alert"] });
      qc.invalidateQueries({ queryKey: ["assetFindings"] });
    }
  });
}
function useUpdateAlertOwner() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      alertId,
      owner
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAlertStatus(
        alertId,
        "Open",
        owner
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["normalizedAlerts"] });
      qc.invalidateQueries({ queryKey: ["alert"] });
    }
  });
}
function useAssets(customer, limit) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["assets", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssets({
        customer,
        limit: BigInt(limit)
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useAssetById(assetId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAssetById(assetId);
    },
    enabled: !!actor && !isFetching && !!assetId,
    staleTime: STALE_30S
  });
}
function useAssetFindings(assetId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["assetFindings", assetId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssetFindings(assetId);
    },
    enabled: !!actor && !isFetching && !!assetId,
    staleTime: STALE_30S
  });
}
function useComplianceStatus(framework, provider) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["complianceStatus", framework, provider],
    queryFn: async () => {
      if (!actor)
        return { total: 0n, passing: 0n, failing: 0n, score: 0n, controls: [] };
      return actor.getComplianceStatus(
        toBackendFramework(framework),
        provider ? toBackendProvider(provider) : null
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useExportComplianceCsv() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (framework) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportComplianceCsv(
        toBackendFramework(framework)
      );
    }
  });
}
function useExportCompliancePdf() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (framework) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportCompliancePdf(
        toBackendFramework(framework)
      );
    }
  });
}
function useAlertRules(customer) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["alertRules", customer],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlertRules(customer);
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useSaveAlertRule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rule) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveAlertRule(
        rule
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alertRules"] });
    }
  });
}
function useDeleteAlertRule() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAlertRule(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alertRules"] });
    }
  });
}
function useNotificationLogs(customer, limit) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notificationLogs", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotificationLogs({
        customer,
        limit: BigInt(limit)
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useAcknowledgeNotification() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (logId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.acknowledgeNotification(logId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notificationLogs"] });
    }
  });
}
function useBlockIp() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.blockIp({
        ip: req.ip,
        customer: req.customer,
        providers: req.providers,
        dryRun: req.dryRun
      });
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    }
  });
}
function useIsolateResource() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.isolateResource({
        resourceId: req.resourceId,
        provider: toBackendProvider(req.provider),
        customer: req.customer,
        dryRun: req.dryRun
      });
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    }
  });
}
function useRevokeIamCredentials() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.revokeIamCredentials({
        userId: req.userId,
        provider: toBackendProvider(req.provider),
        customer: req.customer,
        dryRun: req.dryRun
      });
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    }
  });
}
function useDisableAzureAdAccount() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.disableAzureAdAccount({
        userPrincipalName: req.userPrincipalName,
        customer: req.customer,
        dryRun: req.dryRun
      });
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    }
  });
}
function useForceGcpIamReview() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.forceGcpIamReview({
        projectId: req.projectId,
        customer: req.customer,
        dryRun: req.dryRun
      });
      return {
        success: raw.success,
        message: raw.message,
        dryRunPreview: raw.dryRunPreview ?? null,
        rawApiError: raw.rawApiError ?? null,
        provider: raw.provider ?? null
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auditLog"] });
    }
  });
}
function useAuditLog(customer, limit) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["auditLog", customer, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuditLog(customer, BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function usePipelineHealth() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["pipelineHealth"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPipelineHealth();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S / 2,
    refetchInterval: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false
  });
}
function useFailedIngestions(provider, limit = 100) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["failedIngestions", provider, limit],
    queryFn: async () => {
      if (!actor) return [];
      const backendProvider = provider ? provider : null;
      return actor.getFailedIngestions(
        backendProvider,
        BigInt(limit)
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useCorrelatedIncidents(limit) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["correlatedIncidents", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCorrelatedIncidents(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useCorrelationStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["correlationStats"],
    queryFn: async () => {
      if (!actor)
        return {
          totalToday: 0n,
          totalThisWeek: 0n,
          totalAllTime: 0n,
          byType: []
        };
      return actor.getCorrelationStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useUpdateCorrelatedIncidentStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      owner,
      notes
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCorrelatedIncidentStatus(
        id,
        status,
        owner ?? null,
        notes ?? null
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["correlatedIncidents"] });
      qc.invalidateQueries({ queryKey: ["correlationStats"] });
      qc.invalidateQueries({ queryKey: ["correlatedIncident"] });
    }
  });
}
function useAlertsForCorrelation(alertIds) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["alertsForCorrelation", alertIds],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlertsForCorrelation(alertIds);
    },
    enabled: !!actor && !isFetching && alertIds.length > 0,
    staleTime: STALE_30S
  });
}
function useEnrichAlert() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      alertId,
      customer
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const result = await actor.enrichAlertPublic(alertId, customer);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["normalizedAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["alert"] });
    }
  });
}
function useGetEnrichmentKeys() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["enrichmentKeys"],
    queryFn: async () => {
      if (!actor) return { abuseIpdbKeySet: false, virusTotalKeySet: false };
      return actor.getEnrichmentKeys();
    },
    enabled: !!actor && !isFetching,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false
  });
}
function useSaveEnrichmentKeys() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keys) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      const payload = {};
      if (keys.abuseIpdbKey) payload.abuseIpdbKey = keys.abuseIpdbKey;
      if (keys.virusTotalKey) payload.virusTotalKey = keys.virusTotalKey;
      return actor.saveEnrichmentKeys(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrichmentKeys"] });
    }
  });
}
function useGetWebhookSecretStatus() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["webhookSecretStatus"],
    queryFn: async () => {
      if (!actor) return { awsSet: false, azureSet: false, gcpSet: false };
      return actor.getWebhookSecretStatus();
    },
    enabled: !!actor && !isFetching,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false
  });
}
function useSaveWebhookSecret() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      provider,
      secret
    }) => {
      if (!actor || isFetching) throw new Error("Actor not ready");
      return actor.saveWebhookSecret(toBackendProvider(provider), secret);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhookSecretStatus"] });
    }
  });
}
function useListVaultSecrets(provider) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["vaultSecrets", provider],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVaultSecrets(toBackendProvider(provider));
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S
  });
}
function useSaveVaultSecret() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      provider,
      name,
      value
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveVaultSecret(
        toBackendProvider(provider),
        name,
        value
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
    }
  });
}
function useUpdateVaultSecret() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      provider,
      name,
      value
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateVaultSecret(
        toBackendProvider(provider),
        name,
        value
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
    }
  });
}
function useDeleteVaultSecret() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      provider,
      name
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteVaultSecret(
        toBackendProvider(provider),
        name
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
    }
  });
}
function useRevealVaultSecret() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      provider,
      name
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.revealVaultSecret(
        toBackendProvider(provider),
        name
      );
      if (result.__kind__ === "err") throw new Error(result.err.__kind__);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaultSecrets"] });
    }
  });
}
function useGetReports(customer) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reports", customer],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports(customer);
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false
  });
}
function useGenerateReport() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.generateReport(req);
      if (raw.__kind__ === "err") throw new Error(raw.err);
      return raw.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}
function useGetReportCsv() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      reportId,
      customer
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getReportCsv(reportId, customer);
    }
  });
}
function useDeleteReport() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      customer
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteReport(reportId, customer);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}
function useSaveReportEmailConfig() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveReportEmailConfig(config);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reportEmailConfig"] });
    }
  });
}
function useGetReportEmailConfig(customer) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reportEmailConfig", customer],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReportEmailConfig(customer);
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_30S,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false
  });
}
function useGlobalSearch(query, customer) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["globalSearch", query, customer],
    queryFn: async () => {
      if (!actor || query.length < 2) return { hasMore: false, results: [] };
      const raw = await actor.globalSearch(query, customer, BigInt(100));
      return raw;
    },
    enabled: !!actor && !isFetching && query.length >= 2,
    staleTime: 1e4
  });
}
export {
  useUpdateCorrelatedIncidentStatus as A,
  useGetReports as B,
  useDeleteReport as C,
  useGetReportCsv as D,
  useGetReportEmailConfig as E,
  useSaveReportEmailConfig as F,
  useGenerateReport as G,
  useGetMyProviders as H,
  useProviderStates as I,
  useBlockIp as J,
  useIsolateResource as K,
  useRevokeIamCredentials as L,
  useDisableAzureAdAccount as M,
  useForceGcpIamReview as N,
  useListUserAssignments as O,
  useAssignProviderAccess as P,
  useRemoveProviderAccess as Q,
  useListVaultSecrets as R,
  useRevealVaultSecret as S,
  useDeleteVaultSecret as T,
  useSaveVaultSecret as U,
  useUpdateVaultSecret as V,
  usePipelineHealth as W,
  useGlobalSearch as X,
  useSaveEnrichmentKeys as a,
  useGetWebhookSecretStatus as b,
  createLucideIcon as c,
  useSaveWebhookSecret as d,
  useRawFindings as e,
  useComplianceStatus as f,
  useExportComplianceCsv as g,
  useExportCompliancePdf as h,
  useAssets as i,
  useAssetById as j,
  useAssetFindings as k,
  useNormalizedAlerts as l,
  useUpdateAlertStatus as m,
  useUpdateAlertOwner as n,
  useEnrichAlert as o,
  useNotificationLogs as p,
  useAlertRules as q,
  useSaveAlertRule as r,
  useDeleteAlertRule as s,
  useAcknowledgeNotification as t,
  useGetEnrichmentKeys as u,
  useAuditLog as v,
  useFailedIngestions as w,
  useCorrelationStats as x,
  useCorrelatedIncidents as y,
  useAlertsForCorrelation as z
};
