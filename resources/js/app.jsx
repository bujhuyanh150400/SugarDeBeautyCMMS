import {createRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import React from 'react'
import {ConfigProvider} from 'antd';
import './bootstrap';
import '../css/app.css';
import viVN from 'antd/locale/vi_VN';
import {Provider} from "react-redux";
import {store, persistor} from "@/redux/store.js";
import 'antd/dist/reset.css'
import {PersistGate} from 'redux-persist/integration/react'
import Toast from "@/Components/Toast.jsx";
import Loading from "@/Components/Loading.jsx";

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({el, App, props}) {
        const root = createRoot(el);
        root.render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ConfigProvider autoInsertSpaceInButton={false} locale={viVN}>
                        <React.StrictMode>
                            <Loading/>
                            <Toast/>
                            <App {...props}/>
                        </React.StrictMode>
                    </ConfigProvider>
                </PersistGate>
            </Provider>
        );
    },
    progress: {
        color: '#0284c7',
    },
}).then(r => console.log('----- App made by Bui Huy Anh -------'));
