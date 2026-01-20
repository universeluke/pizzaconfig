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
    basket: {
        addToBasketButton: 'add-to-basket-button-test-id',
        openBasketButton: 'open-basket-button-test-id',
        removeItemButton: (item: string) => `remove-item-${item}-button-test-id`,
        placeOrderButton: 'place-order-button-test-id',
    },
    basketItems: {
        itemsList: 'basket-items-list-test-id'
    },
    pizzaOption: (option:string) => `pizza-option-${option}-test-id`,
    tracking: {
        trackingMessage: (stage: string) => `${stage}-tracking-message-test-id`
    }
}