
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const Login: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const { signInWithGoogle } = useAuth();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMsg('Verifique seu email para confirmar o cadastro!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-slate-100">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">PostaAI</h1>
                    <p className="text-slate-500 font-medium">Seu assistente criativo na nuvem</p>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium text-slate-900"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium text-slate-900"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {msg && (
                        <div className="p-4 rounded-xl bg-green-50 text-green-600 text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            {msg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Processando...
                            </span>
                        ) : (
                            isSignUp ? 'Criar Conta Grátis' : 'Entrar na Conta'
                        )}
                    </button>
                </form>

                {/* Google Login (Optional for now as it requires specific setup) */}
                {/* 
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">ou continue com</span>
          </div>
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Google
        </button> 
        */}

                {/* Toggle */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                            setMsg('');
                        }}
                        className="text-slate-500 font-medium hover:text-primary transition-colors text-sm"
                    >
                        {isSignUp ? (
                            <>Já tem uma conta? <span className="font-bold text-primary">Fazer Login</span></>
                        ) : (
                            <>Não tem uma conta? <span className="font-bold text-primary">Criar Grátis</span></>
                        )}
                    </button>
                </div>
            </div>

            {/* Footer info */}
            <div className="fixed bottom-6 text-center w-full text-slate-400 text-xs font-medium">
                © 2024 PostaAI • Seus dados salvos na nuvem ☁️
            </div>
        </div>
    );
};

export default Login;
