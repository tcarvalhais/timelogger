import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3001"
})

export const getProjects = async () => {
    try {
        const response = await api.get("/projects/getProjects")
        return response.data
    }
    catch (error) {
        console.log(error)
        return []
    }
}

export const getTotalTimeRegistered = async (projectId: any) => {
    try {
        const response = await api.get(`/projects/getTotalTimeRegistered/${projectId}`)
        return response.data.totalTimeMinutes
    }
    catch (error) {
        console.log(error)
        return 0
    }
}
