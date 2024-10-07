import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/components/ui/use-toast';
import { checkUserStatus } from '../../firebase/userOperations';
import { useAuth } from './AuthProvider';
import { Spinner } from '../ui/spinner';

const schema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  rememberMe: z.boolean().optional(),
});

const MASTER_USER_EMAIL = 'pavaosmart@gmail.com';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    console.log('Iniciando processo de login...');
    try {
      console.log('Tentando autenticar com email:', data.email);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('Autenticação bem-sucedida para:', userCredential.user.email);

      if (data.email === MASTER_USER_EMAIL) {
        console.log('Usuário Master identificado, prosseguindo com o login...');
        await login(data.rememberMe);
        navigate('/dashboard');
      } else {
        console.log('Verificando status do usuário...');
        const isActive = await checkUserStatus(userCredential.user.uid);
        console.log('Status do usuário:', isActive ? 'Ativo' : 'Inativo');
        if (!isActive) {
          console.log('Conta inativa, fazendo logout...');
          await auth.signOut();
          toast({
            title: "Conta Inativa",
            description: "Sua conta foi desativada. Entre em contato com o administrador para reativar sua conta.",
            variant: "destructive",
          });
        } else {
          console.log('Conta ativa, prosseguindo com o login...');
          await login(data.rememberMe);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      if (error.code === 'auth/invalid-login-credentials') {
        setError("Credenciais inválidas. Por favor, verifique seu e-mail e senha.");
      } else if (error.code === 'auth/user-not-found') {
        setError("Usuário não encontrado. Verifique seu e-mail ou registre-se.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Senha incorreta. Por favor, tente novamente.");
      } else {
        setError(`Erro ao fazer login: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      console.log('Processo de login finalizado.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Entrar no MyShopTools</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Permanecer conectado
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center">
          Não tem uma conta?{' '}
          <a
            href="/register"
            className="text-blue-500 hover:underline"
          >
            Registre-se aqui
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;