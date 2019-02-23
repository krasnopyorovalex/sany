const smartGridConfig = require('smart-grid');

const settings = {
    outputStyle: 'styl',
    columns: 12,
    mobileFirst: false,
    offset: '2%',
    container: {
        maxWidth: '1280px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
            fields: '30px'
        },
        md: {
            width: '992px',
            fields: '15px'
        },
        sm: {
            width: '720px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '576px',
            fields: '10px'
        },
        xxs: {
            width: '380px',
            fields: '10px'
        }
    },
    oldSizeStyle: false,
    properties: [
        //'justify-content'
    ]
};

smartGridConfig('./src/precss', settings);