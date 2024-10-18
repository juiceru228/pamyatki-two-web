const Logout = async () => {
    try {
        const response = await fetch("https://p2w.pro/api/auth/logout/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            console.log("Пользователь успешно вышел из аккаунта");
            window.location.reload();
        } else {
            const data = await response.text();
            console.error(data);
        }
    } catch (error) {
        console.error("Ошибка при выходе из аккаунта:", error);
    }
}

export default Logout;
