const LUNA_URL_SITE = import.meta.env.LUNA_URL_SITE;

export async function runFetchMedia (mediaID) {
    let headers = new Headers();
    headers.append(
        "Authorization",
        "Basic bHVuYXBob3JlZGV2Omx1bmEyMDIx"
    );
    let imageObj = null;
    if (mediaID !== '') {
        imageObj = await fetch(
            `${LUNA_URL_SITE}/wp-json/wp/v2/media/${mediaID}`,
            {
                headers: headers,
                method: "GET",
            }
        ).then((response) => response.json());
    }
    return imageObj;
}

export async function runFetchPages (pageID) {
    let headers = new Headers();
    headers.append(
        "Authorization",
        "Basic bHVuYXBob3JlZGV2Omx1bmEyMDIx"
    );
    let header = await fetch(
        `${LUNA_URL_SITE}/wp-json/wp/v2/pages?slug=${pageID}`,
        {
            headers: headers,
            method: "GET",
        }
    ).then((response) => response.json());

    return header;
}