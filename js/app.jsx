/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const ReactDOM = require('react-dom');

const {Provider} = require('react-redux');

const App = require('./containers/Main');
const assign = require('object-assign');

const plugins = [
    require('../MapStore2/web/client/plugins/MousePosition'),
    require('../MapStore2/web/client/plugins/Print')
];

const reducers = plugins.map((plugin) => plugin.reducers).reduce((previous, current) => assign(previous, current), {});

const store = require('./stores/store')(reducers);

const {loadMapConfig} = require('../MapStore2/web/client/actions/config');
const {changeBrowserProperties} = require('../MapStore2/web/client/actions/browser');
const {loadLocale} = require('../MapStore2/web/client/actions/locale');
const {loadPrintCapabilities} = require('../MapStore2/web/client/actions/print');

const ConfigUtils = require('../MapStore2/web/client/utils/ConfigUtils');
const LocaleUtils = require('../MapStore2/web/client/utils/LocaleUtils');

store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

ConfigUtils
    .loadConfiguration()                       // localConfig.json: Global configuration
    .then(() => {                              // config.json: app configuration
        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('MapStore2/web/client/translations', locale));
        store.dispatch(loadPrintCapabilities(ConfigUtils.getConfigProp('printUrl')));
    });

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById("container")
);
