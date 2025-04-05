import { getMe } from "../api/api"
import { getFromLocalStorage, setToLocalStorage } from "./persisters"

const getUser = async () => {
    const user = getFromLocalStorage("user")
    if (user) {
        return user
    }
    try {
        const userData = await getMe()
        setToLocalStorage("user", userData)
    } catch (error) {
        console.error("Error fetching user data:", error)
    }
}

export {
    getUser
}