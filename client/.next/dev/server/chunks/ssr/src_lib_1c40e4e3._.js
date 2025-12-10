module.exports = [
"[project]/src/lib/store.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/src/lib/store.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/src/lib/cartApi.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_lib_cartApi_ts_2be3a11b._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/cartApi.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/src/lib/orderApi.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_lib_orderApi_ts_096f187e._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/orderApi.ts [app-ssr] (ecmascript)");
    });
});
}),
];