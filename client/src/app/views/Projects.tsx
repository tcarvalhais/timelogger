import React, { useEffect, useState } from "react"
import ProjectTable from "../components/ProjectTable"
import AddProjectDialog from "../components/AddProjectDialog"
import { addNewProject, getProjects, getTotalTimeRegistered } from "../api/projects"
import { Alert, Snackbar } from "@mui/material"
import { Project } from "../../utils"

export default function Projects() {
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [listProjects, setListProjects] = useState<Project[]>([])

    useEffect(() => {
        const getListProjects = async () => {
            const projects = await getProjects()
            const projectsWithTotalTime = await Promise.all(
                projects.map(async (project: { id: any }) => {
                    const timeSpent = await getTotalTimeRegistered(project.id)
                    return { ...project, timeSpent: timeSpent, key: project.id }
                })
            )

            setListProjects(projectsWithTotalTime)
        }

        getListProjects()
    }, [])

    const handleOpenSnackbar = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    const handleAddProject = async (newProject: { name: string; deadlineDate: string }) => {
        try {
            await addNewProject(newProject.name, parseInt(newProject.deadlineDate, 10))

            handleOpenSnackbar('Project added successfully', 'success')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        catch (error: any) {
            handleOpenSnackbar('Error adding project: One or more parameters are blank', 'error')
        }

        setIsDialogOpen(false)
    }

    return (
        <>
            <div className="flex items-center my-6">
                <div className="w-1/2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setIsDialogOpen(true)}>
                        Add Project
                    </button>
                </div>

                <div className="w-1/2 flex justify-end">
                    <form>
                        <input
                            className="border rounded-full py-2 px-4"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full py-2 px-4 ml-2"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <ProjectTable listProjects={listProjects} />

            <AddProjectDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onAdd={handleAddProject}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}>
                <Alert
                    elevation={6}
                    variant="filled"
                    severity={snackbarSeverity}
                    onClose={() => setOpenSnackbar(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}
