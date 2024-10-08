import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import firebaseOperations from '../../firebase/firebaseOperations';
import { toast } from '@/components/ui/use-toast';

const schema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(['Vendedor', 'Fornecedor']).optional(),
});

const AuthForm = ({ isLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Vendedor',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        navigate('/dashboard');
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          await firebaseOperations.createUser({
            uid: userCredential.user.uid,
            email: data.email,
            role: data.role,
          });
          navigate('/dashboard');
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            setError('Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.');
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/invalid-login-credentials') {
        setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Verifique seu e-mail ou registre-se.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta. Por favor, tente novamente.');
      } else {
        setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      }
      toast({
        title: "Erro de Autenticação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Entrar no' : 'Registrar-se no'} MyShopTools</h2>
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
                    <Input type="email" {...field} />
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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            {!isLogin && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Conta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de conta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vendedor">Vendedor</SelectItem>
                        <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full">
              {isLogin ? 'Entrar' : 'Registrar'}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{' '}
          <a
            href={isLogin ? "/register" : "/login"}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Registre-se aqui' : 'Entre aqui'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
