<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { useAuthStore } from '~/features/auth';

const authStore = useAuthStore();
const { signIn } = authStore;
const { signingIn } = storeToRefs(authStore);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      // { error } also covers a missing/undefined field (e.g. untouched
      // input on submit) — .min(1, ...) alone only customizes the message
      // for a present-but-empty string, not a missing one.
      email: z
        .string({ error: 'Informe seu e-mail.' })
        .min(1, 'Informe seu e-mail.')
        .email('E-mail inválido.'),
      password: z
        .string({ error: 'Informe sua senha.' })
        .min(1, 'Informe sua senha.'),
    }),
  ),
});

const errorMessage = ref('');

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = '';
  const result = await signIn(values);

  if (!result.success) {
    errorMessage.value = result.errorMsg ?? 'Não foi possível entrar.';
    return;
  }

  await navigateTo('/');
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-center text-xl font-semibold">Entrar no Lema</h1>

      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" label="E-mail" name="email">
          <Input
            v-bind="componentField"
            type="email"
            placeholder="voce@exemplo.com"
            autocomplete="email"
            class="w-full"
          />
        </FormField>

        <FormField v-slot="{ componentField }" label="Senha" name="password">
          <Input
            v-bind="componentField"
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

        <Button type="submit" block :loading="signingIn">Entrar</Button>
      </form>
    </div>
  </div>
</template>
