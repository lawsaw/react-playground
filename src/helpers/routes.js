import React from 'react';
import { HOME_PAGE } from '../helpers/constants';

import {
    About,
    Test,
    Clock,
    Dashboard,
    TodoList,
    Tetris,
} from '../route-pages';

export const ROUTES = [
    {
        link: '/',
        label: 'Home',
        page: HOME_PAGE
    },{
        link: '/about',
        label: 'About',
        page: props => <About {...props} />
    },{
        link: '/test',
        label: 'Test',
        page: props => <Test {...props} />
    },{
        link: '/clock',
        label: 'Clock',
        page: props => <Clock {...props} />
    },{
        link: '/dashboard',
        label: 'Dashboard',
        page: props => <Dashboard {...props} />
    },{
        link: '/todo-list',
        label: 'Todo list',
        page: props => <TodoList {...props} />
    },{
        link: '/tetris',
        label: 'Tetris',
        page: props => <Tetris {...props} />
    }
];