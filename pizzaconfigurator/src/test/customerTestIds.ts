export const customerTestIds = {
    option: (option: string) => `${option}-test-id`,
    category: (category: string) => `${category}-test-id`,
    burger: {
        panel: 'burger-panel-test-id',
        openButton: 'burger-open-button-test-id',
        closeButton: 'burger-close-button-test-id',
        link: (link: string) => `burger-${link}-test-id`
    },
    login: {
        email: 'email-login-test-id',
        password: 'password-login-test-id',
        submit: 'submit-login-test-id'
    },
}