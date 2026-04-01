import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpeechButton from '../SpeechButton';
import { useAuth } from '../../context/AuthContext';
import './style.css';

function CadastroPage() {
    const [cadastroTipo, setCadastroTipo] = useState('faccao');
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Estados para dados da facção
    const [formDataFaccao, setFormDataFaccao] = useState({
        name: '',
        sobrenome: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        category: '',
        type: 'PESSOA_FISICA',
        city: '',
        street: '',
        profileImage: null,
        twoFactorEnabled: false,
        termsAccepted: false
    });

    // Estados para dados da empresa
    const [formDataEmpresa, setFormDataEmpresa] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        category: '',
        type: 'PESSOA_JURIDICA',
        city: '',
        street: '',
        profileImage: null,
        twoFactorEnabled: false,
        termsAccepted: false
    });

    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (cadastroTipo === 'faccao') {
            setFormDataFaccao(prev => ({ 
                ...prev, 
                [name]: type === 'checkbox' ? checked : value 
            }));
            
            // Limpar erro do campo específico
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }));
            }
        } else {
            setFormDataEmpresa(prev => ({ 
                ...prev, 
                [name]: type === 'checkbox' ? checked : value 
            }));
            
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const validateStep1 = () => {
    const errors = {};
    const data = cadastroTipo === 'faccao' ? formDataFaccao : formDataEmpresa;

    if (!data.name.trim()) {
        errors.name = 'Nome é obrigatório';
    }
    
    if (cadastroTipo === 'faccao' && !data.sobrenome.trim()) {
        errors.sobrenome = 'Sobrenome é obrigatório';
    }

    if (!data.email.trim()) {
        errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Email inválido';
    }

    if (!data.phone.trim()) {
        errors.phone = 'Telefone é obrigatório';
    } else {
        // Remove tudo que não é número para validar
        const numbersOnly = data.phone.replace(/\D/g, '');
        
        // Valida se tem 10 ou 11 dígitos (com DDD)
        if (numbersOnly.length < 10 || numbersOnly.length > 11) {
            errors.phone = 'Telefone inválido. Use (99) 99999-9999 ou (99) 9999-9999';
        }
    }

    if (!data.password) {
        errors.password = 'Senha é obrigatória';
    } else if (data.password.length < 8) {
        errors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (!data.confirmPassword) {
        errors.confirmPassword = 'Confirme sua senha';
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas não conferem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};

    const validateStep2 = () => {
        const errors = {};
        const data = cadastroTipo === 'faccao' ? formDataFaccao : formDataEmpresa;

        if (!data.category) {
            errors.category = 'Categoria é obrigatória';
        }

        if (!data.city.trim()) {
            errors.city = 'Cidade é obrigatória';
        }

        if (!data.street.trim()) {
            errors.street = 'Rua é obrigatória';
        }

        if (!data.termsAccepted) {
            errors.terms = 'Você precisa aceitar os termos de uso';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validar tamanho (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setFormErrors(prev => ({ ...prev, profileImage: 'A imagem deve ter no máximo 2MB' }));
            return;
        }
        
        // Validar tipo
        if (!file.type.match('image.*')) {
            setFormErrors(prev => ({ ...prev, profileImage: 'Por favor, selecione uma imagem válida' }));
            return;
        }
        
        if (cadastroTipo === 'faccao') {
            setFormDataFaccao(prev => ({ ...prev, profileImage: file }));
        } else {
            setFormDataEmpresa(prev => ({ ...prev, profileImage: file }));
        }
        
        // Criar preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        setFormErrors(prev => ({ ...prev, profileImage: '' }));
    };

    const removeImage = () => {
        if (cadastroTipo === 'faccao') {
            setFormDataFaccao(prev => ({ ...prev, profileImage: null }));
        } else {
            setFormDataEmpresa(prev => ({ ...prev, profileImage: null }));
        }
        setProfileImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const formatPhone = (phone) => {
        // Remove tudo que não é número
        const numbers = phone.replace(/\D/g, '');
        
        // Formata como (99) 99999-9999
        if (numbers.length === 11) {
            return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
        } else if (numbers.length === 10) {
            return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
        }
        return phone;
    };

    const handlePhoneChange = (e) => {
    const { value } = e.target;
    
    // Remove caracteres não numéricos
    const rawValue = value.replace(/\D/g, '');
    
    // Aplica a máscara dinamicamente
    let formattedValue = '';
    if (rawValue.length > 0) {
        formattedValue = '(' + rawValue.substring(0, 2);
        if (rawValue.length > 2) {
            formattedValue += ') ' + rawValue.substring(2, 7);
            if (rawValue.length > 7) {
                // Para celular (9 dígitos)
                formattedValue += '-' + rawValue.substring(7, 11);
            } else if (rawValue.length > 6) {
                // Para telefone fixo (8 dígitos)
                formattedValue += '-' + rawValue.substring(6, 10);
            }
        }
    }
    
    // Atualiza o estado com apenas números
    if (cadastroTipo === 'faccao') {
        setFormDataFaccao(prev => ({ 
            ...prev, 
            phone: rawValue
        }));
    } else {
        setFormDataEmpresa(prev => ({ 
            ...prev, 
            phone: rawValue
        }));
    }
    
    // Atualiza o valor do input com a máscara
    e.target.value = formattedValue;
    
    // Limpa erro do telefone se houver
    if (formErrors.phone) {
        setFormErrors(prev => ({ ...prev, phone: '' }));
    }
};

    const handleNextStep = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(1);
    };

    const handleStepClick = (step) => {
        if (step === 1) {
            setCurrentStep(1);
        } else if (step === 2) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (currentStep === 1) {
            handleNextStep();
            return;
        }

        if (!validateStep2()) {
            return;
        }

        let userData;
        const data = cadastroTipo === 'faccao' ? formDataFaccao : formDataEmpresa;

        console.log('📝 Dados antes do envio:', data);

        // Preparar dados básicos
        userData = {
            name: cadastroTipo === 'faccao' ? `${formDataFaccao.name} ${formDataFaccao.sobrenome}`.trim() : formDataEmpresa.name.trim(),
            email: data.email.trim(),
            password: data.password,
            phone: data.phone || '', // Garante que seja string vazia se não tiver
            category: data.category,
            type: data.type,
            city: data.city.trim(),
            street: data.street.trim(),
            twoFactorEnabled: data.twoFactorEnabled || false,
            verified: false,
            role: cadastroTipo === 'faccao' ? 'USER' : 'EMPRESA'
        };

        console.log('📤 Dados para envio:', userData);

        // Converter e adicionar imagem se existir
        if (data.profileImage) {
            try {
                userData.profileImage = await convertImageToBase64(data.profileImage);
            } catch (err) {
                console.error('Erro ao converter imagem:', err);
            }
        }

        const result = await register(userData);
        
        console.log('📨 Resultado do cadastro:', result);
        
        if (result.success) {
            if (cadastroTipo === 'faccao') {
                navigate('/', { state: { userId: result.user?.id } });
                alert('Cadastro de Fação concluído com sucesso!');
            } else {
                navigate('/');
                alert('Cadastro de Empresa concluído com sucesso!');
            }
        } else {
            // Exibir erro se houver
            console.error('Erro no cadastro:', result.message);
        }
    };

    const resetForm = () => {
        if (cadastroTipo === 'faccao') {
            setFormDataFaccao({
                name: '',
                sobrenome: '',
                phone: '',
                email: '',
                password: '',
                confirmPassword: '',
                category: '',
                type: 'PESSOA_FISICA',
                city: '',
                street: '',
                profileImage: null,
                twoFactorEnabled: false,
                termsAccepted: false
            });
        } else {
            setFormDataEmpresa({
                name: '',
                phone: '',
                email: '',
                password: '',
                confirmPassword: '',
                category: '',
                type: 'PESSOA_JURIDICA',
                city: '',
                street: '',
                profileImage: null,
                twoFactorEnabled: false,
                termsAccepted: false
            });
        }
        setProfileImagePreview(null);
        setCurrentStep(1);
        setFormErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const currentData = cadastroTipo === 'faccao' ? formDataFaccao : formDataEmpresa;

    const categories = [
        { value: '', label: 'Selecione uma categoria' },
        { value: 'COSTUREIRA', label: 'Costureira' },
        { value: 'BORDADEIRA', label: 'Bordadeira' },
        { value: 'CORTE', label: 'Corte' },
        { value: 'ACABAMENTO', label: 'Acabamento' },
        { value: 'ESTAMPARIA', label: 'Estamparia' },
        { value: 'LAVANDERIA', label: 'Lavanderia' }
    ];

    const empresaCategories = [
        { value: '', label: 'Selecione uma categoria' },
        { value: 'CONFECCAO', label: 'Confecção' },
        { value: 'MODA_FEMININA', label: 'Moda Feminina' },
        { value: 'MODA_MASCULINA', label: 'Moda Masculina' },
        { value: 'MODA_INFANTIL', label: 'Moda Infantil' },
        { value: 'JEANS', label: 'Jeans' },
        { value: 'ESPORTIVA', label: 'Esportiva' }
    ];

    return (
        <div className="cadastro-container">
            <form onSubmit={handleSubmit} className="cadastro-card">
                <div className="form-header">
                    <h2>Crie sua Conta</h2>
                    <SpeechButton textToSpeak="Crie sua Conta" />
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <div className="cadastro-tabs">
                    <button
                        type="button"
                        className={`tab-button ${cadastroTipo === 'faccao' ? 'active' : ''}`}
                        onClick={() => {
                            setCadastroTipo('faccao');
                        }}
                    >
                        Facções
                    </button>
                    <button
                        type="button"
                        className={`tab-button ${cadastroTipo === 'empresa' ? 'active' : ''}`}
                        onClick={() => {
                            setCadastroTipo('empresa');
                        }}
                    >
                        Empresas
                    </button>
                </div>

                <div className="form-progress">
                    <div 
                        className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep === 1 ? 'current' : ''}`}
                        onClick={() => handleStepClick(1)}
                    >
                        <span>1</span>
                        <p>Informações Básicas</p>
                    </div>
                    <div 
                        className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep === 2 ? 'current' : ''}`}
                        onClick={() => handleStepClick(2)}
                    >
                        <span>2</span>
                        <p>Informações Adicionais</p>
                    </div>
                </div>

                {currentStep === 1 ? (
                    <>
                        {cadastroTipo === 'faccao' ? (
                            <>
                                <div className="form-group">
                                    <div className="form-label-container">
                                        <label htmlFor="name">Nome</label>
                                        <SpeechButton textToSpeak="Nome" />
                                    </div>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formDataFaccao.name} 
                                        onChange={handleChange} 
                                        required 
                                        className={formErrors.name ? 'error-input' : ''}
                                    />
                                    {formErrors.name && (
                                        <span className="error-text">{formErrors.name}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <div className="form-label-container">
                                        <label htmlFor="sobrenome">Sobrenome</label>
                                        <SpeechButton textToSpeak="Sobrenome" />
                                    </div>
                                    <input 
                                        type="text" 
                                        id="sobrenome" 
                                        name="sobrenome" 
                                        value={formDataFaccao.sobrenome} 
                                        onChange={handleChange} 
                                        required 
                                        className={formErrors.sobrenome ? 'error-input' : ''}
                                    />
                                    {formErrors.sobrenome && (
                                        <span className="error-text">{formErrors.sobrenome}</span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="form-group">
                                <div className="form-label-container">
                                    <label htmlFor="name">Nome da Empresa</label>
                                    <SpeechButton textToSpeak="Nome da Empresa" />
                                </div>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formDataEmpresa.name} 
                                    onChange={handleChange} 
                                    required 
                                    className={formErrors.name ? 'error-input' : ''}
                                />
                                {formErrors.name && (
                                    <span className="error-text">{formErrors.name}</span>
                                )}
                            </div>
                        )}

                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="phone">Telefone *</label>
                                <SpeechButton textToSpeak="Telefone" />
                            </div>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                onChange={handlePhoneChange}
                                required 
                                placeholder="(99) 99999-9999"
                                className={formErrors.phone ? 'error-input' : ''}
                            />
                            {formErrors.phone && (
                                <span className="error-text">{formErrors.phone}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="email">Email</label>
                                <SpeechButton textToSpeak="Email" />
                            </div>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={currentData.email} 
                                onChange={handleChange} 
                                required 
                                className={formErrors.email ? 'error-input' : ''}
                            />
                            {formErrors.email && (
                                <span className="error-text">{formErrors.email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="password">Senha</label>
                                <SpeechButton textToSpeak="Senha" />
                            </div>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={currentData.password} 
                                onChange={handleChange} 
                                required 
                                minLength="8"
                                className={formErrors.password ? 'error-input' : ''}
                            />
                            {formErrors.password && (
                                <span className="error-text">{formErrors.password}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                                <SpeechButton textToSpeak="Confirmar Senha" />
                            </div>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                value={currentData.confirmPassword} 
                                onChange={handleChange} 
                                required 
                                className={formErrors.confirmPassword ? 'error-input' : ''}
                            />
                            {formErrors.confirmPassword && (
                                <span className="error-text">{formErrors.confirmPassword}</span>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="category">Categoria Principal *</label>
                                <SpeechButton textToSpeak="Categoria Principal" />
                            </div>
                            <select
                                id="category"
                                name="category"
                                value={currentData.category}
                                onChange={handleChange}
                                required
                                className={formErrors.category ? 'error-input' : ''}
                            >
                                {cadastroTipo === 'faccao' ? (
                                    categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))
                                ) : (
                                    empresaCategories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))
                                )}
                            </select>
                            {formErrors.category && (
                                <span className="error-text">{formErrors.category}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="city">Cidade *</label>
                                <SpeechButton textToSpeak="Cidade" />
                            </div>
                            <input 
                                type="text" 
                                id="city" 
                                name="city" 
                                value={currentData.city} 
                                onChange={handleChange} 
                                required 
                                className={formErrors.city ? 'error-input' : ''}
                            />
                            {formErrors.city && (
                                <span className="error-text">{formErrors.city}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="form-label-container">
                                <label htmlFor="street">Rua *</label>
                                <SpeechButton textToSpeak="Rua" />
                            </div>
                            <input 
                                type="text" 
                                id="street" 
                                name="street" 
                                value={currentData.street} 
                                onChange={handleChange} 
                                required 
                                className={formErrors.street ? 'error-input' : ''}
                            />
                            {formErrors.street && (
                                <span className="error-text">{formErrors.street}</span>
                            )}
                        </div>

                        <div className="form-section">
                            <h3>Foto de Perfil</h3>
                            
                            <div className="profile-image-upload">
                                {profileImagePreview ? (
                                    <div className="image-preview">
                                        <img src={profileImagePreview} alt="Preview" />
                                        <button 
                                            type="button" 
                                            onClick={removeImage} 
                                            className="remove-image-btn"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-area">
                                        <input
                                            type="file"
                                            id="profileImage"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="file-input"
                                        />
                                        <label htmlFor="profileImage" className="upload-label">
                                            <span className="upload-icon">📷</span>
                                            <span>Clique para adicionar uma foto</span>
                                            <small>Formatos: JPG, PNG (Max: 2MB)</small>
                                        </label>
                                    </div>
                                )}
                                {formErrors.profileImage && (
                                    <span className="error-text">{formErrors.profileImage}</span>
                                )}
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="twoFactorEnabled"
                                    checked={currentData.twoFactorEnabled}
                                    onChange={handleChange}
                                />
                                <span>Ativar autenticação de dois fatores</span>
                            </label>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={currentData.termsAccepted}
                                    onChange={handleChange}
                                    required
                                />
                                <span>
                                    Aceito os <a href="/terms" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e 
                                    <a href="/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> *
                                </span>
                            </label>
                            {formErrors.terms && (
                                <span className="error-text">{formErrors.terms}</span>
                            )}
                        </div>
                    </>
                )}

                <div className="form-navigation">
                    {currentStep === 2 && (
                        <button 
                            type="button" 
                            className="btn-voltar"
                            onClick={handlePreviousStep}
                            disabled={loading}
                        >
                            Voltar
                        </button>
                    )}
                    
                    <button 
                        type="submit" 
                        className="btn-avancar"
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 
                         currentStep === 1 ? 'Avançar' : 
                         cadastroTipo === 'faccao' ? 'Finalizar Cadastro' : 'Cadastrar Empresa'}
                    </button>
                </div>

                <p className="login-redirect">
                    Já possui uma conta? <Link to="/login">Faça login</Link>
                </p>
            </form>
        </div>
    );
}

export default CadastroPage;