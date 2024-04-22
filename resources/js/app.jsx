import {createRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import React from 'react'

import 'semantic-ui-css/semantic.min.css'
import '@fontsource/roboto';
import './bootstrap';
import '../css/app.css';
import {Provider} from "react-redux";
import {store, persistor} from "@/redux/store.js";
import {PersistGate} from 'redux-persist/integration/react'
import {Toaster} from "react-hot-toast";


createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({el, App, props}) {
        const root = createRoot(el);
        root.render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                    />
                    <App {...props}/>
                </PersistGate>
            </Provider>
        );
    },
    progress: {
        color: '#0284c7',
    },
}).then(r => console.log('----- App made by Bui Huy Anh -------'));
