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
    await throwIfError(response);
    return await response.json();
}

export const sleep = async (millis: number) => await new Promise(resolve => setTimeout(() => resolve({}), millis));

