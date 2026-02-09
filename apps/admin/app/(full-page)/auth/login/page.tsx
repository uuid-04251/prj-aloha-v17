'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { useContext, useState } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { AuthService } from '../../../../services/AuthService';
import { trpc } from '../../../../utils/trpc';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    // tRPC login mutation
    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: (data: any) => {
            console.log('Login successful:', data);
            // Store tokens and user data using AuthService
            if (data.accessToken) {
                AuthService.setTokens(data.accessToken, data.refreshToken);
                AuthService.setUser(data.user);
            }
            setError('');
            router.push('/');
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
            setError(error.message || 'Login failed. Please check your credentials.');
        }
    });

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setError('');
        loginMutation.mutate({ email, password });
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Aloha logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                            {/* <div className="text-900 text-3xl font-medium mb-3">Welcome</div> */}
                            <div className="text-900 text-3xl font-medium mb-3">IRUKA</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="text-red-700 text-sm">{error}</span>
                                </div>
                            )}

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleLogin} loading={loginMutation.isLoading}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
