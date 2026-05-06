import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { getBasicEcho, getHealth, postBasicEcho } from '@/api/http';
const result = ref('等待请求');
const loading = ref(false);
async function runRequest(type) {
    loading.value = true;
    try {
        const response = type === 'health'
            ? await getHealth()
            : type === 'get'
                ? await getBasicEcho({ keyword: 'front-back', page: '1' })
                : await postBasicEcho({ title: '前后端交互', tags: ['Vue', 'NestJS'] });
        result.value = JSON.stringify(response, null, 2);
    }
    catch (error) {
        ElMessage.error(error.message);
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-6 lg:grid-cols-[420px_1fr]" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "leading-7 text-slate-600" },
});
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    ...{ class: "w-full" },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    ...{ class: "w-full" },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (...[$event]) => {
        __VLS_ctx.runRequest('health');
    }
};
__VLS_7.slots.default;
var __VLS_7;
const __VLS_12 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    ...{ class: "w-full" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    ...{ class: "w-full" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (...[$event]) => {
        __VLS_ctx.runRequest('get');
    }
};
__VLS_15.slots.default;
var __VLS_15;
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    ...{ class: "w-full" },
    type: "success",
    loading: (__VLS_ctx.loading),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    ...{ class: "w-full" },
    type: "success",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (...[$event]) => {
        __VLS_ctx.runRequest('post');
    }
};
__VLS_23.slots.default;
var __VLS_23;
var __VLS_3;
const __VLS_28 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}));
const __VLS_30 = __VLS_29({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_31.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "code-panel" },
});
(__VLS_ctx.result);
var __VLS_31;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-[420px_1fr]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-7']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['code-panel']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            result: result,
            loading: loading,
            runRequest: runRequest,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
