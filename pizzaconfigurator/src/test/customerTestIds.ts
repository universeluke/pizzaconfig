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
        submit: 'submit-login-test-id',
        confirmPassword: 'confirm-password-login-test-id'
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
    },
    enablePushButton: 'enable-push-button-test-id',
    kitchenNotesTextArea: 'kitchen-notes-text-area-test-id',
    title: 'title-test-id',
    history: {
        sauce: (id:string, name:any) => `${id}-${name}-sauce-test-id`,
        cheese: (id:string, name:any) => `${id}-${name}-cheese-test-id`,
        topping: (id:string, name:any) => `${id}-${name}-topping-test-id`,
        oil: (id:string, name:any) => `${id}-${name}-oil-test-id`,
        herb: (id:string, name:any) => `${id}-${name}-herb-test-id`,
        dip: (id:string, name:any) => `${id}-${name}-dip-test-id`,
    },
    profile: {
        notSignedIn: 'not-signed-in-test-id',
        logoutButton: 'logout-button-test-id',
        signedInAs: 'signed-in-as-test-id'
    },
    notification: {
        notificationDismissButton: 'notification-dismiss-button-test-id',
        notification: 'notification-test-id',
        notificationText: 'notification-text-test-id',
        notificationContainer: 'notification-container-test-id'
    },
    recentPizzaTrack:{
        container: 'recent-pizza-track-container-test-id',
        title: 'recent-pizza-track-title-test-id',
        item: 'recent-pizza-track-item-test-id',
        link:'recent-pizza-track-link-test-id'
    }
}