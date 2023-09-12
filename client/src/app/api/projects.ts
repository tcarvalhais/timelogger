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

export const addNewProject = async (projectName: string, deadlineDate: number) => {
    try {
        const creationDateTimestamp = Math.floor(new Date().getTime() / 1000)
        const body = {
            name: projectName,
            creationDateTimestamp: creationDateTimestamp,
            deadlineDateTimestamp: deadlineDate
        }

        const response = await api.post("/projects/createProject", body)
        return response.data
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export const getAllTimesRegistered = async (projectId: any) => {
    try {
        const response = await api.get(`/projects/getAllTimesRegistered/${projectId}`)
        return response.data
    }
    catch (error) {
        console.log(error)
        return []
    }
}

export const registerTime = async (projectId: any, timeMinutes: number) => {
    try {
        const registrationDateTimestamp = Math.floor(new Date().getTime() / 1000)
        const body = {
            registrationTimestamp: registrationDateTimestamp,
            timeMinutes: timeMinutes
        }

        const response = await api.post(`/projects/registerTime/${projectId}`, body)
        return response.data
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export const deleteProject = async (projectId: any) => {
    try {
        const response = await api.delete(`/projects/deleteProject/${projectId}`)
        return response.data
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

export const changeProjectStatus = async (projectId: any, status: number) => {
    try {
        let response
        if (status == 0) {
            response = await api.put(`/projects/startProject/${projectId}`)
        }
        else {
            response = await api.put(`/projects/completeProject/${projectId}`)
        }

        return response.data
    }
    catch (error) {
        console.log(error)
        throw error
    }
}
