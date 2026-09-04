<template>
  <UFormField :name="name" :error="errorMessage">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="{ ...slotProps, componentField }" />
    </template>
  </UFormField>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';

// Auto-detects this field's value/error from the ambient VeeValidate form
// (see CLAUDE.md — Composition API is the priority there) via provide/inject,
// no need for the caller to call defineField/useForm itself. UFormField
// forwards the error state to its slotted input (color, aria-invalid, etc.)
// through Nuxt UI's own useFormField()/formFieldInjectionKey mechanism, and
// componentField is exposed for the caller to v-bind onto the input directly.
const props = defineProps<{ name: string }>();

const { value, errorMessage, handleBlur } = useField<unknown>(() => props.name);

const componentField = computed(() => ({
  modelValue: value.value,
  'onUpdate:modelValue': (newValue: unknown) => {
    value.value = newValue;
  },
  // handleBlur only validates when told to (2nd arg), unlike defineField's
  // generated onBlur handler, which validates by default (validateOnBlur
  // defaults to true) — replicate that default here.
  onBlur: () => handleBlur(undefined, true),
  name: props.name,
}));
</script>
