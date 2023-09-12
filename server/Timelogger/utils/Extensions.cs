using Timelogger.DTOS;
using Timelogger.Entities;

namespace Timelogger
{
    public static class Extensions
    {
        public static ProjectDTO AsDTO(this Project project)
        {
            return new ProjectDTO
            {
                Id = project.Id,
                Name = project.Name,
                CreationDateTimestamp = project.CreationDateTimestamp,
                DeadlineDateTimestamp = project.DeadlineDateTimestamp,
                ProjectStatus = project.ProjectStatus
            };
        }
    }
}