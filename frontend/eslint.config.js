import js from '@eslint/js'
import prettier from '@vue/eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
