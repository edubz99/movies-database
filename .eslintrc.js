module.exports = {
    "extends": [
        "prettier",
        "prettier/react"
    ],
    "env": {
        "browser": true,
        "node": true,
        "es6": true 
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "prettier/prettier": [
            "error",
            {
                "traillingComma": "es5",
                "singleQuote": true,
                "printWidth": 120,
            }
        ]
    }
    // "plugins": [
    //     "prettier"
    // ]
};