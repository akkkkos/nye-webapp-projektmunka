import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { useWebshopApi } from '../state/useWebshopApi';

const ChangePassword: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const { authToken, logout } = useAuthContext();
    const { patchPassword } = useWebshopApi();

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
            .matches(
                /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                'A jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel')
            .required('Kötelező mező'),
        password: Yup.string()
            .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
            .matches(
                /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                'Az új jelszónak legalább 8 karakter hosszúnak kell lennie legalább 1 számmal és 1 kisbetűvel')
            .notOneOf([Yup.ref('oldPassword')], 'Az új jelszó nem egyezhet meg a régi jelszóval')
            .required('Kötelező mező'),
        passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password')], 'A két jelszó nem egyezik meg')
            .required('Kötelező mező'),
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setError(null);
            setSuccess(null);

            if (!authToken) {
                navigate('/login');
                return;
            }

            try {
                await patchPassword(authToken, values.oldPassword, values.password, values.passwordConfirm);
                setSuccess('Jelszó sikeresen megváltoztatva!');
                navigate('/profile');
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message === 'Hiányzó vagy érvénytelen token.') {
                        logout();
                    } else {
                        setError(err.message);
                    }
                } else {
                    setError('Ismeretlen hiba történt.');
                }
            }
        },
    });

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center' }}>Jelszó Módosítása</h2>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Régi Jelszó"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: 'black', backgroundColor: '#e0e0e0' }}
                    />
                    {formik.touched.oldPassword && formik.errors.oldPassword && (
                        <div style={{ color: 'red' }}>{formik.errors.oldPassword}</div>
                    )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Új Jelszó"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: 'black', backgroundColor: '#e0e0e0' }}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: 'red' }}>{formik.errors.password}</div>
                    )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="Új Jelszó Megerősítése"
                        value={formik.values.passwordConfirm}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: 'black', backgroundColor: '#e0e0e0' }}
                    />
                    {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                        <div style={{ color: 'red' }}>{formik.errors.passwordConfirm}</div>
                    )}
                </div>
                {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
                <ButtonGroup>
                    <Button type="submit" colorScheme="green" width="100%" isDisabled={!formik.isValid || formik.isSubmitting}>
                        Mentés
                    </Button>
                </ButtonGroup>
            </form>
        </div>
    );
};

export default ChangePassword;
