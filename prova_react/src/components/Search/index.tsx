import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search: React.FC = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (username.trim() === '') {
            setError('Por favor, insira um nome de usuário do GitHub.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
                throw new Error(`Usuário não encontrado: ${username}`);
            }
            const userData = await response.json();
            setLoading(false);
            navigate(`/user-details/${username}`, { state: { userData } });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro ao buscar o usuário.');
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h2>Encontre um usuário do GitHub</h2>
            <input
                type="text"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className={loading ? 'loading-button' : ''} onClick={handleSearch} disabled={loading}>
                Pesquisar
            </button>
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="loading-message">Carregando...</p>}
        </div>
    );
};

export default Search;
