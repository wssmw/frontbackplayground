import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { http } from '@/api/http';
const result = ref('请选择文件上传');
const loading = ref(false);
async function uploadFile(options) {
    loading.value = true;
    const formData = new FormData();
    formData.append('file', options.file);
    try {
        const response = await http.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        result.value = JSON.stringify(response, null, 2);
        ElMessage.success('上传成功');
        options.onSuccess(response);
    }
    catch (error) {
        const uploadError = error;
        ElMessage.error(uploadError.message);
        options.onError(uploadError);
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
const __VLS_4 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    drag: true,
    httpRequest: (__VLS_ctx.uploadFile),
    showFileList: (true),
}));
const __VLS_6 = __VLS_5({
    drag: true,
    httpRequest: (__VLS_ctx.uploadFile),
    showFileList: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "el-icon--upload" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
{
    const { tip: __VLS_thisSlot } = __VLS_7.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__tip" },
    });
}
var __VLS_7;
const __VLS_16 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "mt-4" },
    type: "info",
    showIcon: true,
    closable: (false),
    title: "重点观察 multipart/form-data 请求体和后端文件元信息解析。",
}));
const __VLS_18 = __VLS_17({
    ...{ class: "mt-4" },
    type: "info",
    showIcon: true,
    closable: (false),
    title: "重点观察 multipart/form-data 请求体和后端文件元信息解析。",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_3;
const __VLS_20 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}));
const __VLS_22 = __VLS_21({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_23.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_23.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "code-panel" },
});
(__VLS_ctx.result);
var __VLS_23;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-[420px_1fr]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['code-panel']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UploadFilled: UploadFilled,
            result: result,
            loading: loading,
            uploadFile: uploadFile,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
