const path = require('path');

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    assetPrefix: process.env.NODE_ENV === "production" ? "/next_blog" : ""
};
