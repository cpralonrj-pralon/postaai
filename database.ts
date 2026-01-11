// Database Service - IndexedDB para armazenamento local
// Gerencia todos os dados do PostaAI

import { ContentIdea, ScheduledContent } from './types';

const DB_NAME = 'PostaAI_DB';
const DB_VERSION = 1;

// Stores (tabelas)
const STORES = {
    IDEAS: 'ideas',
    SCHEDULED_CONTENT: 'scheduled_content',
    USER_PROFILE: 'user_profile'
};

interface UserProfile {
    id: string;
    niche: string;
    goal: string;
    tone?: 'professional' | 'casual' | 'humorous';
    targetAudience?: string;
    createdAt: Date;
    updatedAt: Date;
}

class DatabaseService {
    private db: IDBDatabase | null = null;

    /**
     * Inicializa o banco de dados
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('❌ Erro ao abrir banco de dados:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ Banco de dados inicializado');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Store de Ideias
                if (!db.objectStoreNames.contains(STORES.IDEAS)) {
                    const ideasStore = db.createObjectStore(STORES.IDEAS, { keyPath: 'id' });
                    ideasStore.createIndex('createdAt', 'createdAt', { unique: false });
                    ideasStore.createIndex('isFavorite', 'isFavorite', { unique: false });
                    console.log('📦 Store "ideas" criada');
                }

                // Store de Conteúdos Agendados
                if (!db.objectStoreNames.contains(STORES.SCHEDULED_CONTENT)) {
                    const scheduledStore = db.createObjectStore(STORES.SCHEDULED_CONTENT, { keyPath: 'id' });
                    scheduledStore.createIndex('date', 'date', { unique: false });
                    scheduledStore.createIndex('status', 'status', { unique: false });
                    scheduledStore.createIndex('platform', 'platform', { unique: false });
                    console.log('📦 Store "scheduled_content" criada');
                }

                // Store de Perfil do Usuário
                if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
                    db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id' });
                    console.log('📦 Store "user_profile" criada');
                }
            };
        });
    }

    /**
     * Salvar ideia gerada
     */
    async saveIdea(idea: ContentIdea & { createdAt?: Date; isFavorite?: boolean; isUsed?: boolean }): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.IDEAS], 'readwrite');
            const store = transaction.objectStore(STORES.IDEAS);

            const ideaWithMetadata = {
                ...idea,
                createdAt: idea.createdAt || new Date(),
                isFavorite: idea.isFavorite || false,
                isUsed: idea.isUsed || false
            };

            const request = store.put(ideaWithMetadata);

            request.onsuccess = () => {
                console.log('✅ Ideia salva:', idea.id);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Erro ao salvar ideia:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Buscar todas as ideias
     */
    async getAllIdeas(): Promise<ContentIdea[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.IDEAS], 'readonly');
            const store = transaction.objectStore(STORES.IDEAS);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Deletar ideia
     */
    async deleteIdea(id: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.IDEAS], 'readwrite');
            const store = transaction.objectStore(STORES.IDEAS);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('🗑️ Ideia deletada:', id);
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Salvar conteúdo agendado
     */
    async saveScheduledContent(content: ScheduledContent): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.SCHEDULED_CONTENT], 'readwrite');
            const store = transaction.objectStore(STORES.SCHEDULED_CONTENT);
            const request = store.put(content);

            request.onsuccess = () => {
                console.log('✅ Conteúdo agendado salvo:', content.id);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Erro ao salvar conteúdo:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Buscar todos os conteúdos agendados
     */
    async getAllScheduledContent(): Promise<ScheduledContent[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.SCHEDULED_CONTENT], 'readonly');
            const store = transaction.objectStore(STORES.SCHEDULED_CONTENT);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Buscar conteúdos por status
     */
    async getContentByStatus(status: string): Promise<ScheduledContent[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.SCHEDULED_CONTENT], 'readonly');
            const store = transaction.objectStore(STORES.SCHEDULED_CONTENT);
            const index = store.index('status');
            const request = index.getAll(status);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Atualizar status do conteúdo
     */
    async updateContentStatus(id: string, status: ScheduledContent['status']): Promise<void> {
        if (!this.db) await this.init();

        return new Promise(async (resolve, reject) => {
            const transaction = this.db!.transaction([STORES.SCHEDULED_CONTENT], 'readwrite');
            const store = transaction.objectStore(STORES.SCHEDULED_CONTENT);

            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const content = getRequest.result;
                if (content) {
                    content.status = status;
                    const updateRequest = store.put(content);

                    updateRequest.onsuccess = () => {
                        console.log('✅ Status atualizado:', id, status);
                        resolve();
                    };

                    updateRequest.onerror = () => {
                        reject(updateRequest.error);
                    };
                } else {
                    reject(new Error('Conteúdo não encontrado'));
                }
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    /**
     * Deletar conteúdo agendado
     */
    async deleteScheduledContent(id: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.SCHEDULED_CONTENT], 'readwrite');
            const store = transaction.objectStore(STORES.SCHEDULED_CONTENT);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('🗑️ Conteúdo deletado:', id);
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Salvar perfil do usuário
     */
    async saveUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.USER_PROFILE], 'readwrite');
            const store = transaction.objectStore(STORES.USER_PROFILE);

            const profileWithDates: UserProfile = {
                ...profile,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const request = store.put(profileWithDates);

            request.onsuccess = () => {
                console.log('✅ Perfil salvo');
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Buscar perfil do usuário
     */
    async getUserProfile(): Promise<UserProfile | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.USER_PROFILE], 'readonly');
            const store = transaction.objectStore(STORES.USER_PROFILE);
            const request = store.get('default');

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Limpar todos os dados (útil para reset)
     */
    async clearAllData(): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [STORES.IDEAS, STORES.SCHEDULED_CONTENT, STORES.USER_PROFILE],
                'readwrite'
            );

            const stores = [
                transaction.objectStore(STORES.IDEAS),
                transaction.objectStore(STORES.SCHEDULED_CONTENT),
                transaction.objectStore(STORES.USER_PROFILE)
            ];

            Promise.all(stores.map(store => {
                return new Promise((res, rej) => {
                    const req = store.clear();
                    req.onsuccess = () => res(true);
                    req.onerror = () => rej(req.error);
                });
            }))
                .then(() => {
                    console.log('🗑️ Todos os dados foram limpos');
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Obter estatísticas
     */
    async getStats() {
        const [ideas, scheduled] = await Promise.all([
            this.getAllIdeas(),
            this.getAllScheduledContent()
        ]);

        const planned = scheduled.filter(c => c.status === 'Planejado').length;
        const pending = scheduled.filter(c => c.status === 'Pendente').length;
        const published = scheduled.filter(c => c.status === 'Publicado').length;

        return {
            totalIdeas: ideas.length,
            favoriteIdeas: ideas.filter((i: any) => i.isFavorite).length,
            totalScheduled: scheduled.length,
            planned,
            pending,
            published,
            draft: scheduled.filter(c => c.status === 'Rascunho').length
        };
    }
}

// Exportar instância singleton
const db = new DatabaseService();
export default db;

// Inicializar automaticamente
db.init().catch(console.error);
