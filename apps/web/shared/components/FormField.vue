<template>
  <UFormField :name="name" :error="error">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </UFormField>
</template>

<script setup lang="ts">
import { useFieldError } from 'vee-validate';

// Auto-detects this field's error from the ambient VeeValidate form (see
// CLAUDE.md — Composition API is the priority there) via provide/inject, no
// need for the caller to pass :error explicitly. UFormField then forwards
// the error state to its slotted input (color, aria-invalid, etc.) through
// Nuxt UI's own useFormField()/formFieldInjectionKey mechanism.
const props = defineProps<{ name: string }>();

const error = useFieldError(() => props.name);
</script>
