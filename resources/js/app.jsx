import {createRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import React from 'react'
import '@fontsource/roboto';
import './bootstrap';
import '../css/app.css';
import 'rsuite/dist/rsuite.min.css';
import {Provider} from "react-redux";
import {store, persistor} from "@/redux/store.js";
import {PersistGate} from 'redux-persist/integration/react'
import {Toaster} from "react-hot-toast";
import Loading from "@/Components/Loading.jsx";


createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({el, App, props}) {
        const root = createRoot(el);
        root.render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Toaster
                        gutter={8}
                        position="top-right"
                        reverseOrder={false}
                    />
                    <Loading />
                    <App {...props}/>
                </PersistGate>
            </Provider>
        );
    },
    progress: false,
}).then(r => console.warn('----- App made by Bui Huy Anh -------'));
