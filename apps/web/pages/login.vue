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

        <Button type="submit" block :loading="loading">Entrar</Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '~/features/auth';

const { signIn } = useAuthStore();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup
        .string()
        .required('Informe seu e-mail.')
        .email('E-mail inválido.'),
      password: yup.string().required('Informe sua senha.'),
    }),
  ),
});

const errorMessage = ref('');
const loading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = '';
  loading.value = true;
  const result = await signIn(values);
  loading.value = false;

  if (!result.success) {
    errorMessage.value = result.error ?? 'Não foi possível entrar.';
    return;
  }

  await navigateTo('/');
});
</script>
