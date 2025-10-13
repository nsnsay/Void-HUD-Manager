<template>
    <div class="vireon-container">
        <div class="sidebar">
            <img class="sidebar-logo" src="./assets/logo.png" alt="">
            <div class="sidebar-items">
                <router-link v-for="item in items" :key="item.path" :to="item.path"
                    :class="['sidebar-item', { 'active': item.path === $route.path }]">
                    <img :src="item.logo" alt="">
                    <div class="title">{{ item.name }}</div>
                </router-link>
            </div>
        </div>
        <div class="content">
            <div class="content-inner">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.vireon-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    width: 100%;

    .sidebar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        width: var(--sidebar-width);
        height: 100%;
        background: var(--bg-secondary);
        gap: 2rem;
        border-right: 2px solid var(--border-light);

        .sidebar-logo {
            margin-top: 0.75rem;
            height: 48px;
            filter: drop-shadow(0 0 16px var(--primary));
        }

        .sidebar-items {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 1rem;

            .sidebar-item {
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                cursor: pointer;
                padding: 0.75rem;
                border-radius: var(--border-radius);
                transition: background-color 0.2s ease;
                position: relative;

                &:hover {
                    background: var(--bg-secondary);

                    .title {
                        opacity: 1;
                        transition: opacity 0.6s ease;
                    }
                }

                &.active {
                    background: var(--bg-primary);

                    img {
                        opacity: 1;
                    }
                }

                img {
                    height: 24px;
                    opacity: 0.6;
                }

                .title {
                    opacity: 0;
                    position: absolute;
                    left: 75px;
                    color: var(--text-primary);
                    pointer-events: none;
                    transition: opacity 0.6s ease;
                    background: rgba(var(--primary-rgb), 0.6);
                    padding: 0.5rem;
                    border-radius: 4px;
                    z-index: 100000;
                }
            }
        }
    }

    .content {
        width: var(--content-width);
        height: calc(100% - var(--header-height));
        border-top: 2px solid var(--border-light);
        position: relative;

        .content-inner {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
        }
    }
}
</style>

<script setup lang="ts">
import menuLogo from './content/menu.png'
import matchLogo from './content/matchs.png'
import playersLogo from './content/players.png'
import teamsLogo from './content/teams.png'
import settingsLogo from './content/settings.png'

const items = [
    {
        logo: menuLogo,
        name: 'Menu',
        path: '/menu',
        components: './content/menu/menu.vue'
    },
    {
        logo: matchLogo,
        name: 'Match',
        path: '/match',
        components: './content/match/match.vue'
    },
    {
        logo: playersLogo,
        name: 'Players',
        path: '/players',
        components: './content/players/players.vue'
    },
    {
        logo: teamsLogo,
        name: 'Teams',
        path: '/teams',
        components: './content/teams/teams.vue'
    },
    {
        logo: settingsLogo,
        name: 'Settings',
        path: '/settings',
        components: './content/settings/settings.vue'
    },
]
</script>
