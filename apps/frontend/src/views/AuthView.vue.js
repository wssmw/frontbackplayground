import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { getProfile, login } from '@/api/http';
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const form = reactive({ username: 'admin', password: '123456' });
const result = ref('用户名：admin，密码：123456');
const loading = ref(false);
async function handleLogin() {
    loading.value = true;
    try {
        const response = await login(form);
        auth.setToken(response.data.accessToken);
        auth.username = response.data.user.username;
        result.value = JSON.stringify(response, null, 2);
        ElMessage.success('登录成功，Token 已写入 localStorage');
    }
    catch (error) {
        ElMessage.error(error.message);
    }
    finally {
        loading.value = false;
    }
}
async function fetchProfile() {
    loading.value = true;
    try {
        const response = await getProfile();
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
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    labelPosition: "top",
    model: (__VLS_ctx.form),
}));
const __VLS_6 = __VLS_5({
    labelPosition: "top",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "用户名",
}));
const __VLS_10 = __VLS_9({
    label: "用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.form.username),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.form.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "密码",
}));
const __VLS_18 = __VLS_17({
    label: "密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "w-full" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "w-full" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.handleLogin)
};
__VLS_27.slots.default;
var __VLS_27;
const __VLS_32 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    ...{ class: "mt-3 w-full" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    ...{ class: "mt-3 w-full" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (__VLS_ctx.fetchProfile)
};
__VLS_35.slots.default;
var __VLS_35;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    ...{ class: "mt-3 w-full" },
    type: "danger",
    plain: true,
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    ...{ class: "mt-3 w-full" },
    type: "danger",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (__VLS_ctx.auth.logout)
};
__VLS_43.slots.default;
var __VLS_43;
var __VLS_7;
var __VLS_3;
const __VLS_48 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}));
const __VLS_50 = __VLS_49({
    shadow: "never",
    ...{ class: "rounded-3xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_51.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-bold" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "code-panel" },
});
(__VLS_ctx.result);
var __VLS_51;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-[420px_1fr]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['code-panel']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            auth: auth,
            form: form,
            result: result,
            loading: loading,
            handleLogin: handleLogin,
            fetchProfile: fetchProfile,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
