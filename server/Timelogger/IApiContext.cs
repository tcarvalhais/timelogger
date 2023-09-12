using System;
using System.Collections.Generic;
using Timelogger.DTOS;
using Timelogger.Entities;

namespace Timelogger
{
    public interface IApiContext
    {
        IEnumerable<Project> GetProjects();
        Project GetProjectDetails(Guid projectId);
        Project CreateProject(CreateProjectDTO createProjectDTO);
        void DeleteProject(Guid projectId);
        IEnumerable<TimeRegistration> GetAllTimesRegistered(Guid projectId);
        int GetTotalTimeRegistered(Guid projectId);
        void ChangeProjectStatus(Guid projectId, Status newStatus);
        TimeRegistration RegisterTime(Guid projectId, RegisterTimeDTO registerTimeDTO);
    }
}