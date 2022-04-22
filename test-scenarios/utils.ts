export const HOUR_IN_MILLIS = 60*60*1000;

export const truncateToHour = (date:number) => {
    const d = new Date(date)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    return d;
}

export const throwIfError = async (response: any) => {
    if (!response.ok) {
        const body = await response.json();
        console.log('response: ', response.statusText + ": " + JSON.stringify(body))
        throw new Error('Http failure: ' + response.status + ' ' + response.statusText)
    }
    return null;
};


export const doFetch = async (url: string, init: {} = {}) => {
    const response = await fetch(url, {...init})
    await throwIfError(response)
    // return await response.json()
    const body = await response.text()
    const obj = JSON.parse(body)
    const json = JSON.stringify(obj, null, "  ");
    return obj;
}

export const sleep = async (millis: number) => await new Promise(resolve => setTimeout(() => resolve({}), millis));

export const applyOptionalConfigFile = async (fileName: string, handler: (obj: any) => void) => {
    console.log('Checking for local config file: ', fileName)
    try {
        const optionalConfigModule = await import(fileName)
        if(handler) {
            handler(optionalConfigModule.default)
            console.log('Applied local config file ', fileName)
        }
        return optionalConfigModule.default 
    } catch (e) {
        const isNotFound = /not ?found/.exec(e.message)
        if (!isNotFound)
            console.warn(e)
        console.log(`unable to load local config file '${fileName}': `, e.name, e.message)
    }
}

