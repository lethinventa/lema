<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-center text-xl font-semibold">Entrar no Lema</h1>

      <Form
        :state="state"
        :validate="validate"
        class="space-y-4"
        @submit="onSubmit"
      >
        <FormField label="E-mail" name="email">
          <Input
            v-model="state.email"
            type="email"
            placeholder="voce@exemplo.com"
            autocomplete="email"
            class="w-full"
          />
        </FormField>

        <FormField label="Senha" name="password">
          <Input
            v-model="state.password"
            type="password"
            autocomplete="current-password"
            class="w-full"
          />
        </FormField>

        <Alert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          :title="errorMessage"
        />

        <Button type="submit" block :loading="loading">Entrar</Button>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';
import { useAuthStore } from '~/features/auth';

const { signIn } = useAuthStore();

const state = reactive({ email: '', password: '' });
const errorMessage = ref('');
const loading = ref(false);

async function onSubmit(
  event: FormSubmitEvent<{ email: string; password: string }>,
) {
  errorMessage.value = '';
  loading.value = true;
  const result = await signIn(event.data);
  loading.value = false;

  if (!result.success) {
    errorMessage.value = result.error ?? 'Não foi possível entrar.';
    return;
  }

  await navigateTo('/');
}

function validate(state: { email?: string; password?: string }): FormError[] {
  const errors: FormError[] = [];
  if (!state.email)
    errors.push({ name: 'email', message: 'Informe seu e-mail.' });
  if (!state.password)
    errors.push({ name: 'password', message: 'Informe sua senha.' });
  return errors;
}
</script>
