const logoutButton = new LogoutButton;
const ratesBoard = new RatesBoard;
const moneyManager = new MoneyManager;
const favoritesWidget = new FavoritesWidget;


// Выход из личного кабинета
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};


// Получение информации о пользователе
function getUserInformation() {
    ApiConnector.current((response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
    });
}

// Получение текущих курсов валюты
function getExchangeRate() {
    ApiConnector.getStocks((response) => {
        if (response) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getUserInformation();
getExchangeRate();

setInterval(() => {
    getExchangeRate();
}, 60000);


// Операции с деньгами

// пополнение баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }

        moneyManager.setMessage(
            response.success,
            response.error || 'Перевод выполнен успешно'
        );
    });
};

// конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }

        moneyManager.setMessage(
            response.success,
            response.error || 'Конвертация выполнена успешно'
        );
    });
};

// перевод валюты
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }

        moneyManager.setMessage(
            response.success,
            response.error || 'Конвертация выполнена успешно'
        );
    });
};

// Запрос начального списка избранного

favoritesWidget.getFavorites = (data) => {
    ApiConnector(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
};

// добавление пользователя из списка избранных

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        };

        favoritesWidget.setMessage(
            response.success,
            response.error || 'Добавление пользователя выполнено успешно'
        )
    });
};

/// удаление пользователя из списка избранных

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }

        favoritesWidget.setMessage(
            response.success,
            response.error || 'Удаление пользователя выполнено успешно'
        );
    });
};
