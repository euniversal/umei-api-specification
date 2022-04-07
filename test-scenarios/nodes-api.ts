import {doFetch} from "./utils.ts";
import {options} from "./umei-api.ts";

export const fetchCurrentUserInfo = async () => await doFetch(options.baseUrl + "me", options.init)
