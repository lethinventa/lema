<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-center text-xl font-semibold">Entrar no Lema</h1>

      <form class="space-y-4" @submit="onSubmit">
        <FormField label="E-mail" name="email" :error="errors.email">
          <Input
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            placeholder="voce@exemplo.com"
            autocomplete="email"
            class="w-full"
          />
        </FormField>

        <FormField label="Senha" name="password" :error="errors.password">
          <Input
            v-model="password"
            v-bind="passwordAttrs"
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

const { handleSubmit, defineField, errors } = useForm({
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

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

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
