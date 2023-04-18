import * as vueRouter from 'vue-router'
import HomeViewVue from '@/views/HomeView.vue';
import LoginViewVue from '@/views/LoginView.vue';

// Importando o pacote vue-router
const router = vueRouter.createRouter({
    // Configurando o modo de histórico da navegação
    history: vueRouter.createWebHistory(import.meta.env.BASE_URL),

    // Definindo as rotas da aplicação
    routes: [
        {
            // Rota para a página do chat
            path: '/chatwpp',
            name: 'chatwpp',
            component: HomeViewVue,

            // Meta informações sobre a rota
            meta: {
                requiresAuth: true
            }
        },
        {
            // Rota para a página de login
            path: '/login',
            name: 'login',
            component: LoginViewVue,

            // Meta informações sobre a rota
            meta: {
                requiresAuth: false
            }
        }
    ]
});

// Função que é executada antes de cada mudança de rota
router.beforeEach((to, from, next) => {
    // Verifica se o token de autenticação existe no armazenamento local
    const hasToken = !!localStorage.getItem('token');

    // Verifica se a rota requer autenticação e se o token existe
    if (to.meta.requiresAuth && !hasToken) {
        // Redireciona para a página de login caso não esteja autenticado
        next({ name: 'login' });
    }
    // Verifica se a rota não requer autenticação e se o token existe
    else if (!to.meta.requiresAuth && hasToken) {
        // Redireciona para a página do chat caso já esteja autenticado
        next({ name: 'chatwpp' });
    }
    // Permite a mudança de rota caso não se enquadre nas condições acima
    else {
        next();
    }
});

// Exporta o objeto de rotas
export default router;