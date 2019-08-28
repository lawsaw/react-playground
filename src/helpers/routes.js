import React from 'react';

import {
    Home,
    About,
    Test,
    Clock,
    Dashboard,
} from '../route-pages';

export const ROUTES = [
    {
        link: '/',
        label: 'Home',
        page: props => <Home {...props} />
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
    }
];