import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './UserDetails.css';

interface Repository {
    name: string;
    description: string;
    visibility: string;
    html_url: string;
    language: string;
}

interface UserData {
    name: string;
    bio: string;
    repos?: Repository[];
    avatar_url: string;
}

const UserDetails: React.FC = () => {
    const location = useLocation();
    const { username } = useParams<{ username: string }>();
    const initialUserData = location.state?.userData as UserData;

    const [userData, setUserData] = useState<UserData | null>(initialUserData);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [loading, setLoading] = useState(false); // Estado de carregamento

    useEffect(() => {
        const fetchUserRepos = async () => {
            try {
                setLoading(true); // Inicia carregamento

                const response = await fetch(`https://api.github.com/users/${username}/repos`);
                if (response.ok) {
                    const data: Repository[] = await response.json();
                    const updatedUserData: UserData = { ...userData!, repos: data };
                    setUserData(updatedUserData);
                    localStorage.setItem('userRepos', JSON.stringify(data));
                } else {
                    console.error('Erro ao buscar repositórios do usuário:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar repositórios do usuário:', error);
            } finally {
                setLoading(false); // Encerra i carregamento (tanto faz o resultad)
            }
        };

        if (initialUserData && !initialUserData.repos) {
            fetchUserRepos();
        }
    }, [username, initialUserData, userData]);

    return (
        <div className="user-details-container">
            {userData && (
                <div className="user-info">
                    <img src={userData.avatar_url} alt={`${userData.name}'s avatar`} />
                    <h2>Nome: {userData.name}</h2>
                    <p>Bio: {userData.bio}</p>
                </div>
            )}
            <div className="repositories">
                {userData?.repos?.map((repo: Repository, index: number) => (
                    <div
                        key={index}
                        className="repository-card"
                        onClick={() => setSelectedRepo(repo)}
                    >
                        <h3>Nome do repositorio: {repo.name}</h3>
                        <p>Link: <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.html_url}
                        </a></p>
                        <p>Descrição: {repo.description}</p>
                    </div>
                ))}
            </div>
            {selectedRepo && (
                <div className="modal modal-open">
                    <div className="modal-content">
                        <span className="modal-close" onClick={() => setSelectedRepo(null)}>
                            &#x2716;
                        </span>
                        <h3>{selectedRepo.name}</h3>
                        <p>Descrição: {selectedRepo.description}</p>
                        <p>Tipo de Privacidade: {selectedRepo.visibility}</p>
                        <p>Linguagem: {selectedRepo.language}</p>
                        <p>
                            Link do Repositório:{' '}
                            <a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer">
                                {selectedRepo.html_url}
                            </a>
                        </p>
                    </div>
                </div>
            )}
            {loading && (
                <div className="loading-animation">
                    <div className="loader"></div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
