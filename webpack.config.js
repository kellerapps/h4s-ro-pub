"use strict";
/**
 * Created by kenkeller on 4/13/17.
 */
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: "./app/app.js",
    output: {
        path: path.join(__dirname, "/public/js"),
        filename: '[name].[chunkhash].js',
        libraryTarget: 'var',
        library: 'h4sApp'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
        new CommonsChunkPlugin({
            name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
        }),
        function () {
            this.plugin("done", function (stats) {
                const statsAsObj = stats.toJson();
                const manifestJS = _.get(statsAsObj, "assetsByChunkName.manifest");
                const vendorJS = _.get(statsAsObj, "assetsByChunkName.vendor");
                const mainJS = _.get(statsAsObj, "assetsByChunkName.main");
                _.forEach(["index", "act"], (f) => {
                    const template = fs.readFileSync(path.join(__dirname, "template", `${f}.html`)).toString();
                    const compiledTemplate = _.template(template);
                    fs.writeFileSync(path.join(__dirname, "public", `${f}.html`), compiledTemplate({
                        'mainJS': 'js/' + mainJS,
                        'webpackManifestJS': 'js/' + manifestJS,
                        'vendorLibsJS': 'js/' + vendorJS
                    }));
                });
                const json = JSON.stringify(statsAsObj);
                fs.writeFileSync(path.join(__dirname, "webpack-stats.json"), json);
            });
        }
    ]
};
//# sourceMappingURL=webpack.config.js.map