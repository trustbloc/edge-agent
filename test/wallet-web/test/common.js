/*
Copyright SecureKey Technologies Inc. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

import * as Agent from "@trustbloc/agent-sdk-web"
import {createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";
import {addJSONLDContexts} from "./jsonld_contexts";

const createInvitationPath = `/connections/create-invitation`

export class wcredHandler {
    constructor(wcredHandler) {
        this.wcredHandler = wcredHandler
        this.eventQueue = []
    }

    addEventToQueue(event) {
        let respond
        event.respondWith = async promise => {
            respond(promise)
        };

        this.eventQueue.push(event)

        // handle for event response
        return new Promise((resolve, reject) => {
            const timer = setTimeout(_ => reject(new Error("timeout waiting for credential event response")), 40000)
            respond = async (result) => {
                clearTimeout(timer)
                resolve(await result)
            }
        })
    }

    async receiveCredentialEvent() {
        let event = this.eventQueue.pop()

        return new Promise((resolve, reject) => {
            if (!event) {
                reject(event)
            }

            resolve(event)
        })
    }

}


// TODO endpoints should be read from configurations
const agentStartupOpts = {
    assetsPath: "/base/public/agent-js-worker/assets",
    'outbound-transport': ['ws', 'http'],
    'transport-return-route': 'all',
    "http-resolver-url": ["trustbloc@http://localhost:9080/1.0/identifiers", "v1@http://localhost:9080/1.0/identifiers"],
    'agent-default-label': 'demo-wallet-web',
    'auto-accept': true,
    'log-level': 'debug',
    'indexedDB-namespace': 'agent',

    blocDomain: 'testnet.orb.local',
    walletMediatorURL: 'https://localhost:10093',
    storageType: `indexedDB`, 	// TODO (#475): Allow the storage type to be configurable.
    edvServerURL: '',
    didAnchorOrigin: 'origin',
    sidetreeToken: ''
}

export async function loadFrameworks({name = '', loadAgent = true, loadStartupOpts = false, blinded = false}) {
    let agentOpts = agentStartupOpts
    let opts = {}

    if (name) {
        agentOpts = JSON.parse(JSON.stringify(agentStartupOpts))
        agentOpts["indexedDB-namespace"] = `${name}db`
        agentOpts["agent-default-label"] = `${name}-wallet-web`
    }

    if (loadAgent) {
        opts.agent = await new Agent.Framework(agentOpts)
        await addJSONLDContexts(opts.agent)
    }

    if (loadStartupOpts) {
        opts.agentStartupOpts = agentStartupOpts
    }

    if (blinded) {
        opts.agentStartupOpts.blindedRouting = true
    }

    return opts
}

export function promiseWhen(fn, timeout, interval) {
    function loop(resolve) {
        if (fn()) {
            resolve();
        }
        setTimeout(() => loop(resolve), interval ? interval : 300);
    }

    return new Promise(function (resolve, reject) {
        setTimeout(_ => reject(new Error("timeout waiting for condition")), timeout ? timeout : 10000)
        loop(resolve)
    });
}

export const localVue = createLocalVue()
localVue.use(Vuex)

export function mockStore(aries) {
    return new Vuex.Store({
        getters: {
            getCurrentUser(state) {
                return {username: 'sampleWalletUser'}
            },
            getAgentOpts(state) {
                return agentStartupOpts
            }
        },
        modules: {
            agent: {
                namespaced: true,
                actions: {
                    async init({commit, rootState, state}) {
                    },
                    async destroy({commit, state}) {
                    },
                },
                getters: {
                    getInstance(state) {
                        return aries
                    }
                }
            }
        }
    })
}
